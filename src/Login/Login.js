import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ColorStore from '../stores/ColorStore';
import { BASE_URL } from '../constants';
import AuthStore from '../stores/AuthStore';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: ${({ palette }) => palette.login.label};
`;

const Input = styled.input`
  padding: 1rem;
  font-size: 1.6rem;
  color: ${({ palette }) => palette.login.inputText};
  background-color: ${({ palette }) => palette.login.inputBackground};
  border: none;
  border-radius: .75rem;
  -webkit-appearance: none;
  box-shadow: 0px 0px 5px ${({ palette }) => palette.login.inputBoxShadow};
  font-size: 18px;
  outline:none;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background-color: ${({ palette }) => palette.login.buttonBackground};
  color: ${({ palette }) => palette.login.buttonText};
  font-size: 1.6rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 2rem;

  &:hover {
    background-color: ${({ palette }) => palette.login.buttonBackgroundHover};
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 2rem;
`;

const Login = ({ navigateTo }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const colorStore = useContext(ColorStore)
  const { colorPalette } = colorStore;
  const authStore = useContext(AuthStore);
  const { setToken } = authStore;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === '' || password === '') {
      setError('Username and password cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const res = JSON.parse(await response.json());
      if (response.ok && res && res.creds) {
            setToken(res.creds)
            navigate(navigateTo);
      } else {
        setError('Incorrect username or password.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while logging in.');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <InputContainer>
          <Label htmlFor="username" palette={colorPalette}>Username:</Label>
          <Input
            palette={colorPalette}
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Label htmlFor="password" palette={colorPalette}>Password:</Label>
          <Input
            palette={colorPalette}
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </InputContainer>
        <Button type="submit" palette={colorPalette} >Login</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoginForm>
    </LoginContainer>
  );
}

export default observer(Login);