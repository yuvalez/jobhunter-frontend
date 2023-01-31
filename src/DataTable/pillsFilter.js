import React, { useContext } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { FaTimesCircle } from 'react-icons/fa'
import GroupsStore from '../stores/groupStore';


const Wrapper = styled.div`
    display: flex;
    justify-content: right;
    margin-top: 2rem;
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
    border: 2px solid #2470FF;
    border-radius: 4px;
    color: #2470FF;
    background-color: #2470FF13;
    font-size: 1em;
`;

const PillText = styled.p`
    padding-right: 0.75em;
    padding-left: 1.5em;
    display: flex;
    justify-content: center;
`;

const PillClose = styled.button`
    color: #2470FF;
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
    const { categoriesSearch, removeCategory, resetGroupsAndSearch } = groupStore;
    return (
        <Wrapper>
            {
                categoriesSearch.map(category => (
                    <Pill>
                        <PillContent>
                            <PillText>{category}</PillText>
                            <PillClose 
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