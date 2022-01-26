import React, { useState, useMemo } from 'react';
import axios from 'axios';

const SignUpPage = () => {
  const initialState = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    error: {},
  };

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [objData, setObjData] = useState(initialState);
  const [apiProgress, setApiProgress] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

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

  const signUpHandler = async (event) => {
    event.preventDefault();
    console.log(objData);

    const body = {
      username,
      email,
      password,
    };
    setApiProgress(true);
    // axios.post('/api/1.0/users', body);

    try {
      await fetch('/api/1.0/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      setSignUpSuccess(true);
      setObjData({ ...initialState });
    } catch (error) {}
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className='col-lg-6 offset-lg-3 col-md-8 offset-md-2'>
      {!signUpSuccess && (
        <form
          onSubmit={submitHandler}
          className='card mt-5'
          data-testid='form-sign-up'
        >
          <div className='card-header'>
            <h1 className='text-center'>Sign Up</h1>
          </div>
          <div className='card-body'>
            <div className='mb-3'>
              <label htmlFor='username' className='form-label'>
                Username
              </label>
              <input
                id='username'
                className='form-control'
                value={username}
                onChange={inputOnChange}
              />
            </div>

            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>
                E-mail
              </label>
              <input
                id='email'
                className='form-control'
                value={email}
                onChange={inputOnChange}
              />
            </div>

            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>
                Password
              </label>
              <input
                className='form-control'
                value={password}
                id='password'
                type='password'
                onChange={inputOnChange}
              />
            </div>

            <div className='mb-3'>
              <label htmlFor='passwordRepeat' className='form-label'>
                Password Repeat
              </label>
              <input
                className='form-control'
                value={passwordRepeat}
                id='passwordRepeat'
                type='password'
                onChange={inputOnChange}
              />
            </div>
            <div className='text-center'>
              <button
                className='btn btn-primary'
                disabled={buttonDisabled || apiProgress}
                onClick={signUpHandler}
              >
                {apiProgress && (
                  <span
                    className='spinner-border spinner-border-sm'
                    role='status'
                  ></span>
                )}
                Sign Up
              </button>
            </div>
          </div>
        </form>
      )}
      {signUpSuccess && (
        <div className='alert alert-success mt-3' role='alert'>
          Please check your e-mail to activate your account
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
