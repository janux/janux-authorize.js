'use strict';

var _ = require('lodash');

/* global describe, it */

var expect = require('chai').expect, log4js = require('log4js'),
    userService = require('../dist/impl/UserServiceMock');

var log = log4js.getLogger('test');
log4js.configure('test/log4js.json');

// utility function used in tests below
function assertOwner(user) {
    expect(_.isObject(user)).to.equal(true);
    expect(user.account.name).to.equal('widgeter');
    expect(user.person.name.first).to.equal('Chase');
    expect(user.person.name.last).to.equal('Widgeter');
}

function assertManager(user) {
    expect(_.isObject(user)).to.equal(true);
    expect(user.account.name).to.equal('manager');
    expect(user.person.name.first).to.equal('Robby');
    expect(user.person.name.last).to.equal('Manager');
}

function assertAdmin(user) {
    expect(_.isObject(user)).to.equal(true);
    expect(user.account.name).to.equal('admin');
    expect(user.person.name.first).to.equal('Ian');
    expect(user.person.name.last).to.equal('Admin');
}

describe('user-service-mock:', function () {
    it('should load "widgeter" by oid', function (done) {
        var oid = 'e90597ae-6450-49f5-8b72-3c0b1a6e8c4f';

        userService.load(oid, function (err, user) {
            expect(user.oid).to.equal(oid);
            assertOwner(user);
            done();
        });
    });

    it('should find "widgeter" by account name', function (done) {
        userService.findByAccountName('widgeter', function (err, user) {
            // log.info('found user: "%s"', util.inspect(user, {depth:null}));
            log.info('found user: "%j"', user);
            assertOwner(user);
            done();
        });
    });

    it('should authenticate "widgeter" credential', function (done) {
        userService.authenticate('widgeter', 'password', function (err, user) {
            // log.info('found user: "%j"', user);
            assertOwner(user);
            done();
        });
    });

    it('should load "manager" by oid', function (done) {
        var oid = '3d52f4bc-34a5-47fe-8f95-6a4c5f46f300';
        userService.load(oid, function (err, user) {
            expect(user.oid).to.equal(oid);
            assertManager(user);
            done();
        });
    });

    it('should find "manager" by account name', function (done) {
        userService.findByAccountName('manager', function (err, user) {
            // log.info('found user: "%j"', user);
            assertManager(user);
            done();
        });
    });

    it('should authenticate "manager" credential', function (done) {
        userService.authenticate('manager', 'password', function (err, user) {
            // log.info('found user: "%j"', user);
            assertManager(user);
            done();
        });
    });

    it('should load "admin" by oid', function (done) {
        var oid = '8a0ca988-63b0-4218-9511-1f1b03456c0c';
        userService.load(oid, function (err, user) {
            expect(user.oid).to.equal(oid);
            assertAdmin(user);
            done();
        });
    });

    it('should find "admin" by account name', function (done) {
        userService.findByAccountName('admin', function (err, user) {
            // log.info('found user: "%j"', user);
            assertAdmin(user);
            done();
        });
    });

    it('should authenticate "admin" credential', function (done) {
        userService.authenticate('admin', 'password', function (err, user) {
            // log.info('found user: "%j"', user);
            assertAdmin(user);
            done();
        });
    });

    it('should return an error if oid not found', function (done) {
        userService.load('someFakeOid', function (err) {
            expect(err.message).to.equal('User with oid: "someFakeOid" does not exist');
            done();
        });
    });

    it('should return null if account name not found', function (done) {
        userService.findByAccountName('someFakeName', function (err, user) {
            expect(_.isUndefined(user)).to.equal(true);
            done();
        });
    });
});