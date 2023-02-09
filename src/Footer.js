import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import ColorStore from './stores/ColorStore';

const FooterDiv = styled.div`
    display: flex;
    // justify-content: center;
    padding: 1rem 20%;
    background-color: ${({ palette }) => palette.footer.background};
    color: ${({ palette }) => palette.footer.text};
`;

const Footer = () => {
  const colorStore = useContext(ColorStore);
  const { colorPalette } = colorStore;
  return (
    <FooterDiv palette={colorPalette}>
      <p>Copyright &copy; {new Date().getFullYear()} Yuval Ezuz</p>
    </FooterDiv>
  );
};

export default observer(Footer);