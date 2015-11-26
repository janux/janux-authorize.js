/**
 ***************************************************************************************************
 * Class representing an individual PermissionBit within a specific AuthorizationContext; a PermissionBit is
 * only meaningful in the context of the AuthorizationContext that defines it: for example, a AuthorizationContext
 * named 'PERSON' may define Permissions with names 'CREATE', 'READ', 'UPDATE', 'DISABLE',
 * 'PURGE', that define the kind of operations on Persons that may be restricted by the security
 * system; see the javadoc of AuthorizationContext for a more detailed discussion.
 * <p>
 * The PermissionBit interface provides for defining the bit position of the PermissionBit within a bit
 * mask (0, 1, 2, 3, etc...), and a convenience method for returning the long value of that bit
 * position (that is 2 taken to the power of the bitPosition, e.g. 1, 2, 4, 8...)
 * </p>
 *
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 * @since 0.1
 ***************************************************************************************************
 */

interface PermissionBit
{
	/**	
	 * Short-hand name for this PermissionBit (e.g.: READ), 
	 * unique in the context of the containing AuthorizationContext 
	 */
	getName(): string
	setName(name: string): void

	/** 
	 * The position of the PermissionBit within the bit mask defined by the AuthorizationContext, should be a
	 * sequential integer relative to the sequence defined by the AuthorizationContext; so if a AuthorizationContext
	 * defines 5 permissions, this should be a number between 0 and 4 that is not used by any of the
	 * other Permissions in the AuthorizationContext
	 */
	getPosition(): number
	setPosition(pos: number): void

	/** A convenience method that returns 2 to the power of the bitPosition */
	getValue(): number

	/** The AuthorizationContext that contains/uses this PermissionBit */
	getAuthorizationContext(): AuthorizationContext
	setAuthorizationContext(authContext: AuthorizationContext): void

	/**	 Human readable description of this PermissionBit */
	getDescription(): string
	setDescription(description: string): void

	/** 
	 * used to display the sort order independently from the Bit's Position, defaults to the
	 * getPosition if not set explicitly 
	 */
	getSortOrder(): number
	setSortOrder(i: number): void
}


