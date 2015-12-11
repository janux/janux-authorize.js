/// <reference path="../typings/mocha/mocha.d.ts" />
import AuthorizationContext from '../src/impl/AuthorizationContext';
import PermissionBit from '../src/impl/PermissionBit';

import chai = require('chai');
var expect = chai.expect;

/* global describe, it, beforeEach, fail */

var
    log4js = require('log4js'),
    util   = require('util')
    ;

var log = log4js.getLogger('PermissionContext_test');

describe ('PermissionContext', () => {
    // default timeout is 2000 ms
    // this.timeout(30000)
    var authContext: AuthorizationContext;

    // run before every test in the suite
    beforeEach(function() {
        authContext = new AuthorizationContext('PERSON', 'Defines permissions available on a Person entity');
    });

    it('should be able to add/retrieve PermissionBits', function() {

        authContext.addPermissionBit( new PermissionBit('READ', 'Grants permission to READ a PERSON') );
        authContext.addPermissionBit( new PermissionBit('UPDATE', 'Grants permission to UPDATE a PERSON', 99) );

        log.info('permContext after adding PermissionBits: %j', authContext);
        log.info('short version of permContext: %j', authContext.toJSON(true));
        log.info('short version of permContext: %s', util.inspect(authContext.toJSON(true)));

        // the 'bit' object containing all the PermissionBits should be immutable
        //expect(authContext.getPermissionBits()).to.be.instanceof(Object);
        // authContext.bit = null;

        //try {
        //    delete authContext.bit;
        //    fail('should not be able to delete permContext.bit');
        //} catch (e) {
        //    // no-op
        //}
        //
        //expect(authContext.bit).to.be.instanceof(Object);
        //
        //// the individual bit object should also be immutable once created
        //// (some of its fields may not, but the reference itself is)
        //try {
        //    permContext.bit.READ = null;
        //    fail('should not be able to assign null to permContext.bit.READ');
        //} catch (e) {
        //    // no-op
        //}
        //
        //try {
        //    delete permContext.bit.READ;
        //    fail('should not be able to delete permContext.bit.READ');
        //} catch (e) {
        //    // no-op
        //}
        //
        //expect(permContext.bit).to.be.instanceof(Object);
        //
        //var bit = permContext.bit.READ;
        //expect(bit).to.be.instanceof(Object);
        //expect(bit.name).to.equal('READ');
        //expect(bit.label).to.equal('READ');
        //expect(bit.position).to.equal(0);
        //expect(bit.sortOrder).to.equal(0);
        //
        //// name and position should be immutable
        //try {
        //    bit.name = 'MutedName';
        //    fail('should not be able to assign to bit.name');
        //} catch (e) {
        //    // no-op
        //}
        //
        //expect(bit.name).to.equal('READ');
        //
        //// name and position should be immutable
        //try {
        //    bit.position = -1;
        //    fail('should not be able to assign to bit.possition');
        //} catch (e) {
        //    // no-op
        //}
        //
        //expect(bit.position).to.equal(0);
        //
        //// label, description and sortOrder are mutable
        //var LABEL = 'View', DESCR = 'View a Person record', SORT = 999;
        //bit.label = LABEL;
        //bit.description = DESCR;
        //bit.sortOrder = SORT;
        //expect(bit.label).to.equal(LABEL);
        //expect(bit.description).to.equal(DESCR);
        //expect(bit.sortOrder).to.equal(SORT);
        //
        //// second bit has custom sortOrder
        //bit = permContext.bit.UPDATE;
        //expect(bit).to.be.instanceof(Object);
        //expect(bit.name).to.equal('UPDATE');
        //expect(bit.position).to.equal(1);
        //expect(bit.sortOrder).to.equal(99);
        //
        //var bits = permContext.getPermissionBitsAsList();
        //expect(bits).to.be.instanceof(Array);
    });


    //it('should fail when adding an invalid PermissionBit', function() {
    //    var err = true;
    //
    //    // null name should fail
    //    try {
    //        permContext.addPermissionBit();
    //        err = false;
    //        log.error('Should not be able to add permBit with a null name');
    //    } catch (e) {
    //        // this is what we expect
    //        expect(e).to.be.instanceof(Error);
    //    }
    //
    //    // empty name should fail
    //    try {
    //        permContext.addPermissionBit('');
    //        log.error('Should not be able to add permBit with an empty name');
    //        err = false;
    //    } catch (e) {
    //        expect(e).to.be.instanceof(Error);
    //    }
    //
    //    // name that is not a string should fail
    //    try {
    //        permContext.addPermissionBit({});
    //        log.error('Should not be able to add permBit with name that is not a string');
    //        err = false;
    //    } catch (e) {
    //        expect(e).to.be.instanceof(Error);
    //    }
    //
    //    permContext.addPermissionBit('READ');
    //
    //    // duplicate name should fail
    //    try {
    //        permContext.addPermissionBit('READ');
    //        log.error('Should not be able to add permBit with a duplicate name');
    //        err = false;
    //    } catch (e) {
    //        expect(e).to.be.instanceof(Error);
    //    }
    //
    //    // we should not get this far, cause an explicit assertion failure;
    //    // not sure of a better way to do this with chai
    //    if (!err) {
    //        expect('DidNot throw an Error').to.equal('Should throw an Error');
    //    }
    //});
    //
    //
    //it('should properly convert permission strings to numeric representations', function() {
    //
    //    permContext.addPermissionBit('READ',   'Grants permission to READ a PERSON');
    //    permContext.addPermissionBit('UPDATE', 'Grants permission to UPDATE a PERSON');
    //    permContext.addPermissionBit('CREATE', 'Grants permission to CREATE a PERSON');
    //    permContext.addPermissionBit('DELETE', 'Grants permission to DELETE a PERSON', 99);
    //
    //    expect(permContext.getPermissionAsNumber('READ')).to.equal(1);
    //    expect(permContext.getPermissionAsNumber('UPDATE')).to.equal(2);
    //    expect(permContext.getPermissionAsNumber('CREATE')).to.equal(4);
    //    expect(permContext.getPermissionAsNumber('DELETE')).to.equal(8);
    //
    //    expect(permContext.getPermissionsAsNumber([])).to.equal(0);
    //    expect(permContext.getPermissionsAsNumber(['READ','UPDATE','DELETE'])).to.equal(1+2+8);
    //    expect(permContext.getPermissionsAsNumber(['READ','CREATE','DELETE'])).to.equal(1+4+8);
    //
    //    var err = true;
    //
    //    try {
    //        permContext.getPermissionAsNumber('REDA');
    //        err = false;
    //        log.error('Should fail to convert non-existent permission to number');
    //    } catch (e) {
    //        expect(e).to.be.instanceof(Error);
    //    }
    //
    //    try {
    //        permContext.getPermissionsAsNumber(['REDA','UPDATE']);
    //        err = false;
    //        log.error('Should fail to convert non-existent permission to number');
    //    } catch (e) {
    //        expect(e).to.be.instanceof(Error);
    //    }
    //
    //    // we should not get this far, cause an explicit assertion failure;
    //    if (!err) {
    //        expect('DidNot throw an Error').to.equal('Should throw an Error');
    //    }
    //});
    //
    //it('should be deserialized via fromJSON', function() {
    //    permContext.addPermissionBit('READ', 'Grants permission to READ a PERSON');
    //    permContext.addPermissionBit('UPDATE', 'Grants permission to UPDATE a PERSON', 99);
    //
    //    // full version
    //    var permContext2 = PermissionContext.fromJSON(permContext.toJSON());
    //    var name, bit, bit2;
    //    expect(permContext2.name).to.equal(permContext.name);
    //    expect(permContext2.description).to.equal(permContext.description);
    //    for (name in permContext.bit) {
    //        bit  = permContext.bit[name];
    //        bit2 = permContext2.bit[name];
    //
    //        expect(bit.position).to.equal(bit2.position);
    //        expect(bit.description).to.equal(bit2.description);
    //        expect(bit.sortOrder).to.equal(bit2.sortOrder);
    //    }
    //
    //    // short version
    //    permContext2 = PermissionContext.fromJSON(permContext.toJSON(true));
    //    expect(permContext2.name).to.equal(permContext.name);
    //    for (name in permContext.bit) {
    //        bit  = permContext.bit[name];
    //        bit2 = permContext2.bit[name];
    //        expect(bit.position).to.equal(bit2.position);
    //    }
    //});


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



