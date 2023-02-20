import React, { useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import styled, { css } from 'styled-components';
import { BASE_URL, size as deviceSize } from '../constants';
import ColorStore from '../stores/ColorStore';
import DropDownList from './dropDownList';
import AutoSuggestInput from './AutoSuggestInput';
import GroupStore from '../stores/GroupStore';

const ModalBody = styled.div`
    background-color: ${({ palette }) => palette.search.addGroupModal.background};
    position: fixed;
    height: 90%;
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
    height: 85%;
    width: 40%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 501;
    padding: 3rem;
    border-radius: 2rem;
    pointer-events: all;
    box-shadow: 0px 0px 10px ${({ palette }) => palette.search.addGroupModal.modalBoxShadow};
    overflow: auto;
`;

const ModalBodyMobile = styled.div`
    background-color: ${({ palette }) => palette.search.addGroupModal.background};
    position: fixed;
    height: 80%;
    padding: 2rem;
    width: 90%;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    z-index: 501;
    pointer-events: all;
    border-radius: 2rem;
    box-shadow: 0px 0px 10px ${({ palette }) => palette.search.addGroupModal.modalBoxShadow};
    overflow: auto;
`;

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  direction: rtl;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  direction: rtl;
  gap: ${({ isMobile }) => isMobile ? '.25rem' : '1rem'};
  width: 100%;
`;

const Input = styled.input`
    display: flex;
    justify-content: center;
    direction: rtl;
    width: 100%;
    font-size: 1.2rem;
    padding: 1rem 2rem;
    // border: 1px solid ${({ palette }) => palette.search.addGroupModal.inputBorder};
    background-color: ${({ palette }) => palette.search.addGroupModal.inputBackground};
    color: ${({ palette }) => palette.search.addGroupModal.inputText};
    border: none;
    border-radius: 0.75rem;
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
  };

const NewGroupModal = ({ closeFunction, submitAction = async () => {}, defaultState = null }) => {
    

    const [width, setWidth] = useState(window.innerWidth);
    
    const [formState, setFormState] = useState(defaultState || initialState);
    const [errors, setErrors] = useState(initialState);
    const [submitError, setSubmitError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Handle form submission here
      if (!formState.name || !formState.link || !formState.area || !formState.category) {
        setSubmitError("כל השדות חייבים להיות מלאים לפני השליחה");
        return
      }
      try {
        await submitAction(formState.name, formState.link, formState.area, formState.category);
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
    
    const groupStore = useContext(GroupStore);
    const { categorySuggestions: suggestions } = groupStore;

    const colorStore = useContext(ColorStore);
    const { colorPalette } = colorStore;

    const handleSuggestionClick = (suggestion) => {
      setFormState({ ...formState, category: suggestion });
      
    }

    const handleInputChange = (e, field) => {
      setFormState({ ...formState, [field]: e.target.value});
    }

    return (
        <ModalWrapper palette={colorPalette}>
            <ExitButton palette={colorPalette} onClick={closeFunction}/>
            <Container onSubmit={handleSubmit} isMobile={isMobile}>
                <H1 palette={colorPalette}> הוסף קבוצה </H1>
                <Fields>
                <InputRow>
                    <RequiredInputDiv>
                      <DropDownList 
                                  addShadow={false}
                                  options={["שפלה", "גוש דן", "צפון", "דרום", "השרון", "כללי"]}
                                  text={formState.area}
                                  setText={(text) => {
                                    setFormState({ ...formState, area: text });
                                  }}
                                  isMobile={isMobile}
                                  defaultOption="בחר אזור"
                                  defaultOptionAction={(text) => {
                                    setFormState({ ...formState, area: '' });
                                  }}
                                  colorPalette={colorPalette.search.addGroupModal.areaDropDown}
                        />
                    </RequiredInputDiv>
                <ErrorLine isError={errors.area}>שגיאה: {errors.area}</ErrorLine>
                </InputRow>
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
                    <AutoSuggestInput inputPlaceholder="הקלד קטגוריה..." colorPalette={colorPalette.search.addGroupModal} handleSuggestionClick={handleSuggestionClick} 
                        handleInputChange={(e) => handleInputChange(e, "category")} suggestions={suggestions} textSearch={formState.category} addShadow={false} />
                    </RequiredInputDiv>
                <ErrorLine isError={errors.category}>שגיאה: {errors.category}</ErrorLine>
                </InputRow>

                </Fields>
                
                <Button palette={colorPalette}>שלח</Button> 
                {submitError && <ErrorLine isError>{submitError}</ErrorLine>}
            </Container>
    </ModalWrapper>
    )
}

export default NewGroupModal;