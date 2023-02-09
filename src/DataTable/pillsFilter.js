import React, { useContext } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { FaTimesCircle } from 'react-icons/fa'
import GroupsStore from '../stores/GroupStore';
import ColorStore from '../stores/ColorStore';


const Wrapper = styled.div`
    display: inline-block;
    direction: rtl;
    margin-top: 1rem;
`;

const Pill = styled.div`
    background-color: transparent;
    border-radius: 5rem;
    display: inline-block;
    padding: 0.35rem 0.75rem;
`;

const PillContent = styled.div`
    display: flex;
    font-weight: bold;
    height: 1.8rem;
    border: 2px solid ${({ palette }) => palette.search.pills.borderColor};
    border-radius: 4px;
    background-color: ${({ palette }) => palette.search.pills.backgroundColor};
    font-size: 1em;
`;

const PillText = styled.p`
    padding-right: 0.75em;
    padding-left: 1.5em;
    display: flex;
    justify-content: center;
    color: ${({ palette }) => palette.search.pills.color};
`;

const PillClose = styled.button`
    color: ${({ palette }) => palette.search.pills.closeColor};
    height: 1.5em;
    width: 1.5em;
    background-color: transparent;
    text-align: center;
    border: none;
    outline: none;
    position: relative;
    cursor: pointer;
    font-size: 1rem;
    margin: 0;
    padding: 0;
    margin-right: 0.2rem;
`;

const CloseIcon = styled(FaTimesCircle)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const PillsFilter = () => {

    const groupStore = useContext(GroupsStore);
    const colorStore = useContext(ColorStore);
    const { categoriesSearch, removeCategory, resetGroupsAndSearch } = groupStore;
    const { colorPalette } = colorStore;
    return (
        <Wrapper>
            {
                categoriesSearch.map(category => (
                    <Pill>
                        <PillContent palette={colorPalette}>
                            <PillText palette={colorPalette}>{category}</PillText>
                            <PillClose
                                palette={colorPalette} 
                                onClick = {() => {
                                    removeCategory(category);
                                    resetGroupsAndSearch();
                                }}>
                                    <CloseIcon />
                            </PillClose>
                        </PillContent>
                    </Pill>
                ))
            }
        </Wrapper>
    );
}

export default observer(PillsFilter);