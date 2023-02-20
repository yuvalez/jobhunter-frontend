import React, { useContext, useRef, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import GroupsStore from '../stores/GroupStore';
import styled from 'styled-components';
import { size as deviceSize } from '../constants';
import PillsFilter from './pillsFilter';
import DropDownList from './dropDownList';
import ColorStore from '../stores/ColorStore';
import AutoSuggestInput from './AutoSuggestInput';

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


const InnerRowDiv = styled.div`
  display: flex;
  width: ${({ isMobile }) => isMobile ? '100%': '50%'};
  flex-direction: ${({ isMobile }) => isMobile ? 'column': 'row'};
  row-gap: .5rem;
  column-gap: .5rem;
  margin: 0 1rem;
`;

const SearchBar = () => {
  
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

  
  const suggestionsWithoutAlreadyChosen = suggestions.filter(el => categoriesSearch.indexOf(el) < 0);

  const handleSearch = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (suggestions.includes(textSearch) && !categoriesSearch.includes(textSearch)) {
        addCategory(textSearch);
        setTextSearch('');
    }
    resetGroupsAndSearch();
  };

  const handleInputChange = (event) => {
    setTextSearch(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    addCategory(suggestion);
    resetGroupsAndSearch();
    setTextSearch('');
};

return (
  <SearchBarContainer isMobile={isMobile}>
    <RowDiv>
    <SearchButton onClick={handleSearch} palette={colorPalette}>חפש</SearchButton>
    <InnerRowDiv isMobile={isMobile}>
      <DropDownList options={areaSuggestions} setText={setFilteredArea} text={area} defaultOption="כל האזורים"
                    defaultOptionAction={e => {
                      e.stopPropagation();
                      setFilteredArea("");
                    }}
                    colorPalette={colorPalette.search.areaDropDown}
      />
      <AutoSuggestInput inputPlaceholder="הקלד קטגוריה..." colorPalette={colorPalette.search} handleSuggestionClick={handleSuggestionClick} 
                        handleInputChange={handleInputChange} suggestions={suggestionsWithoutAlreadyChosen} textSearch={textSearch} />
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
