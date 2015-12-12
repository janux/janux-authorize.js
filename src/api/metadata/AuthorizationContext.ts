/// <reference path="../../collections.ts" />

import basarat = require('../../collections');
import List = basarat.collections.LinkedList;
import Dictionary = basarat.collections.Dictionary;
import {iPermissionBit} from "./PermissionBit";
import PermissionBit from "../../impl/PermissionBit";
/**
 ***************************************************************************************************
 * An AuthorizationContext represents a set of individual Permissions defined for a specific business
 * context; for example, a AuthorizationContext named 'PERSON' may define five Permissions with names
 * 'READ', 'UPDATE', 'CREATE', 'DISABLE', 'PURGE', that define the kind of operations on Persons
 * that may be restricted by the security system.
 * <p>
 * The iPermissionBit interface, in turn, foresees an implementation that relies on bitmasks as a way to
 * assign Permissions to a Role. In the example above, the five Permissions above would be assigned
 * values 1, 2, 4, 8, 16 respectively, which would correspond to bit positions 0,1,2,3 and 4.  In
 * base-2 the five permissions would read 00001, 00010, 00100, 01000, 10000, respectively.
 * </p><p>
 * In order to grant READ/UPDATE permissions to a Role, a Role would be assigned the value 3=1+2
 * (in base-2: 00011) in the context of AuthorizationContext PERSON; a Role with a value of PERSON value of
 * 31 = 1 + 2 + 4 + 8 + 16 would have all Permissions, or 11111 in base-2.
 * </p>
 *
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 * @since 0.5.0 (renamed in 0.5.0 from PermissionContext, which dates from 0.1)
 ***************************************************************************************************
 */

export interface iAuthorizationContext {
	/** A unique name for this AuthorizationContext, in the context of the Application */
	getName(): string
	setName(name:string): void

	/**
	 * The set of permissions that this iPermissionBit Set defines; note that this represents meta
	 * information of what sort of Permissions are available to be assigned within the context of a
	 * Busines Context and a Role, but that a iPermissionBit Set does not confer any of these Permissions
	 * per-se to any entity.
	 */
	getPermissionBits(): Dictionary<string, PermissionBit>

	/** Returns a iPermissionBit by its unique name within the AuthorizationContext */
	getPermissionBit(name:string): iPermissionBit

	/**
	 * Adds a iPermissionBit to this AuthorizationContext - the implementation
	 * should make sure that there are no two iPermissionBits with the same name,
	 * and that the value of iPermissionBit.getPosition() is sequential and without gaps
	 */
	addPermissionBit(iPermissionBit:iPermissionBit): void

	/**
	 * In the case of an implementation that uses bitmasks to represent permissions, this is a
	 * Convenience method that returns the sum of values of a set of iPermissionBits specified by name;
	 * for example, in the example above getPermissionsAsNumber({READ, UPDATE}) would return 3
	 */
	getPermissionsAsNumber(permNames:string[]): number

	/**
	 * returns the maximum value that the permission bitmask can take, should be equal to
	 * (2 to the power of getiPermissionBits().size()) - 1
	 */
	getMaxValue(): number

	/** Human readable description of this iPermissionBit Set */
	getDescription(): string
	setDescription(description:string): void

	/** The order in which this AuthorizationContext should be displayed */
	getSortOrder(): number
	setSortOrder(sortOrder:number): void

	/** Determines whether or not this AuthorizationContext is being used */
	isEnabled(): boolean
	setEnabled(visible:boolean): void
}

