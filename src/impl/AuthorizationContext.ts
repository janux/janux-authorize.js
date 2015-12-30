'use strict';

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

export class AuthorizationContext implements iAuthorizationContext {

    get typeName():string {
        return 'janux.security.AuthorizationContext';
    }

    private name:string;
    private description:string;
    private sortOrder:number;
    private enabled:boolean;

    // stores permission bits indexed by name
    private _bit: Dictionary<string, PermissionBit> = new Dictionary<string, PermissionBit>();
    // stores permission bits ordered by bit position
    private authBitList:Dictionary<number, PermissionBit> = new Dictionary<number, PermissionBit>();

    constructor(aName:string, aDescription:string) {
        if (!_.isString(aName) || _.isEmpty(aName)) {
            throw new Error('Attempting to instantiate a PermissionContext without a name');
        }

        this.name = aName;
        this.description = aDescription;

        if(typeof this.authBitList === 'undefined'){
            this.authBitList = new Dictionary<number, PermissionBit>();
        }
    }

    getName():string {
        return this.name;
    }

    setName(name:string):void {
        this.name = name;
    }

    getPermissionBits(): Dictionary<string, PermissionBit> {
        return this._bit;
    }

    getPermissionBitsAsList(): Array<PermissionBit> {
        var out: Array<PermissionBit> = new Array<PermissionBit>();

        this.authBitList.forEach((kBit: number, bit:PermissionBit)=>{
            out[kBit] = bit;
        });

        return out;
    }

    getPermissionBit(name:string): PermissionBit {
        var pB = this.getBitMap().getValue(name); // this.getBitMap().getValue(name);
        if(typeof pB === 'undefined'){
            return null;
        }
        else {
            return pB;
        }
    }

    /**
     * Adds a PermissionBit to this PermissionContext, makes sure that there are no two PermissionBits
     * with the same name and that the value of PermissionBit.position is sequential and without
     * gaps
     */
    addPermissionBit(permissionBit: PermissionBit): void;
    addPermissionBit(bitName?: string, bitDescr?: string, sortOrder?: number): void;
    addPermissionBit(arg?: string | PermissionBit, bitDescr?: string, sortOrder?: number): void {

        var permBit: PermissionBit;

        if(typeof arg === 'string'){
            permBit = new PermissionBit(arg, bitDescr, sortOrder);
        }else if(typeof arg === 'object'){
            permBit = arg;
        }
        else{
            throw new Error('Unable to add permissionBit, wrong parameters. The first parameter can only be string or PermissionBit');
        }

        if (this.getPermissionBit(permBit.getName()) != null) {
            throw new Error('A permission bit with name: ' + name + ' already exists in PermissionContext ' + this.name);
        }

        permBit.label = permBit.getName();
        permBit.setPosition(this.getMaxBitPosition() + 1);
        permBit.setAuthorizationContext(this);

        if(permBit.getSortOrder() === -1){
            permBit.setSortOrder(permBit.getPosition());
        }
        // store bit by position
        this.authBitList.setValue(permBit.getPosition(), permBit);
        // store bit by name
        this._bit.setValue(permBit.getName(), permBit);
    }

    getPermissionAsNumber(permBitName: string): number {
        var permValue: number;

        if (!_.isString(permBitName)) {
            throw new Error ( 'Argument to getPermissionAsNumber must be a string');
        }

        var bit = this._bit.getValue(permBitName);

        if (!_.isObject(bit)) {
            throw new Error ('Cannot convert permission '+permBitName+' to number: it does not exist in PermissionContext '+ this.name);
        }
        permValue = Math.pow(2, bit.getPosition());

        return permValue;
    }

    getPermissionsAsNumber(permBitNames: string[]): number {
        if (!_.isArray(permBitNames)) {
            throw new Error ('Argument to getPermissionsAsNumber must be an array of strings');
        }

        var sumPerms = (out, perm) => {
            return out + this.getPermissionAsNumber(perm);
        }

        return  _.reduce(permBitNames, sumPerms, 0);
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
        return this._bit;
    }

    /**
     * returns the highest sequential bit position of all the bits in the permissionBit List,
     * or -1 if this AuthorizationContext has no PermissionBits assigned to it; the
     * value returned by this method should be equal to (getPermissionBits().size() - 1)
     * but we expressly iterate through the permission bits and assert that fact
     */
    private getMaxBitPosition():number {
        var maxBitPos:number = -1;

        // _.forEach(this._bit, function (bit: PermissionBit, bName: string) {
        this._bit.forEach((bName:string, bit:PermissionBit)=>{
                maxBitPos = Math.max(bit.getPosition(), maxBitPos);
        });

        return maxBitPos;
    }

    /**
     * Passing the 'doShortVersion' boolean flag will return a barebones representation of the
     * PermissionContext; this is useful when serializing to JSON PermissionHolder entities (Role,
     * Account) that need to know about the PermissionContext metadata, but where it's desirable to keep
     * those JSON strings from being overly verbose.  The default JSON representation will return something
     * like:
     *
     * {"name":"PERSON",
	*   "description":"Defines permissions available on a Person entity",
	*   "typeName":"janux.security.PermissionContext",
	*   "bit":{
	*     "READ":{"position":0,"label":"READ","description":"Grants permission to READ a PERSON","sortOrder":0},
	*     "UPDATE":{"position":1,"label":"UPDATE","description":"Grants permission to UPDATE a PERSON","sortOrder":99}
	*   }
	* }
     *
     * whereas the short representation of the same PermissionContext would return:
     *
     * {"name":"PERSON",
	*   "bit":{
	*     "READ":{"position":0},
	*     "UPDATE":{"position":1}
	*   }
	* }
     *
     */
    public toJSON(doShortVersion?:boolean):any {
        var out:any = {};
        out.name = this.name;

        if (!doShortVersion) {
            out.description = this.description;
        }

        // _.forEach(this.bit, function (bit: PermissionBit, bName: string) {
        this._bit.forEach((bName:string, bit: PermissionBit)=>{
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

    /** deserializes a PermissionContext from its canonical toJSON representation */
    static fromJSON(obj: any): AuthorizationContext {
        var out =  new AuthorizationContext(obj.name, obj.description) // exports.createInstance(obj.name, obj.description);
        var bitlist = _.pairs(obj.bit);
        _.each(bitlist, function(tuple) { out.addPermissionBit( new PermissionBit(tuple[0], tuple[1].description, tuple[1].sortOrder) ); });
        return out;
    }

    static createInstance(aName:string, aDescription:string) {
        return new AuthorizationContext(aName, aDescription);
    }

} // end class AuthorizationContext
// export = AuthorizationContextImpl;