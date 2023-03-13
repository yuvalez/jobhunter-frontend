import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import ColorStore from './stores/ColorStore';
import { size as deviceSize } from './constants';

const Container = styled.div`
  padding: 4rem;
  text-align: center;
  background-color: ${({ palette }) => palette.about.background};
  border-radius: 0.9rem;
  box-shadow: 0 0 10px ${({ palette }) => palette.about.shadow};
  margin: 4rem auto;
  width: ${({ isMobile }) => isMobile ? '90%': '50%'};
`;

const Heading = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  font-weight: bold;
  color: ${({ palette }) => palette.about.headerText};
  text-shadow: 1px 1px 2px ${({ palette }) => palette.about.headerTextShadow};
`;

const Paragraph = styled.p`
  direction: rtl;
  font-size: 1.6rem;
  margin-bottom: 2rem;
  line-height: 1.5;
  color: ${({ palette }) => palette.about.text};
`;

const AboutUs = () => {

    const colorStore = useContext(ColorStore);
    const { colorPalette } = colorStore;

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

    return (
        <Container palette={colorPalette} isMobile={isMobile}>
            <Heading palette={colorPalette}>מי אנחנו</Heading>
            <Paragraph palette={colorPalette}>
            יוזמת ההתנדבות שלנו שמה מטרה לחבר מחפשי.ות עבודה עם קבוצות בוואטסאפ, פייסבוק, טלגרם ולינקדאין. אנו מבינים.ות את האתגרים הנלווים לחיפוש תעסוקה, ומאמינים כי על ידי קירוב אנשים ושיתוף משאבים, נוכל להפוך את התהליך לקל ומוצלח יותר. המטרה שלנו היא ליצור קהילה תומכת שמעצימה אנשים למצוא את העבודות שהם.ן רוצים.ות ולבנות את הקריירה שמגיעה להם.ן.
            </Paragraph>
            <Paragraph palette={colorPalette}>
            תודה לחבריי הטובים שעזרו להנגיש את המידע ולהקים את האתר :)
            <br />
            בהצלחה לכולנו!
            <br />
            שלכם,
            <br />
            ענבל למל
            </Paragraph>
            
        </Container>
    )
};

export default observer(AboutUs);
