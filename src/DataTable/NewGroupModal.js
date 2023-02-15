import React, { useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import styled, { css } from 'styled-components';
import { BASE_URL, size as deviceSize } from '../constants';
import ColorStore from '../stores/ColorStore';

const ModalBody = styled.div`
    background-color: ${({ palette }) => palette.search.addGroupModal.background};
    position: fixed;
    height: 80%;
    width: 40%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 501;
    padding: 5rem;
    border-radius: 2rem;
    pointer-events: all;
    box-shadow: 0px 0px 10px ${({ palette }) => palette.search.addGroupModal.modalBoxShadow};
`;

const ModalBodyLaptop = styled.div`
    background-color: ${({ palette }) => palette.search.addGroupModal.background};
    position: fixed;
    height: 80%;
    width: 40%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 501;
    padding: 3rem;
    border-radius: 2rem;
    pointer-events: all;
    box-shadow: 0px 0px 10px ${({ palette }) => palette.search.addGroupModal.modalBoxShadow};
`;

const ModalBodyMobile = styled.div`
    background-color: ${({ palette }) => palette.search.addGroupModal.background};
    position: fixed;
    height: 60%;
    padding: 2rem;
    width: 90%;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    z-index: 501;
    pointer-events: all;
    border-radius: 2rem;
    box-shadow: 0px 0px 10px ${({ palette }) => palette.search.addGroupModal.modalBoxShadow};
`;

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  direction: rtl;
  gap: ${({ isMobile }) => isMobile ? '.25rem' : '1rem'};
`;

const Input = styled.input`
    display: flex;
    justify-content: center;
    direction: rtl;
    width: 100%;
    font-size: 1rem;
    padding: 0.5rem;
    border: 1px solid ${({ palette }) => palette.search.addGroupModal.inputBorder};
    border-radius: 0.5rem;
    text-overflow: clip;
    overflow:hidden;
    white-space:nowrap;
    font-family: Helvetica, Arial, sans-serif;
    ${({ isError }) => isError && 'border: 0.18rem solid #EF0000;'}
    &:focus {
        outline: none;
        ${({ isError, palette}) => {
            if (isError) {
                return ""
            }
            return (`box-shadow: 0 0 0 1px ${palette.search.addGroupModal.inputBoxShadow};`);
        }
    }
    &::placeholder {
        font-family: Helvetica, Arial, sans-serif;
      }
`;

const Textarea = styled.textarea`
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px solid ${({ palette }) => palette.search.addGroupModal.inputBorder};
  border-radius: 0.25rem;
  width: 100%;
  margin-bottom: 1rem;
  font-family: Helvetica, Arial, sans-serif;
  ${({ isError }) => isError && 'border: 0.18rem solid #EF0000;'}
  &::placeholder {
    font-family: Helvetica, Arial, sans-serif;
  }
  &:focus {
    outline: none;
    ${({ isError, palette}) => {
        if (isError) {
            return ""
        }
        return (`box-shadow: 0 0 0 1px ${palette.search.addGroupModal.inputBoxShadow};`);
    }
  }
`;

const Button = styled.button`
  font-size: 1.2rem;
  padding: 1rem 2rem;
  background-color: ${({ palette }) => palette.search.addGroupModal.button};
  color: ${({ palette }) => palette.search.addGroupModal.buttonText};
  border: none;
  border-radius: 0.45rem;
  display: flex;
  align-self: center;
  &:hover {
    cursor: pointer;
    background-color: ${({ palette }) => palette.search.addGroupModal.buttonHover};
  }
`;

const ExitButton = styled(AiOutlineClose)`
    position: absolute;
    left: 1.5rem;
    top: 1.5rem;
    height: 2rem;
    width: 2rem;
    color: ${({ palette }) => palette.search.addGroupModal.exitButton};
    transition: transform 0.25s ease-in-out;
    &:hover {
        cursor: pointer;
        transform: scale(1.1) rotate(180deg);
    }
`;

const InputRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;a
`;


const ErrorLine = styled.span`
    color: red;
    visibility: ${({ isError }) => isError ? 'visible' : 'hidden'};
    font-size: .9em;
    position: relative;
    top: 0;
`;

const RequiredInputDiv = styled.div`
    display: flex;
    gap: .5rem;
`;

const H1 = styled.h1`
    color: ${({ palette }) => palette.search.addGroupModal.headerText};
    padding-bottom: 1rem;
    display: flex;
    align-self: center;
`;

const initialState = {
    name: "",
    link: "",
    category: "",
    area: "",
    description: "",
  };

const NewGroupModal = ({ closeFunction }) => {
    

    const [width, setWidth] = useState(window.innerWidth);
    
    const [formState, setFormState] = useState(initialState);
    const [errors, setErrors] = useState(initialState);
    const [submitError, setSubmitError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      // Handle form submission here
      if (!formState.name || !formState.link || !formState.area || !formState.category || !formState.description) {
        setSubmitError("כל השדות חייבים להיות מלאים לפני השליחה");
        return
      }
      try {
        const response = await fetch(`${BASE_URL}/api/pending_groups/add/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group_name: formState.name, 
                                 group_link: formState.link,
                                 area: formState.area,
                                 category: formState.category,
                                 description: formState.description }),
        });
        const res = await response.json();
        if (response.ok && res && res.success) {
            closeFunction();
        } else {
          setSubmitError('בקשה להוספת לקבוצה נכשלה');
        }
      } catch (error) {
        console.error(error);
        setSubmitError('בקשה להוספת לקבוצה נכשלה');
      }
    };
  
    const handleChange = (e) => {
        e.stopPropagation();
      const { name, value, id } = e.target;
      setFormState({ ...formState, [name]: value });
      // Validate input and set error message if necessary
      if (!value) {
        setErrors({ ...errors, [name]: `${id} הוא שדה חובה` });
      } else if (name === "link" && !isValidUrl(value)) {
        setErrors({ ...errors, link: "קישור לא תקני" });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    };
  
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    };

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
    const isLaptop = width <= deviceSize.desktopS;
    const ModalWrapper = isMobile ? ModalBodyMobile : isLaptop ? ModalBodyLaptop : ModalBody;
    
    const colorStore = useContext(ColorStore);
    const { colorPalette } = colorStore;

    return (
        <ModalWrapper palette={colorPalette}>
            <ExitButton palette={colorPalette} onClick={closeFunction}/>
            <Container onSubmit={handleSubmit} isMobile={isMobile}>
                <H1 palette={colorPalette}> הוסף קבוצה </H1>
                <InputRow>
                    <RequiredInputDiv>
                        <Input
                            palette={colorPalette}
                            type="text"
                            id="שם הקבוצה"
                            name="name"
                            placeholder="שם הקבוצה"
                            value={formState.name}
                            onChange={handleChange}
                            isError={!!errors.name}
                        />
                    </RequiredInputDiv>
                <ErrorLine isError={errors.name}>שגיאה: {errors.name}</ErrorLine>
                </InputRow>

                <InputRow>
                    <RequiredInputDiv>
                        <Input
                            palette={colorPalette}
                            type="text"
                            id="קישור"
                            name="link"
                            value={formState.link}
                            placeholder="קישור"
                            onChange={handleChange}
                            isError={!!errors.link}
                        />
                    </RequiredInputDiv>
                <ErrorLine isError={errors.link}>שגיאה: {errors.link}</ErrorLine>
                </InputRow>

                <InputRow>
                    <RequiredInputDiv>
                        <Input
                            palette={colorPalette}
                            type="text"
                            id="קטגוריה"
                            name="category"
                            placeholder="קטגוריה"
                            value={formState.category}
                            onChange={handleChange}
                            isError={!!errors.category}
                        />
                    </RequiredInputDiv>
                <ErrorLine isError={errors.category}>שגיאה: {errors.category}</ErrorLine>
                </InputRow>

                <InputRow>
                    <RequiredInputDiv>
                        <Input
                            palette={colorPalette}
                            type="text"
                            id="איזור/עיר"
                            name="area"
                            placeholder="איזור/עיר"
                            value={formState.area}
                            onChange={handleChange}
                            isError={!!errors.area}
                        />
                    </RequiredInputDiv>
                <ErrorLine isError={errors.area}>שגיאה: {errors.area}</ErrorLine>
                </InputRow>

                <InputRow>
                    <RequiredInputDiv>
                        <Textarea
                            palette={colorPalette}
                            type="text"
                            id="תיאור"
                            name="description"
                            placeholder="תיאור"
                            value={formState.description}
                            onChange={handleChange}
                            isError={!!errors.description}
                        />
                    </RequiredInputDiv>
                <ErrorLine isError={!!errors.description}>שגיאה: {errors.description}</ErrorLine>
                </InputRow>
                
                <Button palette={colorPalette}>שלח</Button> 
                {submitError && <ErrorLine isError>{submitError}</ErrorLine>}
            </Container>
    </ModalWrapper>
    )
}

export default NewGroupModal;