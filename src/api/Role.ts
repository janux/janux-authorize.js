/// <reference path="../collections.ts" />

import basarat = require('../collections');
import collection = basarat.collections;
import List = collection.LinkedList;
import {iAuthorizationHolder} from './AuthorizationHolder';
import {Role} from '../impl/Role';

/**
 ***************************************************************************************************
 * Roles are hierarchical constructs that aggregate Permissions and other Roles and make it possible
 * to compose a base set of Permissions in the following manner:
 * <ul>
 * 	<li>a ROLE_PRODUCT_MANAGER Role may be created comprising Create/Read/Update/Delete Permissions
 * 	to Product objects
 * 	</li><li>
 * 	a ROLE_CONTENT_MANAGER may be created comprising Create/Read/Update/Delete Permissions to
 * 	marketing content,
 * 	</li><li>
 * 	a ROLE_STORE_MANAGER may be created that encompasses all Permissions of the
 * 	ROLE_PRODUCT_MANAGER AND ROLE_CONTENT_MANAGER
 * 	</li><li>
 * 	a ROLE_SUPERVISOR may be created that encompasses the ROLE_STORE_MANAGER plus the permission to
 * 	publish content.
 * 	</li>
 * </ul>
 * <p>
 * In other words, individual permissions can be aggregated into Roles focused on a single set of
 * operations, as is the case of the ROLE_PRODUCT_MANAGER above.  These focused Roles can in turn
 * be composed into higher-level Roles which are closer to the Role of a Business Actor, as is the
 * case for the ROLE_STORE_MANAGER above.  Or, Roles and individual Permissions can be composed as
 * is the case of the ROLE_SUPERVISOR.
 * </p><p>
 * When a Role is changed, all Roles that aggregate that Role will also change.  So in the example
 * above, if the 'Product Delete' permission is removed from the ROLE_PRODUCT_MANAGER, the
 * permission will also be removed from the ROLE_STORE_MANAGER and ROLE_SUPERVISOR.
 * </p><p>
 * A Role may aggregate many sub-Roles and the same Role may be a direct sub-Role of various super
 * Roles. This is necessary to provide utmost flexibility, and safeguards should be taken in the
 * implementation to prevent looping condition that may result if a Role appears at multiple places
 * in a given Role hierarchy.
 * </p><p>
 * Individual permissions are assigned to a Role via a map that is keyed by a {@link PermissionContext}
 * and which value is a long integer representing a bitmask of the permissions assigned.
 * </p>
 * The key of the map, the PermissionContext defines a set of Permissions within a specific business
 * context.  Hence, in the example above, a PRODUCT PermissionContext may exist that defines
 * CREATE/READ/UPDATE/DELETE permissions in the context of managing a Product. PermissionSets need
 * not be limited to classes or entities, or CRUD operations, and may also define arbitrary User
 * Interface oriented Permissions.</p>
 * <p>
 * The value of the map is then a value resulting from adding the values of the individual
 * permissions; so in the case above, if the values 1,2,4,8 represent, respectively
 * CREATE/READ/UPDATE/DELETE permissions, a Role with a value of 15 = 1+2+4+8 would have the ability
 * to create, read, update and delete Products.
 * </p><p>
 * A Role could be queried for its Permissions via the syntax:
 * </>
 * <pre>
 * role.hasPermissions('PRODUCT', 1)  // READ perm in example above
 * or
 * role.hasPermissions('PRODUCT', 6)  // READ/UPDATE perms in example above
 * or
 * role.hasPermissions('PRODUCT', 'READ')  // accessing perm via String name unique in PermissionContext context
 * </pre>
 *
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 ***************************************************************************************************
 */

export interface iRole extends iAuthorizationHolder {
	/** a unique short-hand name for this role */
	name: string

	/** Human readable description of this Role */
	description: string

	/** default order in which this Role should be displayed in the context of a Role display */
	sortOrder: number

	/** whether or not this Role is useable in the system */
	enabled: boolean
}
