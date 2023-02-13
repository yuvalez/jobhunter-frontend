import { observable, action, makeObservable, computed } from 'mobx';
import { createContext } from 'react';


const darkModePalette = {
    header: {
        background: "#071013",
        textColor: "#AAAAAA"

    },
    search: {
        inputPlaceholder: "#AAAAAA66",
        inputBackground: "#07101399",
        inputBoxShadow: "#5158bb",
        inputText: "#AAAAAA",
        button: "#3C415C",
        buttonHover: "#3C517C",
        autoSuggest: {
            background: "#071013",
            itemBackgroundHover: "#171A1C",
            listBoxShadow: "#5158bb"
        },
        loadingDots_0: "rgb(111, 163, 240)",
        loadingDots_40: "rgb(111, 200, 240)",
        loadingDots_100: "rgb(111, 163, 240)",
        pills: {
            color: "#5158bb",
            borderColor: "#5158bb",
            closeColor: "#5158bb",
            backgroundColor: "#5158bb13"
        },
        areaDropDown: {
            buttonBorder: "#5158bb",
            buttonBackground: "#071013",
            boxShadow: "#5158bb",
            text: "#AAAAAA",
            itemBackground: "#071013",
            itemBackgroundHover: "#171A1C"
        }
    },
    body: {
        background: "#071013",
    },
    table: {
        cardBackground: "#1B1D21",
        cardGroupNameText: "#DFE0E2",
        cardAreaText: "#DFE0E2",
        cardCategoryText: "#DFE0E2",
        cardBorder: "#5158bb",
    },
    footer: {
        background: "#1B1D21",
        text: "#DFE0E2"
    },
    about: {
        text: "#666",
        headerText: "#CCC",
        background: "#121212",
        shadow: "rgba(255, 255, 255, 0.5)",
        headerTextShadow: "rgba(255, 255, 255, 0.5)"
    },
    login: {
        buttonText: "#FFF",
        buttonBackground: "#3C415C",
        buttonBackgroundHover: "#3C517C",
        label: "#AAAAAA",
        inputBackground: "#07101399",
        inputBoxShadow: "#5158bb",
        inputText: "#AAAAAA",
    },
    pending: {
        alternateBackground: "#1B1D21",
        background: "#2E2D31",
        text: "#AAA",
        link: "#EE44EE"
    },
    modal: {
        background: "#1B1D21",
        text: "#AAA",
        shadow: "#BBB",
        exitButton: "#CCC"
    }
}

const lightModePalette = {
    header: {
        background: "#DEDEDE",
        textColor: "#000000DE"
    },
    search: {
        inputPlaceholder: "#CCC",
        inputBackground: "#EFEFEF",
        inputBoxShadow: "#CCC",
        inputText: "#333",
        button: "#A5806C",
        buttonHover: "#95705C",
        autoSuggest: {
            background: "#fff",
            itemBackgroundHover: "#f2f2f2",
            listBoxShadow: "#CCC"
        },
        loadingDots_0: "rgb(111, 163, 240)",
        loadingDots_40: "rgb(111, 200, 240)",
        loadingDots_100: "rgb(111, 163, 240)",
        pills: {
            color: "#2470FF",
            closeColor: "#2470FF",
            borderColor: "#2470FF",
            backgroundColor: "#2470FF13"
        },
        areaDropDown: {
            buttonBorder: "#333",
            buttonBackground: "#EFEFEF",
            boxShadow: "#CCC",
            text: "#333",
            itemBackground: "#EFEFEF",
            itemBackgroundHover: "#DEDEDE"
        }
    },
    body: {
        background: "#DEDEDE",
    },
    table: {
        cardBackground: "#EFEFEFEF",
        cardGroupNameText: "#121212DE",
        cardAreaText: "#121212DE",
        cardCategoryText: "#14141455",
        cardBorder: "#eee",
    },
    footer: {
        background: "#EFEFEFEF",
        text: "#121212DE"
    },
    about: {
        text: "#666",
        headerText: "333",
        background: "#EFEFEF",
        shadow: "rgba(0, 0, 0, 0.2)",
        headerTextShadow: "rgba(0, 0, 0, 0.2)"
    },
    login: {
        buttonText: "#000",
        buttonBackground: "#A5806C",
        buttonBackgroundHover: "#95705C",
        label: "#333",
        inputBackground: "#EFEFEF",
        inputBoxShadow: "#CCC",
        inputText: "#333"
    },
    pending: {
        alternateBackground: "#9e9e9e",
        background: "#DEDEDE",
        text: "#333",
        link: "#4444EE"
    },
    modal: {
        background: "#EFEFEF",
        text: "#333",
        shadow: "#222",
        exitButton: "#222"
    }
}

class ColorStore {

    // Ovservables
    isDarkMode = true;
    
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
        return lightModePalette;
    }
}

export default createContext (new ColorStore());