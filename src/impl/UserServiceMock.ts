'use strict';

import * as _ from "lodash";

var
    AuthService = require('./AuthorizationService'),
    log4js = require('log4js'),
    util   = require('util')
    ;

/* TODO: make identifiers camel case eventually */
/* jshint camelcase: false */

var log = log4js.getLogger('UserServiceMock');

// mock implementation of user storage;
// hold users in a hashmap, keyed by oid
var users = {
    'e90597ae-6450-49f5-8b72-3c0b1a6e8c4f':
    {
        oid: 'e90597ae-6450-49f5-8b72-3c0b1a6e8c4f',
        account: {
            name:     'widgeter',
            password: 'password',
            passwordExpiresOn: '',
            isLocked: false,
            expiresOn: '',
            roles: [AuthService.role.WIDGET_DESIGNER]
        },
        person: {
            name: {
                first: 'Chase',
                last:  'Widgeter'
            }
        }
    },
    '3d52f4bc-34a5-47fe-8f95-6a4c5f46f300':
    {
        oid: '3d52f4bc-34a5-47fe-8f95-6a4c5f46f300',
        account: {
            name:     'manager',
            password: 'password',
            passwordExpiresOn: '',
            isLocked: false,
            expiresOn: '',
            roles: [AuthService.role.EQUIPMENT_MANAGER]
        },
        person: {
            name: {
                first: 'Robby',
                last:  'Manager'
            }
        }
    },
    '8a0ca988-63b0-4218-9511-1f1b03456c0c':
    {
        oid: '8a0ca988-63b0-4218-9511-1f1b03456c0c',
        account: {
            name:     'admin',
            password: 'password',
            passwordExpiresOn: '',
            isLocked: false,
            expiresOn: '',
            roles: [AuthService.role.SYS_ADMIN]
        },
        person: {
            name: {
                first: 'Ian',
                last:  'Admin'
            }
        }
    }
};


exports.load = function load(oid, done) {
    // log.debug("calling findByOid with oid: '%s'",oid);
    'use strict';
    if (users[oid]) {
        done(null, users[oid]);
    } else {
        var msg = util.format('User with oid: "%s" does not exist', oid);
        log.error(msg);
        done(new Error(msg));
    }
};


exports.findByAccountName = function findByAccountName(username, done) {
    'use strict';
    log.debug('looking up account with name "%s"', username);
    done(null,
        _.find(users, (user:any) => { return user.account.name === username; })
    );
};


/*
 * Given a valid username/password combination, returns the corresponding user.
 * throws an error otherwise
 */
exports.authenticate = function authenticate(username, password, done) {
    'use strict';
    exports.findByAccountName(username, (err, user) => {
        if (err) {
            return done(err);
        } else if (_.isObject(user) && user.account.password === password) {
            return done(null, user);
        } else {
            var msg = util.format('Invalid username/password supplied by "%s"', username);
            log.warn(msg);
            return done(null, false, { message: msg });  // return 'false' for failure to authenticate (rather than a null user)
        }
    });
};