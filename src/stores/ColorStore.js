import { observable, action, makeObservable, computed } from 'mobx';
import { createContext } from 'react';


const darkModePalette = {
    header: {
        background: "#121212",
        textColor: "#FFFFFFDE"

    },
    search: {
        inputPlaceholder: "#999",
        button: "#653243",
        buttonHover: "#883243",
        loadingDots_0: "rgb(111, 163, 240)",
        loadingDots_40: "rgb(111, 200, 240)",
        loadingDots_100: "rgb(111, 163, 240)"
        
    },
    body: {
        background: "#121212",
    },
    table: {
        cardBackground: "#323232",
        cardGroupNameText: "#CFCFCFDE",
        cardAreaText: "#CFCFCFDE",
        cardCategoryText: "#CFCFCFDE",
        cardBorder: "#333",
    }
}

const brightModePalette = {
    header: {
        background: "#DEDEDEDE",
        textColor: "#000000DE"
    },
    search: {
        inputPlaceholder: "#CCC",
        button: "#653243",
        buttonHover: "#883243",
        loadingDots_0: "rgb(111, 163, 240)",
        loadingDots_40: "rgb(111, 200, 240)",
        loadingDots_100: "rgb(111, 163, 240)"
    },
    body: {
        background: "#DEDEDEDE",
    },
    table: {
        cardBackground: "#EFEFEFEF",
        cardGroupNameText: "#121212DE",
        cardAreaText: "#121212DE",
        cardCategoryText: "#14141455",
        cardBorder: "#eee",
    }
}

class ColorStore {

    // Ovservables
    isDarkMode = false;
    
    constructor() {
        makeObservable(this, {
            isDarkMode: observable,
            toggleDarkMode: action,
            colorPalette: computed
        })
    }

    // Actions
    toggleDarkMode = () => {
        this.isDarkMode = !this.isDarkMode;
    }
    
    get colorPalette() {
        if (this.isDarkMode) {
            return darkModePalette;
        }
        return brightModePalette;
    }
}

export default createContext (new ColorStore());