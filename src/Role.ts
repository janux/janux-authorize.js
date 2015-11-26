interface Role extends AuthorizationHolder {
	/** a unique short-hand name for this role */
	getName(): string
	setName(name: string): void

	/** Human readable description of this Role */
	getDescription(): string
	setDescription(description: string): void

	/** the sub-roles that this Role aggregates */
	getRoles(): List<Role>
	setRoles(roles: List<Role>): void

	/** default order in which this Role should be displayed in the context of a Role display */
	getSortOrder(): number
	setSortOrder(sortOrder: number): void

	/** whether or not this Role is useable in the system */
	isEnabled(): boolean
	setEnabled(enabled: boolean): void

}
