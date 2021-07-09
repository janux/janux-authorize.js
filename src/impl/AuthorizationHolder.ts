'use strict';

/// <reference path="../collections.ts" />

import basarat = require('../collections');
import collections = basarat.collections;
import Dictionary = collections.Dictionary;
import List = collections.LinkedList;
import {AuthorizationContext} from './AuthorizationContext';
import {iAuthorizationHolder} from '../api/AuthorizationHolder';
import {Role} from './Role';
import {PermissionBit} from "./PermissionBit";

/**
 ***************************************************************************************************
 * Implementation convenience class that factors in one class the functions
 * that derive the permissions that a Role or Account may have based on its
 * associated roles and permissions granted
 *
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 ***************************************************************************************************
 */
export class AuthorizationHolder implements iAuthorizationHolder
{
    get typeName():string {
        return 'janux.security.AuthorizationHolder';
    }

    protected name:string;
    public isAlmighty:boolean;
    protected _roles: List<Role>;

    // protected  authContexts: Dictionary<string, AuthorizationContext>;
    protected authContexts: string[];
    protected permissions: Object;

    /** this is declared as protected simply for testing purposes */
    protected permissionsGranted: Dictionary<string, {context: AuthorizationContext, grant: number}>
		= new Dictionary<string, {context: AuthorizationContext, grant: number}>();

    constructor(){}

    get roles(): List<Role> {
        if (this._roles == null) { this._roles = new List<Role>(); }
        return this._roles;
    }

    set roles(aggrRoles: List<Role>) {
        this._roles = aggrRoles;
    }

    grant(permsGranted: any, authContext: AuthorizationContext): AuthorizationHolder {

        // if (!_.isArray(permsGranted) && !_.isNumber(permsGranted)) {
        if (!Array.isArray(permsGranted) && Number.isNaN(permsGranted)) {
            throw new Error("You must pass either a number or an array of string permissions when granting permissions");
        }

        else if (authContext == null) {
            throw new Error('Attempting to assign permissions to entity ' + this.name + ' with null AuthorizationContext');
        }

        // var permsValue = _.isArray(permsGranted) ? authContext.permissionsAsNumber(permsGranted) : permsGranted;
        var permsValue = Array.isArray(permsGranted) ? authContext.permissionsAsNumber(permsGranted) : permsGranted;

        if ( permsValue > authContext.getMaxValue() ) {
            throw new Error( 'The permission bitmask that you are trying to assign: ' + permsValue
                + ' has a value greater than the maximum ' + authContext.getMaxValue()
                + ' that can be assigned in the context of AuthorizationContext ' + authContext.name
                + ' to entity ' + this.name);
        }

        if (this.permissionsGranted == null) {
            this.permissionsGranted = new Dictionary<string, {context: AuthorizationContext, grant: number}>();
        }

        if (permsValue > 0) {
            this.permissionsGranted.setValue(
                authContext.name,
                { context: <AuthorizationContext> authContext, grant: <number> permsValue }
            );
        } else {
            this.permissionsGranted.remove(authContext.name);
        }
        return this;
    }

    hasPermissions(permNames: any, authContextName: string): boolean {

        // almighty users have all permissions for now (TODO: add 'deny' mechanism)
        if (this.isAlmighty) { return true; }

        var permsGranted = this.permissionsGranted.getValue(authContextName);
        // if (!_.isObject(permsGranted)) { return false; }
        if (!permsGranted instanceof Object) { return false; }

        var authContext = permsGranted.context;
        var requiredPerms = -1;
        try
        {
            requiredPerms = authContext.permissionsAsNumber(permNames);
        }
        catch (e)
        {
            console.warn('WARNING: ' + e );
            return false;
        }

        /* jshint bitwise:false */
        var match = permsGranted.grant & requiredPerms;
        // console.log('match is: ', match);
        /* jshint bitwise:true */

        return match === requiredPerms;
    }

    hasPermission(permissionName: string, authContextName: string): boolean {
        var perm:string[] = [permissionName];
        return this.hasPermissions(perm, authContextName);
    }

    can(permNames: any, authContextName: string): boolean {
        // if (_.isArray(permNames)) {
        if (Array.isArray(permNames)) {
            return this.hasPermissions(permNames, authContextName);
        // } else if (_.isString(permNames)) {
        } else if (permNames instanceof String) {
            return this.hasPermission(permNames, authContextName);
        } else {
            return false;
        }
    }

    getGrantAsBitList(authContextName: string): string[] {
    	let perms:string[] = [];

    	// if (!_.isString(authContextName) || authContextName.length === 0) {
		if (!(authContextName instanceof String) || authContextName.length === 0) {
			throw new Error('Invalid authorization context name');
		}

		const permissionGranted = this.permissionsGranted.getValue(authContextName);

		if(typeof permissionGranted !== 'undefined'){
			const bitMap = permissionGranted.context.getBitMap();

			bitMap.forEach((bName:string, bit:PermissionBit)=>{
				if(this.hasPermission(bName, authContextName)) {
					perms.push(bName);
				}
			});
		}

    	return perms;
	}

    toJSON(): any {
        // var out = _.clone(this);
        var out = Object.assign({}, this);
        delete out.permissionsGranted;
        // delete out.isAlmighty;

        var perm;
        // outputs permissionsGranted separately from permissionsContexts to make json msg more readable
        // "permissions": {
        //   "PROPERTY":{"grant":3},
        //   "ACCOUNT":{"deny":7,}   // revokes inherited permissions, not yet implemented
        //   "EQUIPMENT":{"grant":3, "deny":4} // edge case, not yet implemented
        // }
        this.permissionsGranted.forEach((contextName: string, pGranted: {context: AuthorizationContext, grant: number})=>{
            out.permissions = out.permissions || {};
            perm = pGranted;
            out.permissions[contextName] = {};
            if (perm.grant) {out.permissions[contextName].grant = perm.grant;}
            if (perm.deny)  {out.permissions[contextName].deny  = perm.deny;}

            out.authContexts = out.authContexts || [];
            out.authContexts.push(perm.context.toJSON(true)); // true = doShortVersion
        });
        return out;
    }

    toString() {
        // Short hand. Adds each own property
        return collections.makeString(this);
    }

} // end class AuthorizationHolder
