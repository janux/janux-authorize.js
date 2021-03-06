var AuthorizationContext = require('../index').AuthorizationContext;
var AuthorizationHolder = require('../index').AuthorizationHolder;

var chai = require('chai');
var expect = chai.expect;
var log4js = require('log4js'), util = require('util');
var log = log4js.getLogger('AuthorizationHolder_test');

describe('AuthorizationHolderSetup', function () {
    // default timeout is 2000 ms
    // this.timeout(30000)
    var TYPE_NAME = 'janux.security.AuthorizationHolder';
    var authHolder, authContext;

    // run once before the test suite below
    before(function () {
        authContext = AuthorizationContext.createInstance('PERSON', 'Defines permissions available on a Person entity');
        authContext.addPermissionBit('READ', 'Grants permission to READ a PERSON');
        authContext.addPermissionBit('UPDATE', 'Grants permission to UPDATE a PERSON');
        authContext.addPermissionBit('CREATE', 'Grants permission to CREATE a PERSON');
        authContext.addPermissionBit('TRASH', 'Grants permission to TRASH a PERSON');
        authContext.addPermissionBit('DELETE', 'Grants permission to DELETE a PERSON');
    });
    describe('AuthorizationHolder', function () {
        beforeEach(function () {
            authHolder = new AuthorizationHolder();
        });
        it('should instantiate with basic fields', function () {
            log.debug('authHolder after creation: %j', authHolder);
            expect(authHolder.typeName).to.equal(TYPE_NAME);
            // expect(authHolder.spec()).to.be.instanceof(Object);
        });
        it('typeName should be immutable', function () {
            expect(authHolder.typeName).to.equal(TYPE_NAME);
            try {
                authHolder.typeName = 'somethingElse';
                expect.fail('should not be able to assign to authHolder.typeName');
            }
            catch (e) {
            }
            expect(authHolder.typeName).to.equal(TYPE_NAME);
        });
        function assertPermissions(authHolder) {
            expect(authHolder.hasPermission('READ', 'PERSON')).to.equal(true);
            expect(authHolder.hasPermissions(['READ', 'UPDATE'], 'PERSON')).to.equal(true);
            expect(authHolder.hasPermissions(['READ', 'UPDATE', 'DELETE'], 'PERSON')).to.equal(true);
            expect(authHolder.hasPermission('CREATE', 'PERSON')).to.equal(false);
            expect(authHolder.hasPermissions(['READ', 'UPDATE', 'CREATE'], 'PERSON')).to.equal(false);
            expect(authHolder.hasPermissions(['READ', 'UPDATE', 'CREATE', 'DELETE'], 'PERSON')).to.equal(false);
            // preferred 'can' style syntax
            expect(authHolder.can('READ', 'PERSON')).to.equal(true);
            expect(authHolder.can(['READ', 'UPDATE'], 'PERSON')).to.equal(true);
            expect(authHolder.can(['READ', 'UPDATE', 'DELETE'], 'PERSON')).to.equal(true);
            expect(authHolder.can('CREATE', 'PERSON')).to.equal(false);
            expect(authHolder.can(['READ', 'UPDATE', 'CREATE'], 'PERSON')).to.equal(false);
            expect(authHolder.can(['READ', 'UPDATE', 'CREATE', 'DELETE'], 'PERSON')).to.equal(false);
        }
        it('should be possible to grant permissions to a AuthorizationHolder using an array of strings', function () {
            authHolder.grant(['READ', 'UPDATE', 'DELETE'], authContext);
            assertPermissions(authHolder);
        });
        it('should be possible to grant permissions to a AuthorizationHolder using a number', function () {
            authHolder.grant(parseInt('10011', 2), authContext);
            assertPermissions(authHolder);
        });
        it('should return false when passed a non-existent permission flag', function () {
            authHolder.grant(['READ', 'UPDATE', 'CREATE', 'TRASH', 'DELETE'], authContext);
            expect(authHolder.hasPermission('REED', 'PERSON')).to.equal(false);
            expect(authHolder.hasPermissions(['REED', 'UPDATE'], 'PERSON')).to.equal(false);
            expect(authHolder.can('REED', 'PERSON')).to.equal(false);
            expect(authHolder.can(['REED', 'UPDATE'], 'PERSON')).to.equal(false);
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
