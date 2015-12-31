'use strict';

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../collections.ts" />

import _ = require('lodash');
import basarat = require('../collections');
import collections = basarat.collections;
import List = collections.LinkedList;
import {AuthorizationHolder} from './AuthorizationHolder';
import {iAccount} from '../api/Account';

export class Account implements iAccount {

    protected name: string;
    private password: string;
    private expire: Date;
    private expirePassword: Date;
    private nonLocked: boolean;
    private enabled: boolean = true;

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

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    isAccountNonLocked(): boolean {
        return this.nonLocked;
    }

    setAccountNonLocked(b: boolean): void {
        this.nonLocked = b;
    }

    static createInstance(): Account {
        return new this;
    }

} // end class AccountImpl