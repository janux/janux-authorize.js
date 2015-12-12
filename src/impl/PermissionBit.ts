/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../collections.ts" />

import basarat = require('../collections');
import collections = basarat.collections;

import {iPermissionBit} from "../api/metadata/PermissionBit";
import {iAuthorizationContext} from "../api/metadata/AuthorizationContext";

import _ = require('lodash');

export default class PermissionBit implements iPermissionBit {
    private name:string;
    private _label:string;
    private position:number = -1;

    private description:string;
    private authContext:iAuthorizationContext;
    private sortOrder:number;

    constructor(name:string, description?:string, sortOrder?:number) {

        if(!_.isString(name)){
            throw new Error('Unable to create permissionBit with name that is not a string');
        }else{
            if(name == ''){
                throw new Error('Unable to create permissionBit with an empty name');
            }
        }

        this.setName(name);
        this.setDescription(description);
        this.sortOrder = _.isNumber(sortOrder) ? sortOrder : -1;
    }

    get label():string {
        return this._label;
    }

    set label(value:string) {
        this._label = value;
    }

    getName():string {
        return this.name;
    }

    setName(name:string):void {
        this.name = name;
    }

    getPosition():number {
        return this.position;
    }

    setPosition(position:number):void {
        this.position = position;
    }

    getValue():number {
        return Math.pow(2.0, this.getPosition());
    }

    getAuthorizationContext():iAuthorizationContext {
        return this.authContext;
    }

    setAuthorizationContext(bitmask:iAuthorizationContext):void {
        this.authContext = bitmask;
    }

    getDescription():string {
        return this.description;
    }

    setDescription(description:string):void {
        this.description = description;
    }

    getSortOrder():number {
        if (this.sortOrder == null)
            this.sortOrder = this.getPosition();

        return this.sortOrder;
    }

    setSortOrder(i:number):void {
        this.sortOrder = i;
    }

    toString() {
        // Short hand. Adds each own property
        return collections.makeString(this);
    }

} // end class PermissionBitImpl

