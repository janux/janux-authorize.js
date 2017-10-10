/// <reference path="../collections.ts" />

import basarat = require('../collections');
import collections = basarat.collections;
import List = collections.LinkedList;
import {AuthorizationContext} from '../impl/AuthorizationContext';
import {Role} from '../impl/Role';

/**
 *************************************************************************************************
 * This interface defines classes that may have permissions granted to them; as of this
 * writing, it is intended to be a super interface for the Account and Role interfaces, both of
 * which may be assigned Permissions directly.
 *
 * This interface was originally named PermissionsCapable, and was renamed in version 0.5. It still
 * extends PermissionsCapable, an empty interface, for backward-compatibility, and this dependency
 * will be removed in a future release.
 *
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 * @since 0.5.0 (renamed in 0.5 from PermissionsCapable, which dates from 0.1)
 *************************************************************************************************
 */

export interface iAuthorizationHolder{

	/** 
	 * Given a permission context, and the names of permissions available in that context, 
	 * this method returns true if this role has all the permissions named
	 *
	 * @since 0.5.0
	 */
	can(permissionNames: string[], authorizationContext: string): boolean


	/** 
	 * Given a permission context, and the name of a permission available in that context, 
	 * this method returns true if this role has the permission named
	 *
	 * @since 0.5.0
	 */
	can(permissionName: string, authorizationContext: string): boolean
	
	/** 
	 * Given a permission context and a string array representing multiple permissions available in
	 * that context, this method grants the permissions indicated to this AuthorizationHolder Entity.
	 * <p>
	 * The permissions granted by this method replace any direct permissions that the AuthorizationHolder may
	 * already have in this AuthorizationContext, and are in addition to any permissions that this entity
	 * may inherit from its Roles.  If you would like to remove all Permissions granted directly to
	 * this entity within a Permission Context, pass an empty or null array.
	 * </p><p>
	 * Note that passing an empty or null array will not work to revoke permissions that this
	 * entity may have inherited from its Roles; in such case you should call {@link #deny} to
	 * explicitly deny the permissions in question.
	 * </p>
	 *
	 * @see #deny(string[], AuthorizationContext)
	 *
	 * @param authorizationContext a valid AuthorizationContext
	 * @param permissionsGranted
	 * 	an array of strings representing permissions that are to be granted to this AuthorizationHolder
	 * 	Entity, for example ["READ","UPDATE"]; the permissions must be available in the named AuthorizationContext
	 */
	grant(permissionsGranted: any, authorizationContext: AuthorizationContext): void

	/**
	 * Given the name of an authorization context, we obtain the arrangement of permissions
	 * that have been granted
	 * @param Authorization Context name
	 * @return Array of labels representing the granted permits
	 */
	getGrantAsBitList(authContextName: string): string[]

	/** If true, this Role is a super user with all Permissions */
	isAlmighty: boolean

	/** the sub-roles that this Role aggregates */
	roles: List<Role>
}


