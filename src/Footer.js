import React from 'react';
import styled from 'styled-components';

const FooterDiv = styled.div`
    padding: 1rem;
    background-color: #dfdfdf;

`;

const Footer = () => {
  return (
    <FooterDiv>
      <p>Copyright &copy; {new Date().getFullYear()} My Website</p>
    </FooterDiv>
  );
};

export default Footer;