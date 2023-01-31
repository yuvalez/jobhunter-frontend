import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import GroupsStore from '../stores/groupStore';

const FilterRow = () => {

    const groupStore = useContext(GroupsStore);

    return (
        <div />
    );
}


export default observer(FilterRow);