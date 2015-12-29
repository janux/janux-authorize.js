/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../src/collections.ts" />

import basarat = require('../src/collections');
import collections = basarat.collections;
import AuthorizationContext from '../src/impl/AuthorizationContext';
import PermissionBit from  '../src/impl/PermissionBit';
import Role from '../src/impl/Role';

import chai = require('chai');
var expect = chai.expect;

var
    log4js = require('log4js'),
    util   = require('util')
    ;

var log = log4js.getLogger('Role_test');

describe ('', ()=> {
    // default timeout is 2000 ms
    // this.timeout(30000)  
    var role: Role;
    var TYPE_NAME = 'janux.security.Role';
    var ROLE_NAME = 'HUMAN_RESOURCES_MANAGER';
    var ROLE_DESCR = 'Can view, modify, create and delete personel records';
    
    var personAuthContext;
    var accountAuthContext;
    
    var permBits = ['READ', 'UPDATE', 'CREATE', 'TRASH', 'DELETE'];

    // run once before the test suite below
    before(()=> {
        personAuthContext = new AuthorizationContext('PERSON', 'Defines permissions available on a Person entity');

        permBits.forEach( function(bitName) {
            personAuthContext.addPermissionBit( new PermissionBit(bitName, util.format('Grants permission to %s a %s', bitName, 'PERSON') ) );
        });

        accountAuthContext = new AuthorizationContext('ACCOUNT', 'Defines permissions available on an Account entity');
        ['READ', 'UPDATE', 'CREATE', 'TRASH', 'DELETE'].forEach( function(bitName) {
            accountAuthContext.addPermissionBit( new PermissionBit(bitName, util.format('Grants permission to %s a %s', bitName, 'ACCOUNT') ) );
        });

    });

    function assertPermissions(role) {
        expect(role.hasPermission('READ', 'PERSON')).to.equal(true);
        expect(role.hasPermissions(['READ','UPDATE'] , 'PERSON')).to.equal(true);
        expect(role.hasPermissions(['READ','UPDATE','TRASH'] , 'PERSON')).to.equal(true);

        expect(role.hasPermission('CREATE','PERSON')).to.equal(false);
        expect(role.hasPermissions(['READ','UPDATE','CREATE'] , 'PERSON')).to.equal(false);
        expect(role.hasPermissions(['READ','UPDATE','CREATE','DELETE'] , 'PERSON')).to.equal(false);


        expect(role.hasPermission('READ', 'ACCOUNT')).to.equal(true);
        expect(role.hasPermissions(['READ','UPDATE'] , 'ACCOUNT')).to.equal(true);

        expect(role.hasPermission('CREATE' , 'ACCOUNT')).to.equal(false);
        expect(role.hasPermissions(['READ','UPDATE','CREATE'] , 'ACCOUNT')).to.equal(false);
        expect(role.hasPermissions(['READ','UPDATE','CREATE','DELETE'] , 'ACCOUNT')).to.equal(false);
    }

    describe('Role', ()=> {

        beforeEach(()=> {
            role = new Role(ROLE_NAME, ROLE_DESCR);
        });

        it('should instantiate with basic fields', ()=> {
            log.debug('role after creation: %j', role);
            expect(role.typeName).to.equal(TYPE_NAME);
            expect(role.getName()).to.equal(ROLE_NAME);
            expect(role.getDescription()).to.equal(ROLE_DESCR);
            expect(role.getSortOrder()).to.equal(0);
        });

        it('typeName should be immutable', ()=> {
            expect(role.typeName).to.equal(TYPE_NAME);
            try {
                role.typeName = 'somethingElse';
                expect.fail('role.typeName should be immutable');
            } catch (e) {
                //no-op
            }
            expect(role.typeName).to.equal(TYPE_NAME);
        });

        it('should be possible to grant permissions to a Role', ()=> {
            role.grant(['READ','UPDATE','TRASH'], personAuthContext)
                .grant(['READ','UPDATE'], accountAuthContext);

            log.info('role after granting permissions: %j', role);
            assertPermissions(role);
        });

        it('should have multiple role instances without collisions', ()=> {
            var role2 = new Role('HR2');
        
            role.grant(['READ','UPDATE', 'DELETE'], personAuthContext);
            role2.grant(['READ'], personAuthContext);
        
            expect(role2.hasPermission('READ',   'PERSON')).to.equal(true);
            expect(role2.hasPermission('UPDATE', 'PERSON')).to.equal(false);
            expect(role2.hasPermission('DELETE', 'PERSON')).to.equal(false);
        
            expect(role.hasPermissions(['READ','UPDATE'] , 'PERSON')).to.equal(true);
            expect(role.hasPermissions(['READ','UPDATE','DELETE'] , 'PERSON')).to.equal(true);
        
            expect(role2.hasPermissions(['READ','UPDATE'] , 'PERSON')).to.equal(false);
            expect(role2.hasPermissions(['READ','UPDATE','DELETE'] , 'PERSON')).to.equal(false);
        });

        it('that is almighty should be able to have all permissions', ()=> {
            role.setAlmighty(true);
            log.info('role after granting almightiness: %j', role);

            expect(role.hasPermission('READ', 'PERSON')).to.equal(true);
            expect(role.hasPermissions(['READ','UPDATE'] , 'PERSON')).to.equal(true);
            expect(role.hasPermissions(['READ','UPDATE','TRASH'] , 'PERSON')).to.equal(true);

            expect(role.hasPermissions(['READ','UPDATE','CREATE'] , 'PERSON')).to.equal(true);
            expect(role.hasPermissions(['READ','UPDATE','CREATE','DELETE'] , 'PERSON')).to.equal(true);

            expect(role.hasPermission('READ', 'ACCOUNT')).to.equal(true);
            expect(role.hasPermissions(['READ','UPDATE'] , 'ACCOUNT')).to.equal(true);

            expect(role.hasPermission('CREATE' , 'ACCOUNT')).to.equal(true);
            expect(role.hasPermissions(['READ','UPDATE','CREATE'] , 'ACCOUNT')).to.equal(true);
            expect(role.hasPermissions(['READ','UPDATE','CREATE','DELETE'] , 'ACCOUNT')).to.equal(true);
        });

        it('should be deserializable via fromJSON', ()=> {
            role.grant(['READ','UPDATE','TRASH'], personAuthContext)
                .grant(['READ','UPDATE'], accountAuthContext);

            var role2 = Role.fromJSON(role.toJSON());
            expect(role2.getName()).to.equal(role.getName());
            expect(role2.getDescription()).to.equal(role.getDescription());
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


