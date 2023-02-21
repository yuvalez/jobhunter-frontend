import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import styled from "styled-components";


const AutoSuggestContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 100%;
  background-color: ${({ palette }) => palette.background};
  opacity: ${params => params.showSuggestions ? '1' : '0'};
  height: ${params => params.showSuggestions ? 'inherit' : '0'};
  max-height: ${params => params.showSuggestions ? '500px' : '0'};
  box-shadow: 0px 0px 4px ${({ palette }) => palette.listBoxShadow};
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
  color: ${({ palette }) => palette.inputText};
  font-size: ${({ customStyle }) => (customStyle && customStyle.fontSize) || '1.2rem'};
  background-color: ${({ palette }) => palette.background};
  &:hover {
    background-color: ${({ palette }) => palette.itemBackgroundHover};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  direction: rtl;
  border-radius: .75rem;
  -webkit-appearance: none;
  color: ${({ palette }) => palette.inputText};
  background-color: ${({ palette }) => palette.inputBackground};
  ${({ palette, addShadow }) => addShadow && `box-shadow: 0px 0px 10px ${palette.inputBoxShadow};`}
  font-size: ${({ customStyle }) => (customStyle && customStyle.fontSize) || '1.2rem'};
  outline:none;
  &::placeholder {
    color: ${({ palette }) => palette.inputPlaceholder};
  }
`;


const InputWithSuggestions = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  direction: rtl;
`;

const AutoSuggestInput = ({ suggestions, textSearch, colorPalette, inputPlaceholder = "", handleSuggestionClick = () => {}, handleInputChange = () => {},
                            addShadow = true, customStyle = {} }) => {

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const suggestRef = useRef(null);

  return(
    <InputWithSuggestions>
        <SearchInput
          customStyle={customStyle}
          palette={colorPalette}
          type="text"
          placeholder={inputPlaceholder}
          value={textSearch}
          addShadow={addShadow}
          onChange={(e) => {
            e.stopPropagation();
            handleInputChange(e);
            const filtered = suggestions.filter((suggestion) =>
              suggestion.toLowerCase().startsWith(e.target.value.toLowerCase())
            );
            setFilteredSuggestions(filtered.slice(0, 5));
            setShowSuggestions(true);
          }}
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
          <AutoSuggestContainer showSuggestions={showSuggestions} palette={colorPalette.autoSuggest}>
              <AutoSuggestList ref={suggestRef}>
                {filteredSuggestions.map((suggestion) => (
                  <AutoSuggestItem
                    customStyle={customStyle}
                    palette={colorPalette.autoSuggest}
                    key={suggestion}
                    showSuggestions={showSuggestions}
                    onClick={(e) => 
                      {
                          e.stopPropagation();
                          handleSuggestionClick(suggestion)
                          setShowSuggestions(false);
                      }}
                  >
                    {suggestion}
                  </AutoSuggestItem>
                ))}
              </AutoSuggestList>
            </AutoSuggestContainer>
        )}
    </InputWithSuggestions>
  )
}


export default observer(AutoSuggestInput);