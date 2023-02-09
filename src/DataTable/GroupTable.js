import React, { useContext, useEffect, useCallback  } from 'react';
import { observer } from "mobx-react";
import styled, { css, keyframes } from 'styled-components'
import { FaWhatsapp, FaLinkedin, FaTelegram, FaFacebookSquare } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import { DEFAULT_PAGE_SIZE, device } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import GroupsStore from '../stores/GroupStore';
import SearchBar from './searchBar';
import ColorStore from '../stores/ColorStore';

const poof = keyframes`
    0% {
        opacity: 0;
        transform: translateY(-5px);
    }
    100% {
        opacity: 1;
        transform: translateY(0px);
    }
`;

const SpinnerSpanStyle = css`
    grid-column: 1 / -1;
`;

const TableWrapper = styled.div`
    width: 80%;
    margin: 0 auto;
    display: grid;
    column-gap: 1rem;
    row-gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: minmax(min-content, max-content);
    place-items: center;
    direction: rtl;
    padding-bottom: 5rem;
    @media ${device.laptopL} {
        grid-template-columns: 1fr 1fr 1fr;
        width: 60%;
    }
`;

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${({ palette }) => palette.body.background}
`;

// TODO: Box shadow dark mode
const GroupCard = styled.a`
    opacity: 0;
    animation: ${poof} .5s forwards;
    animation-delay: ${props => (props.idx % DEFAULT_PAGE_SIZE) * 0.07}s;
    transition: all .3s ease;
    border: 1px solid ${({ palette }) => palette.table.cardBorder};
    box-shadow: 0 0.813rem 1.688rem -0.313rem hsla(240, 30.1%, 28%, 0.25), 0 0.5rem 1rem -0.5rem hsla(0, 0%, 0%, 0.3), 0 -0.375rem 1rem -0.375rem hsla(0, 0%, 0%, 0.03);
    border-radius: 0.75em;
    background-color: ${({ palette }) => palette.table.cardBackground};
    text-decoration: inherit;
    height: 17rem;
    width: 17rem;
    padding: 1rem;
    margin: 1rem;
    transition: all ease 200ms;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &:hover {
        transform: scale(1.03);
        box-shadow: 0 0.813rem 2.5rem -0.313rem hsla(240, 30.1%, 28%, 0.12), 0 0.5rem 4rem -0.5rem hsla(0, 0%, 0%, 0.14), 0 -0.375rem 4rem -0.375rem hsla(0, 0%, 0%, 0.02);
        }
    }

`;

const GroupCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const GroupCardFooter = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
`;


const GroupCardArea = styled.p`
    direction: rtl;
    margin-right: .25rem;
    color: ${({ palette }) => palette.table.cardAreaText}
`;

const GroupCardName = styled.h2`
    direction: rtl;
    text-align: center;
    color: ${({ palette }) => palette.table.cardGroupNameText}
`;

const GroupCardCategory = styled.h3`
    direction: rtl;
    color: ${({ palette }) => palette.table.cardCategoryText}
`;

const GroupList = () => {

    const scrollRef = React.useRef(null);
    const groupStore = useContext(GroupsStore);
    const colorStore = useContext(ColorStore);
    
    const { colorPalette } = colorStore;
    const { groups, loadingState } = groupStore;

    const loadMoreItems = useCallback(() => {
        const { getDataFromApi, listEnd } = groupStore;

        if(loadingState || listEnd){
                return;
        }
        
        setTimeout(() => {
            getDataFromApi(DEFAULT_PAGE_SIZE);
        }, 1000);
        
    }, [groupStore, loadingState]);

    const handleScrollEvent = useCallback(() => {
        if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 10) {
            loadMoreItems();
        }
    }, [loadMoreItems]);

    useEffect(() => {
        document.addEventListener("scroll", handleScrollEvent);
        loadMoreItems();
        return () => {
            document.removeEventListener("scroll", handleScrollEvent);
        }
    }, []);

    const getGroupIcon = (groupLink) => {
        const iconStyle = {color: "white", fontSize: "1.5em"};
        if (groupLink.toLowerCase().includes('chat.whatsapp.com')) {
            return (<FaWhatsapp style={{...iconStyle, color: '#4FCE5D'}}/>);
        }
        if (groupLink.toLowerCase().includes('t.me')) {
            return (<FaTelegram style={{...iconStyle, color: '#229ED9'}}/>);
        }
        if (groupLink.toLowerCase().includes('lnkd.in') || groupLink.includes('linkedin.com')) {
            return (<FaLinkedin style={{...iconStyle, backgroundColor: '#0077B5'}}/>);
        }
        if (groupLink.toLowerCase().includes('facebook.com')) {
            return (<FaFacebookSquare style={{...iconStyle, color: '#4267B2'}}/>);
        }
    }

    return (
        <PageWrapper palette={colorPalette}>
            <SearchBar />
        <TableWrapper ref={scrollRef}>
            {
            
                (
                    groups.map((group, idx) =>
                        <GroupCard idx={idx} key={group.group_link} palette={colorPalette} href={group.group_link} target="_blank">
                            <GroupCardHeader>
                                <GroupCardCategory palette={colorPalette}>
                                    {group.category}
                                </GroupCardCategory>
                                {getGroupIcon(group.group_link)}
                            </GroupCardHeader>
                            <GroupCardName palette={colorPalette}>
                                {group.group_name}
                            </GroupCardName>
                            <GroupCardFooter>
                            <GoLocation color={colorPalette.table.cardAreaText}/>
                            <GroupCardArea palette={colorPalette}>{group.area}</GroupCardArea>
                            </GroupCardFooter>
                        </GroupCard>
                    )  
                )
            }       
            {
                loadingState && 
                <LoadingSpinner customStyle={SpinnerSpanStyle} /> 
            }
        </TableWrapper>
        </PageWrapper>
    )
}

export default observer(GroupList);