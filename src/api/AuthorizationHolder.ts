/// <reference path="../../typings/tsd.d.ts" />
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
	 * Returns a map of all the AuthorizationContexts in which this AuthorizationHolder Entity has been
	 * granted a Permission, whether directly or via a Sub-Role; the map is keyed by the
	 * AuthorizationContext's Name
	 */
	// getAuthorizationContexts(): { [key:string]: AuthorizationContext; }
	/** 
	 * Given a AuthorizationContext, this method returns the permissions, represented as strings, that
	 * this AuthorizationHolder Entity has in that permission context, or an empty array if the
	 * AuthorizationHolder Entity has no permissions in that AuthorizationContext
	 */
	// getPermissions(authorizationContext: string): string[]


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
	 * In the case of an implementation that uses bitmasks to store permissions, and given a
	 * permission context and a long value representing multiple permissions available in that
	 * context, this method returns true if this role has all the permissions indicated
	 *
	 * @since 0.5.0
	 */
	// can(permissionsValue: number, authorizationContext: string): boolean


	/** 
	 * In the case of an implementation that uses bitmasks to store permissions, and given a
	 * AuthorizationContext, this method returns the permissions that this AuthorizationHolder Entity has
	 * in that permission context, represented as a long value
	 */
	// getPermissionsValue(authorizationContext: string): number


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
	 * Explicitly denies a set of Permissions within a AuthorizationContext; this method should be used
	 * only to deny permissions that are inherited from Roles associated to this AuthorizationHolder
	 * entity; this method is not meant to be used as the opposite action to method 
	 * {@link #grant(long, AuthorizationContext)}, although it could be abused that way,
	 * <p>
	 * For example, assuming a Role 'PRODUCT ADMIN' that has the Permissions READ, UPDATE, CREATE, DISABLE,
	 * PURGE in the PRODUCT Permission Context (plus possibly other Permissions in other Permission
	 * Contexts), it may desireable to create a 'PRODUCT MANAGER' Role that has 'PRODUCT ADMIN' as its
	 * sub-role, but denies the Permissions to CREATE and PURGE.
	 * </p><p>
	 * <p>
	 * On the other hand, assume that we only have the 'PRODUCT ADMIN' Role that does not aggregate
	 * any other Roles, and that we want to revoke its 'PURGE' Permission, in the Permission Context
	 * 'PRODUCT'.  We could call 'deny' to do so, but this will create an 'isDeny' bitmask in
	 * addition to the existing 'allow' bitmask one through which the 'PURGE' Permission was
	 * originally granted. Instead, it would be simpler to call {@link #grant(long, AuthorizationContext)} 
	 * again with the proper 'allow' bitmask that no longer enables the 'PURGE' permission.  
	 * </p>
	 */
	// deny(permissionsDenied: string[], authorizationContext: AuthorizationContext): void

	/** 
	 * Same as {@link #deny(string[], AuthorizationContext)} 
	 * but takes a single permission as an argument, rather than an array 
	 */
	// deny(permissionDenied: string, authorizationContext: AuthorizationContext): void

	/**
	 * Equivalent to {@link #deny(string[], AuthorizationContext)} in implementations that use
	 * bitmasks to define permissions
	 *
	 * @see #deny(string[], AuthorizationContext)
	 */
	// deny(permissionsDenied: number, authorizationContext: AuthorizationContext): void

	/** If true, this Role is a super user with all Permissions */
	isAlmighty(): boolean

	/** set/unset whether this AuthorizationHolder is a super user with all Permissions */
	setAlmighty(isAlmighty: boolean): void

	/** the sub-roles that this Role aggregates */
	getRoles(): List<Role>
	setRoles(roles: List<Role>): void
}


