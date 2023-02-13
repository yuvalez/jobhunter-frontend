import { observable, action, computed, makeObservable } from 'mobx';
import { createContext } from 'react';

class AuthStore {

    // Ovservables
    token = [];

    constructor() {
        makeObservable(this, {
            token: observable,
            setToken: action,
            fetchToken: computed
        })
    }

    setToken = (token, ttl=1800) => {
        const now = new Date();
        const item = {
            token,
            expiry: now.getTime() + ttl * 1000,
        }
        localStorage.setItem('HFAadminToken', JSON.stringify(item))
        this.token = token;
    }

    get fetchToken() {
        const itemStr = localStorage.getItem('HFAadminToken')
        
        if (!itemStr) {
            return null;
        }
        const item = JSON.parse(itemStr);
        const now = new Date();
        if (now.getTime() > item.expiry) {
            localStorage.removeItem('HFAadminToken')
            return null;
        }
        if (item.token !== this.token) {
            this.setToken(item.token);
        }
        return this.token;
    }
}

export default createContext (new AuthStore());