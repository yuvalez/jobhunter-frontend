import React, { useContext, useEffect, useCallback, useState  } from 'react';
import { observer } from "mobx-react";
import styled, { css, keyframes } from 'styled-components'
import { FaWhatsapp, FaLinkedin, FaTelegram, FaFacebookSquare, FaTrash, FaEdit } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import { BASE_URL, DEFAULT_PAGE_SIZE, device } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import GroupsStore from '../stores/GroupStore';
import SearchBar from './searchBar';
import ColorStore from '../stores/ColorStore';
import AddGroupButton from './AddGroup';
import AuthStore from '../stores/AuthStore';
import NewGroupModal from './NewGroupModal';

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

const GroupCard = styled.a`
    opacity: 0;
    animation: ${poof} .5s forwards;
    animation-delay: ${props => (props.idx % DEFAULT_PAGE_SIZE) * 0.07}s;
    transition: all .3s ease;
    border: 1px solid ${({ palette }) => palette.table.cardBorder};
    box-shadow: ${({ palette }) => palette.table.cardBoxShadow};
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
        box-shadow: ${({ palette }) => palette.table.cardBoxShadowHover};
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
    justify-content: space-between;
    align-items: center;
`;

const GroupAreaFooter = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
`;

const GroupFooterActions = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 1rem;
`;

const popAnimation = keyframes`
    0% {
        transform: scale(1);
    }
    40% {
        transform: scale(1.2);
    }
    60% {
        transform: scale(1.2) rotate(10deg);
    }
    80% {
        transform: scale(1.2) rotate(-10deg);
    }
    90% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }

`;

const FaTrashCustom = styled(FaTrash)`
    color: #EF1232;
    &:hover {
        pointer: cursor;
        animation: ${popAnimation} 1s ease-out;
    }

`;

const FaEditCustom = styled(FaEdit)`
    color: #b3b3b3;
    &:hover {
        pointer: cursor;
        animation: ${popAnimation} 0.7s ease-out;
    }
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

const GroupCardDelete = styled(FaTrash)`
    direction: rtl;
    color: ${({ palette }) => palette.table.cardCategoryText}
`;

const GroupList = () => {

    const scrollRef = React.useRef(null);
    const groupStore = useContext(GroupsStore);
    const colorStore = useContext(ColorStore);
    const authStore = useContext(AuthStore);
    
    const { getTokenValue } = authStore;
    const { colorPalette } = colorStore;
    const { groups, loadingState, deleteGroup, resetGroupsAndSearch } = groupStore;
    const token = getTokenValue();

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editContext, setEditContext] = useState(null);

    const submitAction = async (name, link, area, category) => {
        const response = await fetch(`${BASE_URL}/api/pending_groups/add/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ group_name: name, 
                                   group_link: link,
                                   area: area,
                                   category: category,
                                   description: '' }),
          });
          const res = await response.json();
          if (response.ok && res && res.success) {
            setEditModalOpen(false);
          } else {
            throw("failed response");
          }
    }

    const updateAction = async (name, link, area, category) => {
        const response = await fetch(`${BASE_URL}/api/update_group/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ group_name: name, 
                                   group_link: link,
                                   area: area,
                                   category: category,
                                   group_id: editContext.group_id,
                                   token
                                 }),
          });
          const res = await response.json();
          if (response.ok && res && res.success) {
              setEditModalOpen(false);
              await resetGroupsAndSearch();
          } else {
            throw("failed response");
          }
    }

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
                                <GroupAreaFooter>
                                    <GoLocation color={colorPalette.table.cardAreaText}/>
                                    <GroupCardArea palette={colorPalette}>{group.area}</GroupCardArea>
                                </GroupAreaFooter>
                                {token && (
                                    <GroupFooterActions>
                                        <FaEditCustom onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setEditModalOpen(true);
                                            setEditContext(group);
                                        }}/>
                                        <FaTrashCustom onClick={async (e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                await deleteGroup(group.group_id, token)}
                                            }
                                        />
                                    </GroupFooterActions>
                                )}
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
        <AddGroupButton submitAction={submitAction}/>
        {isEditModalOpen && <NewGroupModal closeFunction={() => {
            setEditModalOpen(false);
            setEditContext(null);
            }} 
            defaultState= {{
                            name: editContext.group_name,
                            link: editContext.group_link,
                            category: editContext.category,
                            area: editContext.area,
                        }} 
            submitAction={updateAction}
        />}
        </PageWrapper>
    )
}

export default observer(GroupList);