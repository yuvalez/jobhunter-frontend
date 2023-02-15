import React, { useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import styled, { css } from 'styled-components';
import { size as deviceSize } from '../constants';
import ColorStore from '../stores/ColorStore';

const ModalBody = styled.div`
    background-color: ${({ palette }) => palette.modal.background};
    position: fixed;
    height: auto;
    width: 60%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 501;
    border-radius: 2rem;
    box-shadow: 0px 0px 10px ${({ palette }) => palette.modal.shadow};
`;

const ModalBodyMobile = styled.div`
    background-color: ${({ palette }) => palette.modal.background};
    position: fixed;
    height: auto;
    width: 90%;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    z-index: 501;
    border-radius: 2rem;
    box-shadow: 0px 0px 10px ${({ palette }) => palette.modal.shadow};
`;

const Table = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
`;

const DataRow = styled.div`
    display: flex;
    direction: rtl;
    gap: 1rem;
    color: ${({ palette }) => palette.modal.text};
`;

const DataCell = styled.div`
    display: flex;
    justify-content: right;
    font-size: 1.2em;
    ${({ header }) => header && 'font-weight: bold;'}
`;

const DataLink = styled.a`
    display: flex;
    justify-content: right;
    font-size: 1.2em;
    text-decoration: underline;
    color: inherit;
    text-overflow: clip;
    overflow:hidden;
    white-space:nowrap;
`;

const IconCSS = css`
    height: 3.5rem;
    width: 3.5rem;
    &:hover {
        cursor: pointer;
    }
`;

const ApproveIcon = styled(FaCheckCircle)`
    ${IconCSS}
`;
const DisapproveIcon = styled(FaTimesCircle)`
    ${IconCSS}
`;

const ExitButton = styled(AiOutlineClose)`
    position: absolute;
    left: 1.5rem;
    top: 1.5rem;
    height: 2rem;
    width: 2rem;
    color: ${({ palette }) => palette.modal.exitButton};
    transition: transform 0.25s ease-in-out;
    &:hover {
        cursor: pointer;
        transform: scale(1.1) rotate(180deg);
        
    }
`;

const IconsRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 5rem;
`;

const Modal = ({ group, closeFunction, approveFunction, disapproveFunction }) => {
    const data = [
        {header: "שם קבוצה", value: group.group_name, component: DataCell, props:{}},
        {header: "קישור", value: group.group_link, component: DataLink, props: {href: group.group_link, target:"_blank"}},
        {header: "קטגוריה", value: group.category, component: DataCell, props:{}},
        {header: "איזור", value: group.area, component: DataCell, props:{}},
        {header: "תיאור", value: group.description, component: DataCell, props:{}},
    ]

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
    const ModalWrapper = isMobile ? ModalBodyMobile : ModalBody;
    
    const colorStore = useContext(ColorStore);
    const { colorPalette } = colorStore;

    return (
        <ModalWrapper onBlur={closeFunction} palette={colorPalette}>
            <ExitButton palette={colorPalette} onClick={closeFunction}/>
            <Table>
                { data.map(cell => (
                <DataRow palette={colorPalette}>
                    <DataCell header>
                        {cell.header}:
                    </DataCell>
                    {React.createElement(cell.component, cell.props, [cell.value])}
                </DataRow>
                ))
                }

                <IconsRow>
                    <ApproveIcon color="green" onClick={async (e) => {
                        await approveFunction(e, group);
                        closeFunction();
                    }}/>
                    <DisapproveIcon color="red" onClick={async (e) => {
                        await disapproveFunction(e, group);
                        closeFunction();
                    }}/>
                </IconsRow>
            </Table>
        </ModalWrapper>
    )
}

export default Modal;