import React from 'react';
import { observer } from "mobx-react";
import styled from 'styled-components';

const NavBar = styled.nav`
    background-color: #dfdfdf;
    color: blue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 0;
    z-index: 99;
`;


const SiteName = styled.a`
    color: inherit;
    text-decoration: none;
    padding: 1rem;
    margin: 1rem;
    font-size: 1.5em;
`;
const OptionsGroup = styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    gap: 1rem;
`;

const OptionsGroupItem = styled.li`
    display: flex;
    flex-direction: row;
    direction: rtl;
`;

const Link = styled.a`
    color: inherit;
    text-decoration: none;
    height: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    padding: 0 .25rem;
`;


const Header = () => {
    
    return (
        <NavBar>
            <SiteName>
                Hunt for Avoda
            </SiteName>
            {/* TODO: add hamburger on mobile */}
            <OptionsGroup>
                <OptionsGroupItem>
                    <Link>קצת עלינו</Link>
                </OptionsGroupItem>
            </OptionsGroup>
        </NavBar>
    );

}

export default observer(Header);