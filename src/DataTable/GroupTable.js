import React, { useContext, useEffect, useCallback  } from 'react';
import { observer } from "mobx-react";
import styled, { keyframes } from 'styled-components'
import { FaWhatsapp, FaLinkedin, FaTelegram, FaFacebookSquare } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import { DEFAULT_PAGE_SIZE, device } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import GroupsStore from '../stores/groupStore';
import SearchBar from './searchBar';

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
        width: 50%;
    }
`;

const PageWrapper = styled.div`
    display: block;
`;

const GroupCard = styled.a`
    opacity: 0;
    animation: ${poof} .5s forwards;
    animation-delay: ${props => (props.idx % DEFAULT_PAGE_SIZE) * 0.07}s;
    transition: all .3s ease;
    border: 1px solid #eee;
    box-shadow: 0 13px 27px -5px hsla(240, 30.1%, 28%, 0.25), 0 8px 16px -8px hsla(0, 0%, 0%, 0.3), 0 -6px 16px -6px hsla(0, 0%, 0%, 0.03);;
    border-radius: 0.6em;
    color: inherit;
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
        box-shadow: 0 13px 40px -5px hsla(240, 30.1%, 28%, 0.12), 0 8px 32px -8px hsla(0, 0%, 0%, 0.14), 0 -6px 32px -6px hsla(0, 0%, 0%, 0.02);
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
`;

const GroupCardName = styled.h2`
    direction: rtl;
    text-align: center;
`;

const GroupCardCategory = styled.h3`
    direction: rtl;
    color: #14141455;
`;

const GroupList = () => {

    const scrollRef = React.useRef(null);
    const groupStore = useContext(GroupsStore);

    const { groups, loadingState } = groupStore;

    const loadMoreItems = useCallback(() => {
        const { getDataFromApi, groups, listEnd } = groupStore;

        if(loadingState || listEnd){
                return;
        }
        
        setTimeout(() => {
            getDataFromApi(DEFAULT_PAGE_SIZE);
        }, 1000);
        
    }, [groupStore, loadingState]);

    const handleScrollEvent = useCallback(() => {
        if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 20) {
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
        <PageWrapper>
            <SearchBar />
        <TableWrapper ref={scrollRef}>
            {
            
                (
                    groups.map((group, idx) =>
                        <GroupCard idx={idx} key={group.group_link}>
                            <GroupCardHeader>
                                <GroupCardCategory>
                                    {group.category}
                                </GroupCardCategory>
                                {getGroupIcon(group.group_link)}
                            </GroupCardHeader>
                            <GroupCardName>
                                {group.group_name}
                            </GroupCardName>
                            <GroupCardFooter>
                            <GoLocation />
                            <GroupCardArea>{group.area || 'כללי'}</GroupCardArea>
                            </GroupCardFooter>
                        </GroupCard>
                    )  
                )
            }       
        
        </TableWrapper>
            {
                loadingState && 
                <LoadingSpinner /> 
            }
        </PageWrapper>
    )
}

export default observer(GroupList);