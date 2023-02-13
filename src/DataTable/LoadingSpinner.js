import React, { useContext } from 'react';
import { keyframes } from 'styled-components';
import styled from 'styled-components';
import ColorStore from '../stores/ColorStore';


const Spinner = styled.div`
    ${({ customStyle }) => customStyle}
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const SpinnerAnimation = (bgColor0, bgColor40, bgColor100) => keyframes`
    0% {
        transform: scale(1);
        background-color: ${bgColor0};
    }
    20% {
        transform: scale(1);
    }
    40% {
        transform: scale(1.1);
        background-color: ${bgColor40};
    }
    80% {
        transform: scale(1);
    }
    100% {
        transform: scale(1);
        background-color: ${bgColor100};
    }
`;

const SpinnerDot = styled.div`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    margin: 0.75rem;
    animation: ${props => SpinnerAnimation(props.palette.search.loadingDots_0, 
                                           props.palette.search.loadingDots_40, 
                                           props.palette.search.loadingDots_100)} 1200ms cubic-bezier(0.445, 0.05, 0.55, 0.95) ${props => props.idx * 200}ms infinite;
`;

const LoadingSpinner = ({ dotCount = 3, customStyle='' }) => {
    const dots = [];
    const colorStore = useContext(ColorStore);
    const { colorPalette } = colorStore;

    for (let idx=0; idx < dotCount; idx++) {
        dots.push(
            <SpinnerDot key={`dot_${idx}`} idx={idx} palette={colorPalette}/>
        )
    }
    return (
        <Spinner customStyle={customStyle}>
            {dots}
        </Spinner>
    );

}

export default LoadingSpinner;