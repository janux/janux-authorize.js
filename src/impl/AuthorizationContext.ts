/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../collections.ts" />

import _ = require('lodash');
import basarat = require('../collections');
import collections = basarat.collections;
import List = basarat.collections.LinkedList;
import Dictionary = basarat.collections.Dictionary;
import {iAuthorizationContext} from "../api/metadata/AuthorizationContext";
import {iPermissionBit} from "../api/metadata/PermissionBit";
import PermissionBit from "./PermissionBit";

export default class AuthorizationContext implements iAuthorizationContext {

    private id:number;
    private name:string;
    private description:string;
    private sortOrder:number;
    private enabled:boolean;
    private bits:List<iPermissionBit>;
    private bitMap:Dictionary<string, iPermissionBit>;

    private bit: Dictionary<string, PermissionBit>;  // stores permission bits indexed by name
    private authBitList:Dictionary<number, PermissionBit>; // stores permission bits ordered by bit position

    constructor(aName:string, aDescription:string) {
        if (!_.isString(aName) || _.isEmpty(aName)) {
            throw new Error('Attempting to instantiate a PermissionContext without a name');
        }

        this.name = aName;
        this.description = aDescription;

        if(typeof this.authBitList == 'undefined'){
            this.authBitList = new Dictionary<number, PermissionBit>();
        }
    }

    getId():number {
        return this.id;
    }

    setId(id:number):void {
        this.id = id;
    }

    getName():string {
        return this.name;
    }

    setName(name:string):void {
        this.name = name;
    }

    getPermissionBits():List<iPermissionBit> {
        if (this.bits == null)
            this.bits = new List<iPermissionBit>();

        return this.bits;
    }

    protected setPermissionBits(permissionBits:List<iPermissionBit>):void {
        this.bits = permissionBits;
    }

    getPermissionBit(name:string): PermissionBit {
        var pB = this.getBitMap().getValue(name);
        if(typeof pB == 'undefined'){
            return null;
        }
        else {
            return pB;
        }
    }

    addPermissionBit(permBit: PermissionBit):void {

        if (!_.isString(permBit.getName())) {
            throw new Error('Attempting to add a PermissionBit without a name to PermissionContext' + this.name);
        }

        if (this.getPermissionBit(permBit.getName()) != null) {
            throw new Error('A permission bit with name: ' + name + ' already exists in PermissionContext ' + this.name);
        }

        permBit.setPosition(this.getMaxBitPosition() + 1);
        permBit.setAuthorizationContext(this);

        if(permBit.getSortOrder() == -1){
            permBit.setSortOrder(permBit.getPosition());
        }
        // store bit by position
        this.authBitList.setValue(permBit.getPosition(), permBit);
        // store bit by name
        this.bit.setValue(permBit.getName(), permBit);
    }

    getPermissionsAsNumber(permBitNames: string[]): number {
        var permsValue: number = 0;

        for(var i in permBitNames){
            var permName: string = permBitNames[i];
            if (this.getPermissionBit(permName) != null) {
                permsValue += this.getPermissionBit(permName).getValue();
            } else {
                var msg:string = 'The permission ' + permName + ' is not defined in the Permission Context ' + this.getName();
                throw new Error(msg);
            }
        };

        return permsValue;
    }

    getValue(permBitNames:string[]):number {
        return this.getPermissionsAsNumber(permBitNames);
    }

    getMaxValue():number {
        return Math.pow(2.0, this.getPermissionBits().size()) - 1;
    }

    /* Human readable description of this PermissionBit Set */
    getDescription():string {
        return this.description;
    }

    setDescription(description:string):void {
        this.description = description;
    }

    getSortOrder():number {
        return this.sortOrder;
    }

    setSortOrder(sortOrder:number):void {
        this.sortOrder = sortOrder;
    }

    isEnabled():boolean {
        return this.enabled;
    }

    setEnabled(visible:boolean):void {
        this.enabled = visible;
    }

    /**
     * The set of permissions that this PermissionBit Set defines; note that this represents meta
     * information of what sort of Permissions are available to be assigned within the context of a
     * Busines Context and a Role, but that a PermissionBit Set does not confer any of these Permissions
     * per-se to any entity.
     */
    protected getBitMap():Dictionary<string, PermissionBit> {
        if(typeof this.bit == 'undefined'){
            this.bit = new Dictionary<string, PermissionBit>();
        }
        return this.bit;
    }

    /**
     * returns the highest sequential bit position of all the bits in the permissionBit List,
     * or -1 if this AuthorizationContext has no PermissionBits assigned to it; the
     * value returned by this method should be equal to (getPermissionBits().size() - 1)
     * but we expressly iterate through the permission bits and assert that fact
     */
    private getMaxBitPosition():number {
        var maxBitPos:number = -1;

        this.bit.forEach((bName:string, bit:PermissionBit)=>{
                maxBitPos = Math.max(bit.getPosition(), maxBitPos);
        });

        return maxBitPos;
    }

    public toJSON(doShortVersion:boolean):any {
        var out:any = {};
        out.name = this.name;

        if (!doShortVersion) {
            out.description = this.description;
        }

        this.bit.forEach((bName:string, bit: PermissionBit)=>{
            out.bit = out.bit || {};
            var aBit:any = {};
            aBit.position = bit.getPosition();

            if (!doShortVersion) {
                aBit.label = bit.getName();
                aBit.description = bit.getDescription();
                aBit.sortOrder = bit.getSortOrder();
            }
            out.bit[bit.getName()] = aBit;
        });
        return out;
    }

    toString() {
        // Short hand. Adds each own property
        return collections.makeString(this);
    }

} // end class AuthorizationContext
// export = AuthorizationContextImpl;