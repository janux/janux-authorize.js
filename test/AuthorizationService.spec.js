'use strict';

var AuthService = require('../dist/impl/AuthorizationService');

var chai = require('chai'),
	expect = chai.expect,
	log4js = require('log4js'),
	util = require('util');
	log4js.configure('./test/log4js.json');

var log = log4js.getLogger('test');

describe('AuthService', function () {
    // default timeout is 2000 ms
    // this.timeout(30000)
    describe('WIDGET permission context', function () {

        var authContext = AuthService.authorizationContext.WIDGET;

        it('should have proper values', function () {
            log.info('authContext: %j', authContext);

            expect(authContext.name).to.equal('WIDGET');
            expect(authContext.description).to.equal('Defines permissions available on a Widget managed by the system');

            var perms = authContext.getPermissionBitsAsList();

            expect(perms).to.have.length(5);
            expect(perms[0].name).to.equal('READ');
            expect(perms[0].description).to.equal('Grants permission to READ a Widget managed by the system');
            expect(perms[0].position).to.equal(0);
            expect(perms[0].sortOrder).to.equal(0);

			expect(perms[1].name).to.equal('UPDATE');
            expect(perms[1].position).to.equal(1);
            expect(perms[1].sortOrder).to.equal(1);

			expect(perms[2].name).to.equal('CREATE');
            expect(perms[2].position).to.equal(2);
            expect(perms[2].sortOrder).to.equal(2);

			expect(perms[3].name).to.equal('DELETE');
            expect(perms[3].position).to.equal(3);
            expect(perms[3].sortOrder).to.equal(3);

			expect(perms[4].name).to.equal('PURGE');
            expect(perms[4].position).to.equal(4);
            expect(perms[4].sortOrder).to.equal(4);
        });
    });

    describe('EQUIPMENT permission context', function () {
        var authContext = AuthService.authorizationContext.EQUIPMENT;
        it('should have proper values', function () {
            log.debug('authContext: %j', authContext);

            expect(authContext.name).to.equal('EQUIPMENT');
            expect(authContext.description).to.equal('Defines permissions available on a Equipment used to produce a Widget');

            var perms = authContext.getPermissionBitsAsList();

            expect(perms).to.have.length(5);
            expect(perms[0].name).to.equal('READ');
            expect(perms[0].description).to.equal('Grants permission to READ a Equipment used to produce a Widget');
            expect(perms[0].position).to.equal(0);
            expect(perms[0].sortOrder).to.equal(0);

            expect(perms[1].name).to.equal('UPDATE');
            expect(perms[1].position).to.equal(1);
            expect(perms[1].sortOrder).to.equal(1);

			expect(perms[2].name).to.equal('CREATE');
            expect(perms[2].position).to.equal(2);
            expect(perms[2].sortOrder).to.equal(2);

			expect(perms[3].name).to.equal('DELETE');
            expect(perms[3].position).to.equal(3);
            expect(perms[3].sortOrder).to.equal(3);

			expect(perms[4].name).to.equal('PURGE');
            expect(perms[4].position).to.equal(4);
            expect(perms[4].sortOrder).to.equal(4);
        });
    });
    // assertions
    // see http://chaijs.com/api/bdd
    // some_prop).to.equal('somevalue'); // fails if some_prop is null
    // some_prop.should.have.length(3);
    // some_prop.should.be.a('string');
    // some_prop.should.have.property;
    //
    // expect(something).to.be.empty|true|false|null|undefine;
    // expect(something).to.be.not.empty;
    // expect(something).to.equal(some_value);
    // expect(something).to.be.instanceof(Array|String|Number|Function|Object);
});
