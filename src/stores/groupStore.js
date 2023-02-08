import { observable, action, makeObservable } from 'mobx';
import axios from 'axios';
import { createContext } from 'react';
import { BASE_URL, DEFAULT_PAGE_SIZE } from '../constants';

class GroupsStore {

    // Ovservables
    textSearch = '';
    categoriesSearch = [];
    groups = [];
    area = '';
    listEnd = false;
    loadingState = false;
    categorySuggestions = [];
    areaSuggestions = [];
    offset = 0;


    constructor() {
        this.getDataFromApi = this.getDataFromApi.bind(this);
        this.resetGroupsAndSearch = this.resetGroupsAndSearch.bind(this);
        this.getCategorySuggestions();
        this.getAreaSuggestions();
        makeObservable(this, {
            textSearch: observable,
            loadingState: observable,
            area: observable,
            groups: observable,
            categorySuggestions: observable,
            areaSuggestions: observable,
            categoriesSearch: observable,
            listEnd: observable,
            setTextSearch: action,
            setGroups: action,
            setLoadingState: action,
            setFilteredArea: action,
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

    setFilteredArea = (area) => {
        this.area = area;
    }

    setCategorySuggestions = (suggestions) => {
        this.categorySuggestions = suggestions;
    }

    setAreaSuggestions = (areas) => {
        this.areaSuggestions = areas;
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
            })
    } 

    async getAreaSuggestions() {
        const requestData = {field: 'area'};
        await axios.post(`${BASE_URL}/api/distinct`, requestData)
            .then(res => {
                const areas = JSON.parse(res.data);
                this.setAreaSuggestions(areas.filter(area => area));
            })
    } 

    async getDataFromApi(pageSize) {
        this.setLoadingState(true);
        const requestData = {offset: this.offset, page_size: pageSize}
        // this.textSearch && (requestData.categories = [this.textSearch]);
        requestData.categories = this.categoriesSearch;
        this.area && (requestData.areas = [this.area]);
        await axios.post(`${BASE_URL}/api/groups`, requestData)
            .then(res => {
                const newGroups = JSON.parse(res.data);
                const oldGroups = this.groups;
                const groups = [...new Map([...oldGroups, ...newGroups].map((item) => [item["group_link"], item])).values()];
                this.offset = groups.length;
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
        this.offset = 0;
        await this.getDataFromApi(DEFAULT_PAGE_SIZE);
    }
}

export default createContext (new GroupsStore());