'use strict';

var AuthorizationContext = require('../index').AuthorizationContext;
var Role = require('../index').Role;

var chai = require('chai');
var expect = chai.expect;
var log4js = require('log4js'), util = require('util');

var log = log4js.getLogger('Role_test');

describe('', function () {
    // default timeout is 2000 ms
    // this.timeout(30000)  
    var role;
    var TYPE_NAME = 'janux.security.Role';
    var ROLE_NAME = 'HUMAN_RESOURCES_MANAGER';
    var ROLE_DESCR = 'Can view, modify, create and delete personel records';
    var personAuthContext;
    var accountAuthContext;
    var permBits = ['READ', 'UPDATE', 'CREATE', 'TRASH', 'DELETE'];

    // run once before the test suite below
    before(function () {
        personAuthContext = AuthorizationContext.createInstance('PERSON', 'Defines permissions available on a Person entity');

        permBits.forEach(function (bitName) {
            personAuthContext.addPermissionBit(bitName, util.format('Grants permission to %s a %s', bitName, 'PERSON'));
        });

        accountAuthContext = AuthorizationContext.createInstance('ACCOUNT', 'Defines permissions available on an Account entity');

        ['READ', 'UPDATE', 'CREATE', 'TRASH', 'DELETE'].forEach(function (bitName) {
            accountAuthContext.addPermissionBit(bitName, util.format('Grants permission to %s a %s', bitName, 'ACCOUNT'));
        });
    });

    function assertPermissions(role) {
        expect(role.hasPermission('READ', 'PERSON')).to.equal(true);
        expect(role.hasPermissions(['READ', 'UPDATE'], 'PERSON')).to.equal(true);
        expect(role.hasPermissions(['READ', 'UPDATE', 'TRASH'], 'PERSON')).to.equal(true);
        expect(role.hasPermission('CREATE', 'PERSON')).to.equal(false);
        expect(role.hasPermissions(['READ', 'UPDATE', 'CREATE'], 'PERSON')).to.equal(false);
        expect(role.hasPermissions(['READ', 'UPDATE', 'CREATE', 'DELETE'], 'PERSON')).to.equal(false);
        expect(role.hasPermission('READ', 'ACCOUNT')).to.equal(true);
        expect(role.hasPermissions(['READ', 'UPDATE'], 'ACCOUNT')).to.equal(true);
        expect(role.hasPermission('CREATE', 'ACCOUNT')).to.equal(false);
        expect(role.hasPermissions(['READ', 'UPDATE', 'CREATE'], 'ACCOUNT')).to.equal(false);
        expect(role.hasPermissions(['READ', 'UPDATE', 'CREATE', 'DELETE'], 'ACCOUNT')).to.equal(false);
    }
    describe('Role', function () {
        beforeEach(function () {
            role = Role.createInstance(ROLE_NAME, ROLE_DESCR);
        });

        it('should instantiate with basic fields', function () {
            log.debug('role after creation: %j', role);
            expect(role.typeName).to.equal(TYPE_NAME);
            expect(role.name).to.equal(ROLE_NAME);
            expect(role.description).to.equal(ROLE_DESCR);
            expect(role.sortOrder).to.equal(0);
        });

		it('typeName should be immutable', function () {
            expect(role.typeName).to.equal(TYPE_NAME);
            try {
                role.typeName = 'somethingElse';
                expect.fail('role.typeName should be immutable');
            }
            catch (e) {
            }
            expect(role.typeName).to.equal(TYPE_NAME);
        });

		it('should be possible to grant permissions to a Role', function () {
            role.grant(['READ', 'UPDATE', 'TRASH'], personAuthContext)
                .grant(['READ', 'UPDATE'], accountAuthContext);
            log.info('role after granting permissions: %j', role);
            assertPermissions(role);
        });

		it('should obtain the list of permissions granted', function () {
			var bitsToGrant = ['READ', 'UPDATE', 'TRASH'];

			role.grant(bitsToGrant, personAuthContext);

			var grantedBits = role.getGrantAsBitList(personAuthContext.name);

			expect(bitsToGrant[0]).to.equal(grantedBits[0]);
			expect(bitsToGrant[1]).to.equal(grantedBits[1]);
			expect(bitsToGrant[2]).to.equal(grantedBits[2]);
		});

		it('should obtain empty list of permissions granted', function () {
			var bitsToGrant = ['READ', 'UPDATE', 'TRASH'];

			role.grant(bitsToGrant, personAuthContext);

			var grantedBits = role.getGrantAsBitList('wrong-context');

			expect(grantedBits.length).to.equal(0);
		});

		it('should have multiple role instances without collisions', function () {
            var role2 = Role.createInstance('HR2');
            role.grant(['READ', 'UPDATE', 'DELETE'], personAuthContext);
            role2.grant(['READ'], personAuthContext);
            expect(role2.hasPermission('READ', 'PERSON')).to.equal(true);
            expect(role2.hasPermission('UPDATE', 'PERSON')).to.equal(false);
            expect(role2.hasPermission('DELETE', 'PERSON')).to.equal(false);
            expect(role.hasPermissions(['READ', 'UPDATE'], 'PERSON')).to.equal(true);
            expect(role.hasPermissions(['READ', 'UPDATE', 'DELETE'], 'PERSON')).to.equal(true);
            expect(role2.hasPermissions(['READ', 'UPDATE'], 'PERSON')).to.equal(false);
            expect(role2.hasPermissions(['READ', 'UPDATE', 'DELETE'], 'PERSON')).to.equal(false);
        });

		it('that is almighty should be able to have all permissions', function () {
            role.isAlmighty = true;
            log.info('role after granting almightiness: %j', role);
            expect(role.hasPermission('READ', 'PERSON')).to.equal(true);
            expect(role.hasPermissions(['READ', 'UPDATE'], 'PERSON')).to.equal(true);
            expect(role.hasPermissions(['READ', 'UPDATE', 'TRASH'], 'PERSON')).to.equal(true);
            expect(role.hasPermissions(['READ', 'UPDATE', 'CREATE'], 'PERSON')).to.equal(true);
            expect(role.hasPermissions(['READ', 'UPDATE', 'CREATE', 'DELETE'], 'PERSON')).to.equal(true);
            expect(role.hasPermission('READ', 'ACCOUNT')).to.equal(true);
            expect(role.hasPermissions(['READ', 'UPDATE'], 'ACCOUNT')).to.equal(true);
            expect(role.hasPermission('CREATE', 'ACCOUNT')).to.equal(true);
            expect(role.hasPermissions(['READ', 'UPDATE', 'CREATE'], 'ACCOUNT')).to.equal(true);
            expect(role.hasPermissions(['READ', 'UPDATE', 'CREATE', 'DELETE'], 'ACCOUNT')).to.equal(true);
        });

		it('should be deserializable via fromJSON', function () {
            role.grant(['READ', 'UPDATE', 'TRASH'], personAuthContext)
                .grant(['READ', 'UPDATE'], accountAuthContext);
            var role2 = Role.fromJSON(role.toJSON());
            expect(role2.name).to.equal(role.name);
            expect(role2.description).to.equal(role.description);
            assertPermissions(role2);
        });
    });
    // assertions
    // see http://chaijs.com/api/bdd
    // some_prop.should.equal('somevalue'); // fails if some_prop is null
    // some_prop.should.have.length(3); 
    // some_prop.should.be.a('string');
    // some_prop.should.have.property;
    //
    // expect(something).to.be.empty|true|false|null|undefine;
    // expect(something).to.be.not.empty;
    // expect(something).to.equal(some_value);
    // expect(something).to.be.instanceof(Array|String|Number|Function|Object);
});
