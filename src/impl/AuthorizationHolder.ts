/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../collections.ts" />

import _ = require('lodash');
import basarat = require('../collections');
import collections = basarat.collections;
import Dictionary = collections.Dictionary;
import List = collections.LinkedList;
import AuthorizationContext from './AuthorizationContext';
import {iAuthorizationHolder} from '../api/AuthorizationHolder';
import Role from './Role';

/**
 ***************************************************************************************************
 * Implementation convenience class that factors in one class the functions
 * that derive the permissions that a Role or Account may have based on its
 * associated roles and permissions granted
 *
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 * @version $Revision: 1.8 $ - $Date: 2007-12-27 00:51:17 $
 ***************************************************************************************************
 */
export default class AuthorizationHolder implements iAuthorizationHolder
{
    protected name:string;
    protected _isSuper:boolean;

    // protected  authContexts: Dictionary<string, AuthorizationContext>;
    protected authContexts: string[];
    protected permissions: Object;

    /** this is declared as protected simply for testing purposes */
    protected permissionsGranted: Dictionary<string, {context: AuthorizationContext, grant: number}>;

    //constructor(name: string, roles: List<Role>, permissionsGranted: Dictionary<string, {context: AuthorizationContext, grant: number}>) {
    //    this._name = name;
    //    this.roles = roles;
    //    this.permissionsGranted = permissionsGranted;
    //}

    constructor(){}

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    grant(permsGranted: string[]|number, authContext: AuthorizationContext): AuthorizationHolder {

        if (!_.isArray(permsGranted) && !_.isNumber(permsGranted)) {
            throw new Error("You must pass either a number or an array of string permissions when granting permissions");
        }

        else if (authContext == null) {
            throw new Error('Attempting to assign permissions to entity ' + this.name + ' with null AuthorizationContext');
        }

        var permsValue = _.isArray(permsGranted) ? authContext.getPermissionsAsNumber(permsGranted) : permsGranted;

        if ( permsValue > authContext.getMaxValue() ) {
            throw new Error( 'The permission bitmask that you are trying to assign: ' + permsValue
                + ' has a value greater than the maximum ' + authContext.getMaxValue()
                + ' that can be assigned in the context of AuthorizationContext ' + authContext.getName()
                + ' to entity ' + this.name);
        }

        if (permsValue > 0) {
            this.setPermissionGranted(authContext, false, permsValue);
        } else {
            this.getPermissionsGranted().remove(authContext.getName());
        }
        return this;

    }

    /** Grant a permission directly to this Role */
    private setPermissionGranted(authContext: AuthorizationContext, isDeny: boolean, value: number): void {
        this.getPermissionsGranted().setValue(
            authContext.getName(),
            { context: <AuthorizationContext> authContext, grant: <number> value }
        );
    }

    /**
     * @return a Map of the permissions held directly by this AuthorizationHolder,
     * rather than those inherited from a Role
     */
    protected getPermissionsGranted(): Dictionary<string, {context: AuthorizationContext, grant: number }> {
        if (this.permissionsGranted == null)
            this.permissionsGranted = new Dictionary<string, {context: AuthorizationContext, grant: number}>();

        return this.permissionsGranted;
    }

    hasPermissions(permNames: string[], authContextName: string): boolean {

        // almighty users have all permissions for now (TODO: add 'deny' mechanism)
        if (this.isAlmighty()) { return true; }

        var permsGranted = this.permissionsGranted.getValue(authContextName);
        if (!_.isObject(permsGranted)) { return false; }

        var authContext = permsGranted.context;
        var requiredPerms = -1;
        try
        {
            requiredPerms = authContext.getPermissionsAsNumber(permNames);
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

    can(permNames: string|string[], authContextName: string): boolean {
        if (_.isArray(permNames)) {
            return this.hasPermissions(permNames, authContextName);
        } else if (_.isString(permNames)) {
            return this.hasPermission(permNames, authContextName);
        } else {
            return false;
        }
    }

    isSuper(): boolean {
        return this._isSuper;
    }

    setSuper(isSuper: boolean): void {
        console.log('Setting ', this.name, 'to Super User!');
        this._isSuper = isSuper;
    }

    isAlmighty(): boolean {
        return this.isSuper();
    }

    setAlmighty(isAlmighty: boolean): void {
        this.setSuper(isAlmighty);
    }

    toJSON(): any {
        var out = _.clone(this);
        delete out.permissionsGranted;
        delete out._isSuper;
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
