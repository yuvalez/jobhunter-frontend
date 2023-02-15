import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import ColorStore from '../stores/ColorStore';
import { BASE_URL, size as deviceSize } from '../constants';
import PendingGroupStore from '../stores/PendingGroupStore';
import Modal from './Modal';
import PendingGroupsTableDesktop from './PendingGroupsTableDesktop';
import PendingGroupsTableMobile from './PendingGroupsTableMobile';
import AuthStore from '../stores/AuthStore';



const PendingGroupsTable = () => {

    const authStore = useContext(AuthStore);

    const { fetchToken } = authStore;

    const pendingGroupsResponse = async (isApproved, groupId) => {
        const token = fetchToken;
        const response = await fetch(`${BASE_URL}/api/pending_groups/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, approve: isApproved, group_id: groupId }),
      });
    }

    const clickOnApprove = async (e, row) => {
        e.stopPropagation();
        await pendingGroupsResponse(true, row.group_id);
        removeGroup(row.group_id);
    }

    const clickOnDisapprove = async (e, row) => {
        e.stopPropagation();
        await pendingGroupsResponse(false, row.group_id);
        removeGroup(row.group_id);
    }

    const pendingGroupStore = useContext(PendingGroupStore);
    const colorStore = useContext(ColorStore);
    const { colorPalette } = colorStore;
    const { groups, getPendingGroups, removeGroup } = pendingGroupStore;

    const [isOpen, setOpen] = useState(false);
    const [rowInfo, setRowInfo] = useState({});

    useEffect(() => {
        getPendingGroups(fetchToken);
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const [width, setWidth] = useState(window.innerWidth);

    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }
  
    const isMobile = width <= deviceSize.tablet;

    return (
        <>
            { !isMobile ? 
                (<PendingGroupsTableDesktop groups={groups} setOpen={setOpen} setRowInfo={setRowInfo} colorPalette={colorPalette} clickOnApprove={clickOnApprove} clickOnDisapprove={clickOnDisapprove} isOpen={isOpen} />) :
                (<PendingGroupsTableMobile groups={groups} setOpen={setOpen} setRowInfo={setRowInfo} colorPalette={colorPalette} isOpen={isOpen} />)
            }
        { isOpen && <Modal group={rowInfo} 
                           closeFunction={() => {
                            setOpen(false);
                            setRowInfo({});
                           }}
                           approveFunction={clickOnApprove}
                           disapproveFunction ={clickOnDisapprove}
        /> }
        </>
    )

}

export default observer(PendingGroupsTable);