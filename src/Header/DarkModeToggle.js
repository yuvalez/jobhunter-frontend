import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { IoIosMoon, IoIosSunny } from 'react-icons/io';
import styled, { keyframes } from 'styled-components';
import ColorStore from '../stores/ColorStore';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  & svg {
    width: 2em;
    height: 2em;
    fill: #333;
    transition: all 0.3s ease;
    animation: ${rotate} 0.75s ease forwards;
  }
`;

const DarkModeToggle = () => {
  const colorStore = useContext(ColorStore);
  const { toggleDarkMode, isDarkMode } = colorStore;

  return (
    <Button onClick={toggleDarkMode}>
      {isDarkMode ? <IoIosMoon /> : <IoIosSunny />}
    </Button>
  );
};

export default observer(DarkModeToggle);