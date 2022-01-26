import SignUpPage from './SignUpPage.jsx';
import { render, screen, waitFor } from '@testing-library/react';
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
    let counter = 0;
    let requestBody;
    const server = setupServer(
      rest.post('/api/1.0/users', (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(ctx.status(200));
      })
    );

    beforeEach(() => (counter = 0));
    beforeAll(() => server.listen());
    afterAll(() => server.close());

    let button;
    const setup = () => {
      render(<SignUpPage />);
      const username = screen.getByLabelText('Username');
      const email = screen.getByLabelText('E-mail');
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');

      userEvent.type(username, 'user1');
      userEvent.type(email, 'user1@mail.com');
      userEvent.type(password, 'P4ssword');
      userEvent.type(passwordRepeat, 'P4ssword');
      button = screen.queryByRole('button', { name: 'Sign Up' });
    };

    it('has signup button enabled', () => {
      render(<SignUpPage />);
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatInput = screen.getByLabelText('Password Repeat');
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');

      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeEnabled();
    });

    describe('check when user clicks sign up button all the data sent to backend', () => {
      it('sends username, email, password to backend', async () => {
        setup();
        userEvent.click(button);

        await screen.findByText(
          'Please check your e-mail to activate your account'
        );
        expect(requestBody).toEqual({
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword',
        });
      });

      it('disables sign up button if backend looding', async () => {
        setup();
        userEvent.click(button);
        userEvent.click(button);

        await screen.findByText(
          'Please check your e-mail to activate your account'
        );
        expect(counter).toBe(1);
      });

      it('displays spinner after clicking the submit', async () => {
        setup();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        userEvent.click(button);
        const spinner = screen.getByRole('status');

        expect(spinner).toBeInTheDocument();
        await screen.findByText(
          'Please check your e-mail to activate your account'
        );
      });
      it('show account verification notification after successfully sign up form', async () => {
        setup();
        userEvent.click(button);
        const text = await screen.findByText(
          'Please check your e-mail to activate your account'
        );

        expect(text).toBeInTheDocument();
      });
      it('hides sign up form after successfully sign up', async () => {
        setup();
        const form = screen.getByTestId('form-sign-up');
        userEvent.click(button);
        await waitFor(() => {
          expect(form).not.toBeInTheDocument();
        });
      });
      it('displays validation message for username', async () => {
        server.use(
          rest.post('/api/1.0/users', (req, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                validationErrors: { username: 'Username cannot be null' },
              })
            );
          })
        );
        setup();
        userEvent.click(button);
        const validationError = await screen.findByText(
          'Username cannot be null'
        );
        expect(validationError).toBeInTheDocument();
      });
    });
  });
});
