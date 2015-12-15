/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../src/collections.ts" />

import basarat = require('../src/collections');
import collections = basarat.collections;
import AuthorizationContext from '../src/impl/AuthorizationContext';
import PermissionBit from '../src/impl/PermissionBit';

import chai = require('chai');
var expect = chai.expect;

/* global describe, it, beforeEach, fail */

var
    log4js = require('log4js'),
    util   = require('util')
    ;

var log = log4js.getLogger('AuthorizationContext_test');

describe ('AuthorizationContext', () => {
    // default timeout is 2000 ms
    // this.timeout(30000)
    var authContext: AuthorizationContext;

    // run before every test in the suite
    beforeEach(() => {
        authContext = new AuthorizationContext('PERSON', 'Defines permissions available on a Person entity');
    });

    it('should be able to add/retrieve PermissionBits', function() {

        authContext.addPermissionBit( new PermissionBit('READ', 'Grants permission to READ a PERSON') );
        authContext.addPermissionBit( new PermissionBit('UPDATE', 'Grants permission to UPDATE a PERSON', 99) );

        log.info('permContext after adding PermissionBits: %j', authContext);
        log.info('short version of permContext: %j', authContext.toJSON(true));
        log.info('short version of permContext: %s', util.inspect(authContext.toJSON(true)));

        var bit = authContext.getPermissionBit('READ');
        // expect(bit).to.be.instanceof(PermissionBit);
        expect(bit.getName()).to.equal('READ');
        expect(bit.label).to.equal('READ');
        expect(bit.getPosition()).to.equal(0);
        expect(bit.getSortOrder()).to.equal(0);

        //// label, description and sortOrder are mutable
        var LABEL = 'View', DESCR = 'View a Person record', SORT = 999;
        bit.label = LABEL;
        bit.setDescription(DESCR);
        bit.setSortOrder(SORT);
        expect(bit.label).to.equal(LABEL);
        expect(bit.getDescription()).to.equal(DESCR);
        expect(bit.getSortOrder()).to.equal(SORT);

        //// second bit has custom sortOrder
        bit = authContext.getPermissionBit('UPDATE');
        // expect(bit).to.be.instanceof(PermissionBit);
        expect(bit.getName()).to.equal('UPDATE');
        expect(bit.getPosition()).to.equal(1);
        expect(bit.getSortOrder()).to.equal(99);

        var bits = authContext.getPermissionBitsAsList();
        expect(bits).to.be.instanceof(Array);
    });


    it('should fail when adding an invalid PermissionBit', function() {
        var err = true;

        // null name should fail
        try {
            authContext.addPermissionBit(new PermissionBit());
            err = false;
            log.error('Should not be able to add permBit with a null name');
        } catch (e) {
            // this is what we expect
            expect(e).to.be.instanceof(Error);
        }

        // empty name should fail
        try {
            authContext.addPermissionBit(new PermissionBit(''));
            log.error('Should not be able to add permBit with an empty name');
            err = false;
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }

        // without permissionBit
        try {
            authContext.addPermissionBit();
            log.error('Should not be able to add permBit without an instance of PermissionBit');
            err = false;
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }

        authContext.addPermissionBit( new PermissionBit('READ') );

        // duplicate name should fail
        try {
            authContext.addPermissionBit( new PermissionBit('READ') );
            log.error('Should not be able to add permBit with a duplicate name');
            err = false;
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }

        // we should not get this far, cause an explicit assertion failure;
        // not sure of a better way to do this with chai
        if (!err) {
            expect('DidNot throw an Error').to.equal('Should throw an Error');
        }
    });


    it('should properly convert permission strings to numeric representations', function() {

        authContext.addPermissionBit( new PermissionBit('READ',   'Grants permission to READ a PERSON') );
        authContext.addPermissionBit( new PermissionBit('UPDATE', 'Grants permission to UPDATE a PERSON') );
        authContext.addPermissionBit( new PermissionBit('CREATE', 'Grants permission to CREATE a PERSON') );
        authContext.addPermissionBit( new PermissionBit('DELETE', 'Grants permission to DELETE a PERSON', 99) );

        expect(authContext.getPermissionAsNumber('READ')).to.equal(1);
        expect(authContext.getPermissionAsNumber('UPDATE')).to.equal(2);
        expect(authContext.getPermissionAsNumber('CREATE')).to.equal(4);
        expect(authContext.getPermissionAsNumber('DELETE')).to.equal(8);

        expect(authContext.getPermissionsAsNumber([])).to.equal(0);
        expect(authContext.getPermissionsAsNumber(['READ','UPDATE','DELETE'])).to.equal(1+2+8);
        expect(authContext.getPermissionsAsNumber(['READ','CREATE','DELETE'])).to.equal(1+4+8);

        var err = true;

        try {
            authContext.getPermissionAsNumber('REDA');
            err = false;
            log.error('Should fail to convert non-existent permission to number');
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }

        try {
            authContext.getPermissionsAsNumber(['REDA','UPDATE']);
            err = false;
            log.error('Should fail to convert non-existent permission to number');
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }

        // we should not get this far, cause an explicit assertion failure;
        if (!err) {
            expect('DidNot throw an Error').to.equal('Should throw an Error');
        }
    });

    it('should be deserialized via fromJSON', function() {
        authContext.addPermissionBit( new PermissionBit('READ', 'Grants permission to READ a PERSON') );
        authContext.addPermissionBit( new PermissionBit('UPDATE', 'Grants permission to UPDATE a PERSON', 99) );

        // full version
        var authContext2 = AuthorizationContext.fromJSON(authContext.toJSON());
        var bit, bit2;

        expect(authContext2.getName()).to.equal(authContext.getName());
        expect(authContext2.getDescription()).to.equal(authContext.getDescription());

        authContext.getPermissionBits().forEach((bitName: string, cBit: PermissionBit)=>{
            bit  = authContext.getPermissionBit(bitName);
            bit2 = authContext2.getPermissionBit(bitName);

            expect(bit.getPosition()).to.equal(bit2.getPosition());
            expect(bit.getDescription()).to.equal(bit2.getDescription());
            expect(bit.getSortOrder()).to.equal(bit2.getSortOrder());
        });

        // short version
        authContext2 = AuthorizationContext.fromJSON(authContext.toJSON(true));
        expect(authContext2.getName()).to.equal(authContext.getName());

        authContext.getPermissionBits().forEach((bitName: string, cBit: PermissionBit)=>{
            bit  = authContext.getPermissionBit(bitName);
            bit2 = authContext2.getPermissionBit(bitName);
            expect(bit.getPosition()).to.equal(bit2.getPosition());
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



