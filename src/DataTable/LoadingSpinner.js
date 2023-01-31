import React from 'react';
import { keyframes } from 'styled-components';
import styled from 'styled-components';


const Spinner = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const SpinnerAnimation = keyframes`
    0% {
        transform: scale(1);
        background-color: rgb(111, 163, 240);
    }
    20% {
        transform: scale(1);
    }
    40% {
        transform: scale(1.1);
        background-color: rgb(111, 200, 240);
    }
    80% {
        transform: scale(1);
    }
    100% {
        transform: scale(1);
        background-color: rgb(111, 163, 240);
    }
`;

const SpinnerDot = styled.div`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    margin: 0.75rem;
    animation: ${SpinnerAnimation}  1200ms cubic-bezier(0.445, 0.05, 0.55, 0.95) ${props => props.idx * 200}ms infinite;
`;

const LoadingSpinner = ({ dotCount = 3 }) => {
    const dots = [];
    for (let idx=0; idx < dotCount; idx++) {
        dots.push(
            <SpinnerDot idx={idx}/>
        )
    }
    return (
        <Spinner>
            {dots}
        </Spinner>
    );

}

export default LoadingSpinner;