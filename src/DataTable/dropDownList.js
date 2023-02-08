import React, { useState } from 'react';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  width: ${({ isMobile }) => isMobile ? '100%': '50%'};
  align-self: center;
`;

const DropdownButton = styled.button`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #FFF;
  width: 100%;
  color: #333;
  box-shadow: 0px 0px 10px #ccc;
  border: none;
  border-bottom: ${({ show }) => (show ? '1px solid #999' : 'none')};
  border-radius: ${({ show }) => (show ? '.75rem .75rem 0 0' : '.75rem')};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  direction: rtl;
`;

const DropCownChoice = styled.span`

`;

const Arrow = styled.span`
  border-style: solid;
  border-width: 0.15rem 0.15rem 0 0;
  display: inline-block;
  height: 0.45rem;
  width: 0.45rem;
  margin-right: 1.5rem;
  transform: ${({ show }) => (show ? 'rotate(135deg)' : 'rotate(225deg)')};
  transition: transform 0.3s ease-in-out;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  color: #333;
  list-style: none;
  padding: 0;
  direction: rtl;
  margin: 0;
  display: ${({ show }) => (show ? 'block' : 'none')};
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.li`
  position: relative;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  z-index: 100;
  cursor: pointer;  
  direction: rtl;
  background-color: #FFF;
  border-radius: ${({ last }) => last ? '0 0 5px 5px' : '0'};
  &:hover {
    background-color: #EEE;
  }
`;

const DropDownList = ({ options, setText, text, isMobile, defaultOption='', defaultOptionAction = () => {} }) => {
  const [showList, setShowList] = useState(false);
  const toggleList = () => {
    setShowList(!showList);
  };

  return (
    <DropdownContainer isMobile={isMobile}>
      <DropdownButton show={showList} onClick={toggleList}>
        <DropCownChoice>{text || defaultOption}</DropCownChoice>
        <Arrow show={showList} />
      </DropdownButton>
      <DropdownList show={showList}>
        {defaultOption && (
            <DropdownItem
            onClick={e => {
                defaultOptionAction(e);
                setShowList(false);
            }}>{defaultOption}</DropdownItem>
        )
        }
        {options.map((option, idx) => (
            <DropdownItem last={idx === options.length - 1} 
                        onClick={e => {
                            e.stopPropagation();
                            setText(option);
                            setShowList(false);
                        }}>{option}</DropdownItem>
        ))}
      </DropdownList>
    </DropdownContainer>
  );
};

export default DropDownList;
