import { observable, action, makeObservable } from 'mobx';
import axios from 'axios';
import { createContext } from 'react';
import { BASE_URL } from '../constants';

class PendingGroupsStore {

    // Ovservables
    groups = [];

    constructor() {
        this.getPendingGroups = this.getPendingGroups.bind(this);
        makeObservable(this, {
            groups: observable,
            setGroups: action,
            removeGroup: action
        })
    }

    setGroups = (groups) => {
        this.groups = groups;
    }

    removeGroup = (groupId) => {
        const filteredGroups = this.groups.filter(g => g.group_id !== groupId);

        this.groups = filteredGroups
    }

    async getPendingGroups(token) {
        // this.setLoadingState(true);
        const requestData = {token}
        await axios.post(`${BASE_URL}/api/pending_groups`, requestData)
            .then(res => {
                const groups =  JSON.parse(res.data)
                this.setGroups(groups);
            })
        // this.setLoadingState(false);
    }
}

export default createContext (new PendingGroupsStore());