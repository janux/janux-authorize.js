'use strict';

var
    tools = require('../dist/tools'),
    collections = require('../dist/collections').collections,
    Account = require('../index').Account,
    AuthorizationHolder = require('../index').AuthorizationHolder
    ;

// A mixin never runs the AuthorizationHolder constructor, so it must create the
// instance state that the constructor would otherwise initialize
function User() {
    this.permissionsGranted = new collections.Dictionary();
}

// Mixing Account and AuthorizationHolder
tools.extend(User.prototype, Account.prototype);
tools.extend(User.prototype, AuthorizationHolder.prototype);

exports.createInstance = function createInstance() {
    var out = new User();
    return out;
};
