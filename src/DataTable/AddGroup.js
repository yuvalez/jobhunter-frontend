import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { BsFillPlusSquareFill } from 'react-icons/bs';

import ColorStore from "../stores/ColorStore";
import { size as deviceSize } from '../constants';
import Tooltip from "../Utils/Tooltip";
import NewGroupModal from "./NewGroupModal";


const ButtonWrapper = styled.div`
    position: fixed;
    bottom: ${({ isMobile }) => isMobile ? '1rem' : '2rem'} ;
    right: ${({ isMobile }) => isMobile ? '1rem' : '3rem'} ;

`;

const Button = styled(BsFillPlusSquareFill)`

    color: ${({ palette }) => palette.search.addGroupButton};
    border: 0;
    direction: rtl;
    width: 4rem;
    height: 4rem;
    transition: transform 0.2s ease-in-out;
    &:hover {
        cursor: pointer;
        transform: scale(1.1);
    }
`;

const AddGroupButton = () => {

    const [ismodalOpen, setOpen] = useState(false);

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

    useEffect(() => {
        ismodalOpen && (document.body.style.overflow = 'hidden');
        ismodalOpen && (document.body.style.pointerEvents = 'none');
        !ismodalOpen && (document.body.style.overflow = 'unset');
        !ismodalOpen && (document.body.style.pointerEvents = 'unset');
        
     }, [ismodalOpen ]);
  
    const isMobile = width <= deviceSize.tablet;
    const colorStore = useContext(ColorStore);
    const { colorPalette } = colorStore;
    return (
        <>
        <ButtonWrapper isMobile={isMobile}>
            <Tooltip text="הוספת קבוצה" palette={colorPalette.search.addGroupButtonTooltip}>
            <Button palette={colorPalette} onClick={e => {
                e.stopPropagation();
                setOpen(true);
            }}/>
            </Tooltip>
        </ButtonWrapper>
        {ismodalOpen && <NewGroupModal closeFunction={() => setOpen(false)} />}
        </>
    )}

export default AddGroupButton