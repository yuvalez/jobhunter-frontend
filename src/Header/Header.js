import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ColorStore from '../stores/ColorStore';
import DarkModeToggle from './DarkModeToggle';
import { size as deviceSize } from '../constants';
import websiteLogo from '../images/logo192.png';

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
    margin: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
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

const Logo = styled.img`
    width: 3rem;
    height: 3rem;
    margin: 0 0.5rem;
`;

const Header = () => {
    const colorStore = useContext(ColorStore);
    const { colorPalette } = colorStore;
    const [width, setWidth] = useState(window.innerWidth);

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

    return (
        <NavBar palette={colorPalette}>
            <SiteName to="/">
                <Logo src={websiteLogo} />
                {!isMobile && <span style={{ fontSize: '1em', fontWeight: 'bold', fontFamily: '"Lucida Console", "Courier New"' }}>Hunt for Avoda</span>}
                
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