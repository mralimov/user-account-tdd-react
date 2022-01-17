import SignUpPage from './SignUpPage.jsx';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

describe('Sign Up Page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<SignUpPage />);
      const header = screen.queryByRole('heading', { name: 'Sign Up' });
      expect(header).toBeInTheDocument();
    });
    it('has username input', () => {
      render(<SignUpPage />);
      const userNameLabel = screen.getByLabelText('Username');
      expect(userNameLabel).toBeInTheDocument();
    });
    it('has email input', () => {
      render(<SignUpPage />);
      const emailLabel = screen.getByLabelText('E-mail');
      expect(emailLabel).toBeInTheDocument();
    });
    it('has password input', () => {
      render(<SignUpPage />);
      const passwordLabel = screen.getByLabelText('Password');
      expect(passwordLabel).toBeInTheDocument();
    });
    it('has password input type', () => {
      render(<SignUpPage />);
      const passwordLabel = screen.getByLabelText('Password');
      expect(passwordLabel.type).toBe('password');
    });
    it('has password repeat input', () => {
      render(<SignUpPage />);
      const passwordRepeatInput = screen.getByLabelText('Password Repeat');
      expect(passwordRepeatInput).toBeInTheDocument();
    });

    it('has password repeat input type', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Password Repeat');
      expect(input.type).toBe('password');
    });
    it('has sign up button', () => {
      render(<SignUpPage />);
      const input = screen.queryByRole('button', { name: 'Sign Up' });
      expect(input).toBeInTheDocument();
    });
    it('has sign up button to be disabled', () => {
      render(<SignUpPage />);
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    });
  });
  describe('check sign up button anabled when password and password retype match', () => {
    it('has signup button enabled', () => {
      render(<SignUpPage />);
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatInput = screen.getByLabelText('Password Repeat');
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');

      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeEnabled();
    });
  });

  describe('check when user clicks sign up button all the data sent to backend', () => {
    it('sends username, email, password to backend', () => {
      let requestBody;
      const server = setupServer(
        rest.post('api/1.0/users', (req, res, ctx) => {
          requestBody = req.body;
          return res(ctx.status(200));
        })
      );
      server.listen();

      render(<SignUpPage />);
      const username = screen.getByLabelText('Username');
      const email = screen.getByLabelText('E-mail');
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');

      userEvent.type(username, 'user1');
      userEvent.type(email, 'user1@mail.com');
      userEvent.type(password, 'P4ssword');
      userEvent.type(passwordRepeat, 'P4ssword');
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      userEvent.click(button);

      const mockFn = jest.fn();

      // axios.post = mockFn;
      // window.fetch = mockFn;
      // const firstCallOfMockFunction = mockFn.mock.calls[0];

      // const body = JSON.parse(firstCallOfMockFunction[1].body);

      expect(body).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      });
    });
  });
});
