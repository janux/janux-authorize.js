/**
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 * @version $Revision: 1.8 $ - $Date: 2007-01-11 23:13:10 $
 */
class RoleImpl extends AuthorizationHolderBase implements Role
{
    private id: number;
    private description: string;
    private sortOrder: number;
    private enabled: boolean = true;

    protected permissionsGranted: Dictionary<string, {context: AuthorizationContext, grant: number}>;

    constructor(name: string, description: string, roles: List<Role>, permissionsGranted: Dictionary<string, {context: AuthorizationContext, grant: number}>)
    {
        super(name, roles, permissionsGranted);
        this.setDescription(description);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getDescription(): string {
        return this.description;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    protected getPermissionsGranted(): Dictionary<string, {context: AuthorizationContext, grant: number}> {

        if (this.permissionsGranted == null){
            this.permissionsGranted = new Dictionary<string, {context: AuthorizationContext, grant: number}>();
        }
        return this.permissionsGranted;
    }

    protected setPermissionsGranted(permissionsGranted: Dictionary<string, {context: AuthorizationContext, grant: number}>): void {
        this.permissionsGranted = permissionsGranted;
    }

    getSortOrder(): number {
        return this.sortOrder;
    }

    setSortOrder(sortOrder: number): void {
        this.sortOrder = sortOrder;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

} // end class RoleImpl

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}