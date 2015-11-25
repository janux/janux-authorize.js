interface Role{
	/** a unique short-hand name for this role */
	getName(): String
	setName(name: String): void

	/** Human readable description of this Role */
	getDescription(): String
	setDescription(description: String): void

	/** the sub-roles that this Role aggregates */
	getRoles(): Array<Role>
	setRoles(roles: Array<Role>): void

	/** default order in which this Role should be displayed in the context of a Role display */
	getSortOrder(): number
	setSortOrder(sortOrder: number): void

	/** whether or not this Role is useable in the system */
	isEnabled(): boolean
	setEnabled(enabled: boolean): void

}
