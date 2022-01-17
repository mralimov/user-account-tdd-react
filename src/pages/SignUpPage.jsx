import React, { useState, useMemo } from 'react';
import axios from 'axios';

const SignUpPage = () => {
  const initialState = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
  };

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [objData, setObjData] = useState(initialState);

  const inputOnChange = (event) => {
    const { id, value } = event.target;
    console.log(id, value);

    setObjData({
      ...objData,
      [id]: value,
    });
  };

  const { username, email, password, passwordRepeat } = objData;

  useMemo(() => {
    if (password && passwordRepeat) {
      setButtonDisabled(password !== passwordRepeat);
    }
  }, [password, passwordRepeat]);

  const signUpHandler = (event) => {
    event.preventDefault();
    console.log(objData);

    const body = {
      username,
      email,
      password,
    };

    // axios.post('/api/1.0/users', body);
    fetch('/api/1.0/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    setObjData({ ...initialState });
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <h1 className='text-center'>Sign Up</h1>

        <div className='mb-3'>
          <label htmlFor='username'>Username</label>
          <input id='username' value={username} onChange={inputOnChange} />
        </div>

        <div className='mb-3'>
          <label htmlFor='email'>E-mail</label>
          <input id='email' value={email} onChange={inputOnChange} />
        </div>

        <div className='mb-3'>
          <label htmlFor='password'>Password</label>
          <input
            value={password}
            id='password'
            type='password'
            onChange={inputOnChange}
          />
        </div>

        <div className='mb-3'>
          <label htmlFor='passwordRepeat'>Password Repeat</label>
          <input
            value={passwordRepeat}
            id='passwordRepeat'
            type='password'
            onChange={inputOnChange}
          />
        </div>

        <button
          className='btn btn-primary'
          disabled={buttonDisabled}
          onClick={signUpHandler}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
