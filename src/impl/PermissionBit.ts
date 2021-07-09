'use strict';

/// <reference path="../collections.ts" />

import basarat = require('../collections');
import collections = basarat.collections;

import {iPermissionBit} from "../api/PermissionBit";
import {iAuthorizationContext} from "../api/AuthorizationContext";

export class PermissionBit implements iPermissionBit {
    public name:string;
    public description:string;
    public label:string;
    public position:number = -1;

    public authorizationContext:iAuthorizationContext;
    private  _sortOrder:number;

    constructor(name?:string, description?:string, sortOrder?:number, position?:number) {

        // if(!_.isString(name)){
        if(!(name instanceof String)){
            throw new Error('Unable to create permissionBit with name that is not a string');
        }else{
            if(name == ''){
                throw new Error('Unable to create permissionBit with an empty name');
            }
        }

        this.name =name;
        this.description = description;
        // this.sortOrder = _.isNumber(sortOrder) ? sortOrder : -1;
        this.sortOrder = !Number.isNaN(sortOrder) ? sortOrder : -1;
        // this.position = _.isNumber(position) ? position : -1;
        this.position = !Number.isNaN(position) ? position : -1;
    }

    getValue():number {
        return Math.pow(2.0, this.position);
    }

    get sortOrder():number {
        if (this._sortOrder == null)
            this._sortOrder = this.position;

        return this._sortOrder;
    }

    set sortOrder(value:number) {
        this._sortOrder = value;
    }

    toString() {
        // Short hand. Adds each own property
        return collections.makeString(this);
    }

} // end class PermissionBitImpl

