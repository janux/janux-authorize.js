import {iAuthorizationContext} from "./AuthorizationContext";
/**
 ***************************************************************************************************
 * Class representing an individual iPermissionBit within a specific iAuthorizationContext; a iPermissionBit is
 * only meaningful in the context of the iAuthorizationContext that defines it: for example, a iAuthorizationContext
 * named 'PERSON' may define Permissions with names 'CREATE', 'READ', 'UPDATE', 'DISABLE',
 * 'PURGE', that define the kind of operations on Persons that may be restricted by the security
 * system; see the javadoc of iAuthorizationContext for a more detailed discussion.
 * <p>
 * The iPermissionBit interface provides for defining the bit position of the iPermissionBit within a bit
 * mask (0, 1, 2, 3, etc...), and a convenience method for returning the long value of that bit
 * position (that is 2 taken to the power of the bitPosition, e.g. 1, 2, 4, 8...)
 * </p>
 *
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 * @since 0.1
 ***************************************************************************************************
 */

export interface iPermissionBit {
	/**
	 * Short-hand name for this iPermissionBit (e.g.: READ),
	 * unique in the context of the containing iAuthorizationContext
	 */
	getName(): string
	setName(name:string): void

	/**
	 * The position of the iPermissionBit within the bit mask defined by the iAuthorizationContext, should be a
	 * sequential integer relative to the sequence defined by the iAuthorizationContext; so if a iAuthorizationContext
	 * defines 5 permissions, this should be a number between 0 and 4 that is not used by any of the
	 * other Permissions in the iAuthorizationContext
	 */
	getPosition(): number
	setPosition(pos:number): void

	/** A convenience method that returns 2 to the power of the bitPosition */
	getValue(): number

	/** The iAuthorizationContext that contains/uses this iPermissionBit */
	getAuthorizationContext(): iAuthorizationContext
	setAuthorizationContext(authContext:iAuthorizationContext): void

	/**     Human readable description of this iPermissionBit */
	getDescription(): string
	setDescription(description:string): void

	/**
	 * used to display the sort order independently from the Bit's Position, defaults to the
	 * getPosition if not set explicitly
	 */
	getSortOrder(): number
	setSortOrder(i:number): void
}


