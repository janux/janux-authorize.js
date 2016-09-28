'use strict';

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../collections.ts" />

import _ = require('lodash');
import basarat = require('../collections');
import collections = basarat.collections;
import List = collections.LinkedList;
import {iUser} from '../api/User';

export class Account implements iUser {

    protected name: string;
    private password: string;
    private expire: Date;
    private expirePassword: Date;
    private locked: boolean;
    private enabled: boolean = true;
    private contact: any;

    constructor(){ }

    getName():string {
        return this.name;
    }

    setName(aName:string):void {
        this.name = aName;
    }

    getUsername(): string {
        return this.getName();
    }

    setUsername(name: string): void {
        this.setName(name);
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    getExpiration(): Date {
        return this.expire;
    }

    setExpiration(date: Date): void {
        this.expire = date;
    }

    getPasswordExpiration(): Date {
        return this.expirePassword;
    }

    setPasswordExpiration(date: Date): void {
        this.expirePassword = date;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    setActive(enabled: boolean): void {
        this.enabled = enabled;
    }

    getActive(): boolean {
        return this.enabled;
    }

    isAccountLocked(): boolean {
        return this.locked;
    }

    setAccountLocked(b: boolean): void {
        this.locked = b;
    }

    setContact(contact: any): void {
        this.contact = contact;
    }

    getContact(): any{
        return this.contact;
    }

    static createInstance(): Account {
        return new this;
    }

}