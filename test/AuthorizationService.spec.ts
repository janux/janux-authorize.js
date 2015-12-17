/// <reference path="../typings/mocha/mocha.d.ts" />

import AuthorizationContext from "../src/impl/AuthorizationContext";
var AuthService = require('../src/impl/AuthorizationService');

import chai = require('chai');
var expect = chai.expect;

var
    log4js = require('log4js'),
    util   = require('util')
    ;

log4js.configure('./test/log4js.json');

var log = log4js.getLogger('test');

describe('AuthService', ()=> {
    // default timeout is 2000 ms
    // this.timeout(30000)

    describe('WIDGET permission context', ()=> {
        var authContext: AuthorizationContext = AuthService.authorizationContext.WIDGET;

        it('should have proper values', ()=> {
            log.info('authContext: %j', authContext);
            expect(authContext.getName()).to.equal('WIDGET');
            expect(authContext.getDescription()).to.equal('Defines permissions available on a Widget managed by the system');

            var perms = authContext.getPermissionBitsAsList();
            expect(perms).to.have.length(5);

            expect(perms[0].getName()).to.equal('READ');
            expect(perms[0].getDescription()).to.equal('Grants permission to READ a Widget managed by the system');
            expect(perms[0].getPosition()).to.equal(0);
            expect(perms[0].getSortOrder()).to.equal(0);

            expect(perms[1].getName()).to.equal('UPDATE');
            expect(perms[1].getPosition()).to.equal(1);
            expect(perms[1].getSortOrder()).to.equal(1);

            expect(perms[2].getName()).to.equal('CREATE');
            expect(perms[2].getPosition()).to.equal(2);
            expect(perms[2].getSortOrder()).to.equal(2);

            expect(perms[3].getName()).to.equal('DELETE');
            expect(perms[3].getPosition()).to.equal(3);
            expect(perms[3].getSortOrder()).to.equal(3);

            expect(perms[4].getName()).to.equal('PURGE');
            expect(perms[4].getPosition()).to.equal(4);
            expect(perms[4].getSortOrder()).to.equal(4);
        });
    });

    describe('EQUIPMENT permission context', ()=> {
        var authContext: AuthorizationContext = AuthService.authorizationContext.EQUIPMENT;

        it('should have proper values', ()=> {
            log.debug('authContext: %j', authContext);
            expect(authContext.getName()).to.equal('EQUIPMENT');
            expect(authContext.getDescription()).to.equal('Defines permissions available on a Equipment used to produce a Widget');
            var perms = authContext.getPermissionBitsAsList();
            expect(perms).to.have.length(5);

            expect(perms[0].getName()).to.equal('READ');
            expect(perms[0].getDescription()).to.equal('Grants permission to READ a Equipment used to produce a Widget');
            expect(perms[0].getPosition()).to.equal(0);
            expect(perms[0].getSortOrder()).to.equal(0);

            expect(perms[1].getName()).to.equal('UPDATE');
            expect(perms[1].getPosition()).to.equal(1);
            expect(perms[1].getSortOrder()).to.equal(1);

            expect(perms[2].getName()).to.equal('CREATE');
            expect(perms[2].getPosition()).to.equal(2);
            expect(perms[2].getSortOrder()).to.equal(2);

            expect(perms[3].getName()).to.equal('DELETE');
            expect(perms[3].getPosition()).to.equal(3);
            expect(perms[3].getSortOrder()).to.equal(3);

            expect(perms[4].getName()).to.equal('PURGE');
            expect(perms[4].getPosition()).to.equal(4);
            expect(perms[4].getSortOrder()).to.equal(4);
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