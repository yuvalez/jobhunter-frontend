import React, { useContext, useRef, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import GroupsStore from '../stores/GroupStore';
import styled from 'styled-components';
import { size as deviceSize } from '../constants';
import PillsFilter from './pillsFilter';
import DropDownList from './dropDownList';
import ColorStore from '../stores/ColorStore';

const SearchBarContainer = styled.div`
  margin: 2rem auto;
  width: ${({ isMobile }) => isMobile ? '100%': '90%'};
`;

const RowDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: .75rem;
  margin-bottom: 0;
`;

const PillsRow = styled.div`
  display: block;
  width: ${({ isMobile }) => isMobile? '100%' : '50%'};
  direction: rtl;
  margin: 0 auto;
`;


const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  direction: rtl;
  border-radius: .75rem;
  color: ${({ palette }) => palette.search.inputText};
  background-color: ${({ palette }) => palette.search.inputBackground};
  box-shadow: 0px 0px 10px ${({ palette }) => palette.search.inputBoxShadow};
  font-size: 18px;
  outline:none;
  &::placeholder {
    color: ${({ palette }) => palette.search.inputPlaceholder};
  }
`;

const SearchButton = styled.button`
  background-color: ${({ palette }) => palette.search.button};
  color: white;
  padding: .75rem 1.1rem;
  border: none;
  border-radius: .75rem;
  cursor: pointer;
  width: 6rem;
  font-size: 1em;
  margin-left:1rem;
  transition: all 0.2s ease-in-out;
  align-self: stretch;
  &:hover {
    background-color: ${({ palette }) => palette.search.buttonHover};
    transform: scale(1.02);
  }
`;

const AutoSuggestContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 100%;
  background-color: ${({ palette }) => palette.search.autoSuggest.background};
  opacity: ${params => params.showSuggestions ? '1' : '0'};
  height: ${params => params.showSuggestions ? 'inherit' : '0'};
  max-height: ${params => params.showSuggestions ? '500px' : '0'};
  box-shadow: 0px 0px 4px ${({ palette }) => palette.search.autoSuggest.listBoxShadow};
  border-radius: .75rem;
  z-index: 10;
  direction: rtl;
  margin: 1rem 0rem;
  padding: 1rem;
  transition: all .15s ease-in-out;
//   transition: max-height .15s ease-in;
`;

const AutoSuggestList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AutoSuggestItem = styled.li`
  padding: 10px;
  cursor: pointer;
  opacity: ${params => params.showSuggestions ? '1' : '0'};
  transition: all .25s ease-in;
  color: ${({ palette }) => palette.search.inputText};
  background-color: ${({ palette }) => palette.search.autoSuggest.background};
  &:hover {
    background-color: ${({ palette }) => palette.search.autoSuggest.itemBackgroundHover};
  }
`;

const InputWithSuggestions = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  direction: rtl;
`;

const InnerRowDiv = styled.div`
  display: flex;
  width: ${({ isMobile }) => isMobile ? '100%': '50%'};
  flex-direction: ${({ isMobile }) => isMobile ? 'column': 'row'};
  row-gap: .5rem;
  column-gap: .5rem;
  margin: 0 1rem;
`;

const SearchBar = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const suggestRef = useRef(null);
  const groupStore = useContext(GroupsStore);
  const colorStore = useContext(ColorStore);
  const [width, setWidth] = useState(window.innerWidth);
  const { colorPalette } = colorStore;

  const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
  }

  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  const isMobile = width <= deviceSize.tablet;

  const { categorySuggestions: suggestions, areaSuggestions, textSearch, setTextSearch, resetGroupsAndSearch,
          addCategory, categoriesSearch, setFilteredArea, area } = groupStore;

  
  const handleSearch = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (suggestions.includes(textSearch) && !categoriesSearch.includes(textSearch)) {
        setShowSuggestions(false);
        addCategory(textSearch);
        setTextSearch('');
    }
    resetGroupsAndSearch();
  };

  const handleInputChange = (event) => {
    setTextSearch(event.target.value);
    console.log(textSearch);
    const suggestionsWithoutAlreadyChosen = suggestions.filter(el => categoriesSearch.indexOf(el) < 0);
    const filtered = suggestionsWithoutAlreadyChosen.filter((suggestion) =>
      suggestion.toLowerCase().startsWith(event.target.value.toLowerCase())
    );
    setFilteredSuggestions(filtered.slice(0, 5));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    addCategory(suggestion);
    resetGroupsAndSearch();
    setTextSearch('');
    setShowSuggestions(false);
};

return (
  <SearchBarContainer isMobile={isMobile}>
    <RowDiv>
    <SearchButton onClick={handleSearch} palette={colorPalette}>חפש</SearchButton>
    <InnerRowDiv isMobile={isMobile}>
      <DropDownList options={areaSuggestions} setText={setFilteredArea} text={area} isMobile={isMobile} defaultOption={"כל האיזורים"} 
                    defaultOptionAction={e => {
                      e.stopPropagation();
                      setFilteredArea("");
                    }}
                    colorPalette={colorPalette.search.areaDropDown}
      />
      <InputWithSuggestions>
        <SearchInput
          palette={colorPalette}
          type="text"
          placeholder="הקלד קטגוריה..."
          value={textSearch}
          onChange={handleInputChange}
          onFocus={(e) => {
            e.stopPropagation();
            setShowSuggestions(true);
          }}
          onBlur={(e) => {
            e.stopPropagation();
            setShowSuggestions(false);
        }}
        />
        {textSearch && filteredSuggestions.length > 0 && (
          <AutoSuggestContainer showSuggestions={showSuggestions || true} palette={colorPalette}>
            <AutoSuggestList ref={suggestRef}>
              {filteredSuggestions.map((suggestion) => (
                <AutoSuggestItem
                  palette={colorPalette}
                  key={suggestion}
                  showSuggestions={showSuggestions || true}
                  onClick={(e) => 
                    {
                        e.stopPropagation();
                        handleSuggestionClick(suggestion)
                    }}
                >
                  {suggestion}
                </AutoSuggestItem>
              ))}
            </AutoSuggestList>
          </AutoSuggestContainer>
        )}
      </InputWithSuggestions>
    </InnerRowDiv>
    </RowDiv>
    {categoriesSearch.length > 0 && 
    (
      <PillsRow isMobile={isMobile}>
        <PillsFilter />
      </PillsRow>
    )}
  </SearchBarContainer>
);
};

export default observer(SearchBar);
