import React, { useContext, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import GroupsStore from '../stores/groupStore';
import styled from 'styled-components';
import { DEFAULT_PAGE_SIZE, device } from '../constants';
import PillsFilter from './pillsFilter';

const SearchBarContainer = styled.div`
  display: block;
  align-items: center;
  justify-content: center;
  width: 100%;
  @media ${device.tablet} {
    width: 50%;
  }   
  padding: 1rem;
  border-radius: 2rem;
  margin:2rem auto;
  margin-bottom: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.2rem 2rem;
  margin-left: 1rem;
  border: none;
  direction: rtl;
  border-radius: .75rem;
  box-shadow: 0px 0px 10px #ccc;
  font-size: 18px;
  outline:none;
  &::placeholder {
    color: #ccc;
  }
`;

const SearchButton = styled.button`
  background-color: #2C20AF;
  color: white;
  padding: .75rem 1.1rem;
  border: none;
  border-radius: .75rem;
  cursor: pointer;
  width: 6rem;
  font-size: 1em;
  margin-left:1rem;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #2C20DF;
    transform: scale(1.02);
  }
`;

const AutoSuggestContainer = styled.div`
  width: calc(100% - 7.5rem);
  background-color: #fff;
  opacity: ${params => params.showSuggestions ? '1' : '0'};
  height: ${params => params.showSuggestions ? 'inherit' : '0'};
  max-height: ${params => params.showSuggestions ? '500px' : '0'};
  box-shadow: 0px 0px 20px #ccc;
  border-radius: .75rem;
  z-index: 10;
  direction: rtl;
  margin: 1rem 0rem;
  padding: 1rem;
  transition: ${params => params.showSuggestions ? 'max-height .15s ease-in' : 'max-height .15s ease-out'};
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
  &:hover {
    background-color: #f2f2f2;
  }
`;

const RowDiv = styled.div`
  display: flex;
  justify-content: right;
  height: ${params => params.showSuggestions === false ? '0' : 'inherit'};
  max-height: ${params => params.showSuggestions === false ? '0' : '500px'};
`;

const SearchBar = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const suggestRef = useRef(null);
  const groupStore = useContext(GroupsStore);
  const { categorySuggestions: suggestions, textSearch, setTextSearch, resetGroupsAndSearch,
          addCategory, removeCategory, categoriesSearch } = groupStore;

  
  const handleSearch = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (suggestions.includes(textSearch) && !categoriesSearch.includes(textSearch)) {
        setShowSuggestions(false);
        addCategory(textSearch);
        resetGroupsAndSearch();
        setTextSearch('');
    }
  };

  const handleInputChange = (event) => {
    setTextSearch(event.target.value);
    console.log(textSearch);
    // filter suggestions based on input
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
  <SearchBarContainer>
    <RowDiv>
    <SearchButton onClick={handleSearch}>חפש</SearchButton>
    <SearchInput
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
    </RowDiv>
    <RowDiv showSuggestions={showSuggestions}>
    {textSearch && filteredSuggestions.length > 0 && (
      <AutoSuggestContainer showSuggestions={showSuggestions}>
        <AutoSuggestList ref={suggestRef}>
          {filteredSuggestions.map((suggestion) => (
            <AutoSuggestItem
              key={suggestion}
              showSuggestions={showSuggestions}
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
    </RowDiv>
    {/* TODO: Enter filtered here in pill boxes */}
    <PillsFilter />
  </SearchBarContainer>
);
};

export default observer(SearchBar);
