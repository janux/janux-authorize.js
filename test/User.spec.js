'use strict';

/* global describe, before, beforeEach, fail, it */

var
    expect = require('chai').expect,
    log4js = require('log4js'),
    util = require('util')
    ;

var
    User = require('./User'),
    AuthorizationContext = require('../index').AuthorizationContext
    ;
var log = log4js.getLogger('User_test');

describe ('', function() {

    var user = {};
    var personAuthContext;
    var userAuthContext;
    var permBits = ['READ', 'UPDATE', 'CREATE', 'TRASH', 'DELETE'];

    // run once before the test suite below
    before(function() {
        personAuthContext = AuthorizationContext.createInstance('PERSON', 'Defines permissions available on a Person entity');
        permBits.forEach( function(bitName) {
            personAuthContext.addPermissionBit(bitName, util.format('Grants permission to %s a %s', bitName, 'PERSON'));
        });

        userAuthContext = AuthorizationContext.createInstance('USER', 'Defines permissions available on an User entity');
        ['READ', 'UPDATE', 'CREATE', 'TRASH', 'DELETE'].forEach( function(bitName) {
            userAuthContext.addPermissionBit(bitName, util.format('Grants permission to %s a %s', bitName, 'USER'));
        });

    });

    function assertPermissions(user) {
        expect(user.hasPermission('READ', 'PERSON')).to.equal(true);
        expect(user.hasPermissions(['READ','UPDATE'] , 'PERSON')).to.equal(true);
        expect(user.hasPermissions(['READ','UPDATE','TRASH'] , 'PERSON')).to.equal(true);

        expect(user.hasPermission('CREATE','PERSON')).to.equal(false);
        expect(user.hasPermissions(['READ','UPDATE','CREATE'] , 'PERSON')).to.equal(false);
        expect(user.hasPermissions(['READ','UPDATE','CREATE','DELETE'] , 'PERSON')).to.equal(false);


        expect(user.hasPermission('READ', 'USER')).to.equal(true);
        expect(user.hasPermissions(['READ','UPDATE'] , 'USER')).to.equal(true);

        expect(user.hasPermission('CREATE' , 'USER')).to.equal(false);
        expect(user.hasPermissions(['READ','UPDATE','CREATE'] , 'USER')).to.equal(false);
        expect(user.hasPermissions(['READ','UPDATE','CREATE','DELETE'] , 'USER')).to.equal(false);
    }

    describe('User', function() {

        beforeEach(function() {
            // TODO: User instance should be created with account data
            user = User.createInstance();
        });

        it('should instantiate with basic fields', function() {
            log.debug('user after creation: %j', user);
            // TODO: Test Account fields
        });

        it('should be possible to grant permissions to a User', function() {
            user.grant(['READ','UPDATE','TRASH'], personAuthContext)
                .grant(['READ','UPDATE'], userAuthContext);

            log.info('user after granting permissions: %j', user);
            assertPermissions(user);
        });

        it('should have multiple user instances without collisions', function() {
            var user2 = User.createInstance();

            user.grant(['READ','UPDATE', 'DELETE'], personAuthContext);
            user2.grant(['READ'], personAuthContext);

            expect(user2.hasPermission('READ',   'PERSON')).to.equal(true);
            expect(user2.hasPermission('UPDATE', 'PERSON')).to.equal(false);
            expect(user2.hasPermission('DELETE', 'PERSON')).to.equal(false);

            expect(user.hasPermissions(['READ','UPDATE'] , 'PERSON')).to.equal(true);
            expect(user.hasPermissions(['READ','UPDATE','DELETE'] , 'PERSON')).to.equal(true);

            expect(user2.hasPermissions(['READ','UPDATE'] , 'PERSON')).to.equal(false);
            expect(user2.hasPermissions(['READ','UPDATE','DELETE'] , 'PERSON')).to.equal(false);
        });

        it('that is almighty should be able to have all permissions', function() {
            user.setAlmighty(true);
            log.info('user after granting almightiness: %j', user);

            expect(user.hasPermission('READ', 'PERSON')).to.equal(true);
            expect(user.hasPermissions(['READ','UPDATE'] , 'PERSON')).to.equal(true);
            expect(user.hasPermissions(['READ','UPDATE','TRASH'] , 'PERSON')).to.equal(true);

            expect(user.hasPermissions(['READ','UPDATE','CREATE'] , 'PERSON')).to.equal(true);
            expect(user.hasPermissions(['READ','UPDATE','CREATE','DELETE'] , 'PERSON')).to.equal(true);

            expect(user.hasPermission('READ', 'USER')).to.equal(true);
            expect(user.hasPermissions(['READ','UPDATE'] , 'USER')).to.equal(true);

            expect(user.hasPermission('CREATE' , 'USER')).to.equal(true);
            expect(user.hasPermissions(['READ','UPDATE','CREATE'] , 'USER')).to.equal(true);
            expect(user.hasPermissions(['READ','UPDATE','CREATE','DELETE'] , 'USER')).to.equal(true);
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
