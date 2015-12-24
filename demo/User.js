'use strict';

var
    tools = require('../src/tools'),
    Account = require('../index').Account,
    AuthorizationHolder = require('../index').AuthorizationHolder
    ;

function User() {}

// Mixing Account and AuthorizationHolder
tools.extend(User.prototype, Account.prototype);
tools.extend(User.prototype, AuthorizationHolder.prototype);

exports.createInstance = function createInstance() {
    var out = new User();
    return out;
};
