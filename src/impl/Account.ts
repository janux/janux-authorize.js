'use strict';

/// <reference path="../collections.ts" />

import basarat = require('../collections');
import collections = basarat.collections;
import List = collections.LinkedList;
import {iAccount} from '../api/Account';

export class Account implements iAccount {

    public username: string;
    public password: string;
    public expire: Date;
    public expirePassword: Date;
    public locked: boolean;
    public enabled: boolean = true;
    public contact: any;

    constructor(){ }

    static createInstance(): Account {
        return new this;
    }
}