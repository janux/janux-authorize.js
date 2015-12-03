/// <reference path="../../typings/tsd.d.ts" />

import Dictionary = collections.Dictionary;

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
class AuthorizationHolderBase implements AuthorizationHolder
{
    protected _name:string;
    // protected roles: List<Role>;
    protected _isSuper:boolean;

    // protected  authContexts: Dictionary<string, AuthorizationContext>;
    protected authContexts: string[];
    protected permissions: Object;

    /** this is declared as protected simply for testing purposes */
    protected permissionsGranted: Dictionary<string, {context: AuthorizationContext, grant: number}>;

    private permsUnionMap: { [key:string]: number; };

    constructor(name: string, permissionsGranted: Dictionary<string, {context: AuthorizationContext, grant: number}> = null) {
        this._name = name;
        //this.roles = roles;
        this.permissionsGranted = permissionsGranted;
    }

    public getName(): string {
        return this._name;
    }

    public setName(name: string): void {
        this._name = name;
    }

    //public getRoles(): List<Role> {
    //    if (this.roles == null) { this.roles = new List<Role>(); }
    //    return this.roles;
    //}
    //
    //public setRoles(aggrRoles: List<Role>): void {
    //    this.roles = aggrRoles;
    //}

    grant(permsGranted: any, authContext: AuthorizationContext): void {

        permsGranted = (typeof(permsGranted) === 'string') ?  [permsGranted]: permsGranted;

        var permsNumber: number = _.isArray(permsGranted) ? authContext.getPermissionsAsNumber(permsGranted) : permsGranted;

        this.validatePermissions(authContext, permsNumber);

        console.log('granting permissions ' + permsGranted + ' in AuthorizationContext ' + authContext.getName() + ' to entity ' + this._name);

        // if the permission granted is 0, remove the record; note that this will
        // not revoke all permissions for this AuthorizationContext, as there may be
        // other permissions in this AuthorizationContext that are inherited from the
        // Roles of this entity
        if (permsGranted == 0)
            this.getPermissionsGranted().remove(authContext.getName());
        else
            this.setPermissionGranted(authContext, false, permsNumber);

        // recompute union of inherited and granted permissions
        this.permsUnionMap = null;
    }

    /**
     * validates that the perms provided are between 0 and authContext.getMaxValue(),
     * @throws IllegalArgumentException the perms provided are not between 0 and authContext.getMaxValue(),
     */
    private validatePermissions(authContext: AuthorizationContext, perms: number): void {
        var msg: string = null;

        if (authContext == null) {
            msg = 'Attempting to assign permissions to entity ' + this._name + ' with null AuthorizationContext';
        }
        else if ( perms < 0 ) {
            msg = 'Attempting to assign a negative permission bitmask in the context of AuthorizationContext ' + authContext.getName() + ' to entity ' + this._name;
        }
        else if ( perms > authContext.getMaxValue() ) {
            msg = 'The permission bitmask that you are trying to assign: ' + perms
                + ' has a value greater than the maximum ' + authContext.getMaxValue()
                + ' that can be assigned in the context of AuthorizationContext ' + authContext.getName()
                + ' to entity ' + this._name;
        }

        if (msg != null) {
            console.error(msg);
            throw new Error(msg);
        }
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

    hasPermissions(authContextName: string, permNames: string[]): boolean {

        // almighty users have all permissions for now (TODO: add 'deny' mechanism)
        if (this.isAlmighty) { return true; }

        var permsGranted = this.permissionsGranted.getValue(authContextName);
        if (!_.isObject(permsGranted)) { return false; }

        var permContext = permsGranted.context;
        var requiredPerms = -1;
        try
        {
            requiredPerms = permContext.getPermissionsAsNumber(permNames);
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

    hasPermission(authContextName: string, permissionName: string): boolean {
        var perm:string[] = [permissionName];
        return this.hasPermissions(authContextName, perm);
    }

    can(permNames: string|string[], authContextName: string): boolean {
        var perms:string[] = (!_.isArray(permNames)) ? [permNames] : permNames;
        return this.can(perms, authContextName);
    }

    isSuper(): boolean {
        return this._isSuper;
    }

    setSuper(isSuper: boolean): void {
        console.log('Setting ', this._name, 'to Super User!');
        this._isSuper = isSuper;
    }

    isAlmighty(): boolean {
        return this.isSuper();
    }

    setAlmighty(isAlmighty: boolean): void {
        this.setSuper(isAlmighty);
    }

    toJSON(): AuthorizationHolderBase {
        var out = _.clone(this);
        delete out.permissionsGranted
        delete out._isSuper;
        var perm;
        // outputs permissionsGranted separately from permissionsContexts to make json msg more readable
        // "permissions": {
        //   "PROPERTY":{"grant":3},
        //   "ACCOUNT":{"deny":7,}   // revokes inherited permissions, not yet implemented
        //   "EQUIPMENT":{"grant":3, "deny":4} // edge case, not yet implemented
        // }
        for (var key in this.permissionsGranted) {
            out.permissions = out.permissions || {};
            perm = this.permissionsGranted[key];
            out.permissions[key] = {};
            if (perm.grant) {out.permissions[key].grant = perm.grant;}
            if (perm.deny)  {out.permissions[key].deny  = perm.deny;}

            out.authContexts = out.authContexts || [];
            out.authContexts.push(perm.context.toJSON(true)); // true = doShortVersion
        }

        return out;
    }

} // end class
