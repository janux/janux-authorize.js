/// <reference path="../../typings/tsd.d.ts" />

import _ = require('lodash');
import AuthorizationContext from './AuthorizationContext';
import PermissionBit from './PermissionBit';
import Role from './Role';
import util = require('util');

/**
 * authorizationContext is a public hashmap that stores the various Permission
 * Contexts that make up the authorization scheme for an application; it is
 * spelled out in the singular so that it is more intuitive to read, for
 * example:  AuthService.authorizationContext.EQUIPMENT
 */

var authorizationContext: any = exports.authorizationContext = {};

/**
 * Private convenience method to add Permission Context with standard permissions
 * (READ, UPDATE, CREATE, DELETE, PURGE) to the authorizationContext hashmap
 * of the Authorization Scheme
 */
function addStandardAuthorizationContext(name, represents) {

    var authContext = new AuthorizationContext(name, 'Defines permissions available on a ' + represents);

    ['READ', 'UPDATE', 'CREATE', 'DELETE', 'PURGE'].forEach( (bitName)=> {
        authContext.addPermissionBit(new PermissionBit(bitName, util.format('Grants permission to %s a %s', bitName, represents) ) );
    });

    authorizationContext[name] = authContext;
}

//
// private variable used to setup standard permission contexts to be added
// further below via addStandardauthorizationContext
// 
var standardPermContextSetup: any = {
    WIDGET:    'Widget managed by the system',
    EQUIPMENT: 'Equipment used to produce a Widget',
    USER:      'Manage User Records'
};

//
// create 'standard' permission contexts,
//
_.forEach(standardPermContextSetup, (represents, name)=> {
    addStandardAuthorizationContext(name, represents);
});

// custom 'non-standard' permissions
authorizationContext['USER'].addPermissionBit( new PermissionBit('GRANT', 'Grants permission to Grant/Revoke Roles or Permissions to/from Users (self-reflective permission)') );

// The permission below is not strictly necessary,
// a user can be made to have all-permissions via the isAlmighty flag,
// and they could use this power to create other super-users;
// Nevertheless, it may be desireable to create users that don't have all-permissions but have this
// specific permission.  In other words, they may be trusted to create privileged users, but may not
// trust themselves to operate other areas of the application without creating mayhem
authorizationContext['USER'].addPermissionBit( new PermissionBit('SUPER', 'Grants permission to create super-users') );

/**
 * role is a public hashmap that stores the various Roles
 * that make up the authorization scheme for an application; it is
 * spelled out in the singular so that it is more intuitive to read, for
 * example:  AuthService.role.SYS_ADMIN
 */
var role: any = exports.role = {};

role['WIDGET_DESIGNER'] = new Role('WIDGET_DESIGNER', 'A Widget Designer')
    .grant(['READ','UPDATE','CREATE','DELETE'], authorizationContext.WIDGET)
    .grant(['READ','UPDATE'], authorizationContext.EQUIPMENT)
;

// console.log('role.WIDGET_DESIGNER:', JSON.stringify(role.WIDGET_DESIGNER));

role['EQUIPMENT_MANAGER'] = new Role('EQUIPMENT_MANAGER', 'A facilities manager who supervises the equipment used to produce widgets')
    .grant(['READ'], authorizationContext.WIDGET)
    .grant(['READ','UPDATE','CREATE','DELETE'], authorizationContext.EQUIPMENT)
;

role['SYS_ADMIN'] = new Role('SYS_ADMIN', 'System Administrator with all privileges');
role['SYS_ADMIN'].setAlmighty(true);

// console.log('role.SYS_ADMIN:', JSON.stringify(role.SYS_ADMIN));
