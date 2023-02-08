import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ColorStore from '../stores/ColorStore';
import DarkModeToggle from './DarkModeToggle';

const NavBar = styled.nav`
    background-color: ${({ palette }) => palette.header.background};
    color: ${({ palette }) => palette.header.textColor};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 0;
    z-index: 99;
`;


const SiteName = styled(Link)`
    color: inherit;
    text-decoration: none;
    padding: 1rem;
    margin: 1rem;
    font-size: 1.5em;
`;
const OptionsGroup = styled.ul`
    padding: 0;
    margin: 0;
    margin-right: 1rem;
    list-style: none;
    display: flex;
    gap: 1rem;
`;

const OptionsGroupItem = styled.li`
    display: flex;
    flex-direction: row;
    direction: rtl;
`;

const CustomLink = styled(Link)`
    color: inherit;
    text-decoration: none;
    height: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    padding: 0 .25rem;
`;


const Header = () => {
    const colorStore = useContext(ColorStore);
    const { colorPalette } = colorStore;
    return (
        <NavBar palette={colorPalette}>
            <SiteName to="/">
                Hunt for Avoda
            </SiteName>
            {/* TODO: add hamburger on mobile */}
            <OptionsGroup>
                <OptionsGroupItem>
                    <CustomLink to='/about'>מי אנחנו</CustomLink>
                </OptionsGroupItem>
                <OptionsGroupItem>
                    <DarkModeToggle />
                </OptionsGroupItem>
                
            </OptionsGroup>
        </NavBar>
    );

}

export default observer(Header);