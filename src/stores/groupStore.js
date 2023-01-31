import { observable, action, makeObservable, computed } from 'mobx';
import axios from 'axios';
import { createContext } from 'react';
import { BASE_URL, DEFAULT_PAGE_SIZE } from '../constants';

class GroupsStore {

    // Ovservables
    textSearch = '';
    categoriesSearch = [];
    groups = [];
    listEnd = false;
    loadingState = false;
    categorySuggestions = [];


    constructor() {
        this.getDataFromApi = this.getDataFromApi.bind(this);
        this.resetGroupsAndSearch = this.resetGroupsAndSearch.bind(this);
        this.getCategorySuggestions();
        makeObservable(this, {
            textSearch: observable,
            loadingState: observable,
            groups: observable,
            categorySuggestions: observable,
            categoriesSearch: observable,
            listEnd: observable,
            setTextSearch: action,
            setGroups: action,
            setLoadingState: action,
            addCategory: action,
            setListEnd: action,
        })
    }

    addCategory = (category) => {
        this.categoriesSearch = [...new Set([...this.categoriesSearch, category])];
    }
    
    removeCategory = (category) => {
        const index = this.categoriesSearch.indexOf(category);
        this.categoriesSearch.splice(index, 1);
    }

    // Actions
    setTextSearch = (text) => {
        this.textSearch = text;
    }

    setCategorySuggestions = (suggestions) => {
        this.categorySuggestions = suggestions;
    }

    setGroups = (groups) => {
        this.groups = groups;
    }

    setLoadingState = (state) => {
        this.loadingState = state;
    }

    setListEnd = (state) => {
        this.listEnd = state;
     }


    async getCategorySuggestions() {
        const requestData = {field: 'category'};
        await axios.post(`${BASE_URL}/api/distinct`, requestData)
            .then(res => {
                const categories = JSON.parse(res.data);
                this.setCategorySuggestions(categories);
                console.log(categories);
            })
    } 

    async getDataFromApi(offset, pageSize) {
        this.setLoadingState(true);
        const requestData = {offset: offset, page_size: pageSize}
        // this.textSearch && (requestData.categories = [this.textSearch]);
        requestData.categories = this.categoriesSearch;
        await axios.post(`${BASE_URL}/api/groups`, requestData)
            .then(res => {
                const newGroups = JSON.parse(res.data);
                const oldGroups = this.groups;
                
                const groups = [...new Map([...oldGroups, ...newGroups].map((item) => [item["group_link"], item])).values()];
                if (newGroups.length < pageSize) {
                    this.setListEnd(true);
                }
                this.setGroups(groups);
            })
        this.setLoadingState(false);
    }

    async resetGroupsAndSearch() {
        this.setGroups([]);
        this.setListEnd(false);
        await this.getDataFromApi(0, DEFAULT_PAGE_SIZE);
    }
}

export default createContext (new GroupsStore());