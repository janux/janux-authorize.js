'use strict';

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../collections.ts" />

import _ = require('lodash');
import basarat = require('../collections');
import collections = basarat.collections;
import Dictionary = collections.Dictionary;
import List = collections.LinkedList;
import {AuthorizationHolder} from './AuthorizationHolder';
import {AuthorizationContext} from './AuthorizationContext';
import {iRole} from '../api/Role';

/**
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 * @version $Revision: 1.8 $ - $Date: 2007-01-11 23:13:10 $
 */

export class Role extends AuthorizationHolder implements iRole
{
    get typeName():string {
        return 'janux.security.Role';
    }

    public name: string;
    public description: string;
    public sortOrder: number = 0;
    private enabled: boolean = true;

    constructor(aName: string, aDescription?: string)
    {
        super();
        this.name = aName;
        this.description = aDescription;
    }

    protected setPermissionsGranted(permissionsGranted: Dictionary<string, {context: AuthorizationContext, grant: number}>): void {
        this.permissionsGranted = permissionsGranted;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /** static method that deserializes a Role from its canonical toJSON representation */
   static fromJSON(obj: any): Role {
        var out = new Role(obj.name, obj.description);
        out.sortOrder = obj.sortOrder;
        _.each(obj.authContexts, (authContext:any) => {
            out.grant(obj.permissions[authContext.name].grant, AuthorizationContext.fromJSON(authContext));
        });
        if (obj.isAlmighty) out.setAlmighty(true);

        return out;
    }

    static createInstance(aName: string, aDescription?: string) {
        return new Role(aName, aDescription);
    }

} // end class Role