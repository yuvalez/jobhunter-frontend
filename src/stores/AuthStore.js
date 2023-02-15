import { observable, action, computed, makeObservable } from 'mobx';
import { createContext } from 'react';

class AuthStore {

    // Ovservables
    token = "";
    reload = false

    constructor() {
        makeObservable(this, {
            token: observable,
            reload: observable,
            setReload: action,
            setToken: action,
            fetchToken: computed
        })
    }

    setReload = () => {
        this.reload = !this.reload;
    }

    setToken = (token, ttl=1800) => {
        const now = new Date();
        const item = {
            token,
            expiry: now.getTime() + ttl * 1000,
        }
        localStorage.setItem('HFAadminToken', JSON.stringify(item))
        const itemStr = localStorage.getItem('HFAadminToken')
        this.token = token;
    }

    get fetchToken() {
        const updatedToken = this.token;
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
        if (item.token !== updatedToken) {
            this.setToken(item.token);
        }
        return updatedToken;
    }

    getTokenValue = () => {
        return this.fetchToken;
    }
}

export default createContext (new AuthStore());