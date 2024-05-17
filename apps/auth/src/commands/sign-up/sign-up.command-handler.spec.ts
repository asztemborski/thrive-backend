import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { USER_REPOSITORY, VALUE_HASHER } from '../../auth.di-tokens';
import { EMAIL_CONFIG_TOKEN } from '../../config';
import {
  EmailAlreadyInUseException,
  InvalidEmailProviderException,
  UsernameAlreadyInUseException,
} from '../../exceptions';
import { SignUpCommandHandler } from './sign-up.command-handler';
import { InvalidEmailAddressException, UsernameIsTooShortException } from '../../domain/exceptions';
import { SignUpCommand } from './sign-up.command';

const valueHasherMock = {
  hash: jest.fn(),
  verify: jest.fn(),
};

const userRepositoryMock = {
  getByEmail: jest.fn(),
  insert: jest.fn(),
  isUnique: jest.fn(),
};

const command = new SignUpCommand({
  email: 'testMail@test.com',
  username: 'testUsername',
  password: 'passwTest!@#',
});

describe('SignUpCommandHandler', () => {
  let handler: SignUpCommandHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(async () => ({
          [EMAIL_CONFIG_TOKEN]: {
            bannedEmailProviders: ['bannedMail.com'],
          },
        })),
      ],
      providers: [
        SignUpCommandHandler,
        { provide: VALUE_HASHER, useValue: valueHasherMock },
        { provide: USER_REPOSITORY, useValue: userRepositoryMock },
      ],
    }).compile();
    handler = module.get(SignUpCommandHandler);
  });

  describe('execute', () => {
    it('should handle without any errors', () => {
      userRepositoryMock.isUnique.mockImplementation(() => [true, true]);

      expect(handler.execute(command)).resolves;
    });

    it('should throw error when banned email provider is being used', () => {
      expect(handler.execute({ ...command, email: 'test@bannedMail.com' })).rejects.toThrow(
        InvalidEmailProviderException,
      );
    });

    it('should throw error when email is taken', () => {
      userRepositoryMock.isUnique.mockImplementation(() => [false, true]);

      expect(handler.execute(command)).rejects.toThrow(EmailAlreadyInUseException);
    });

    it('should throw error when username is taken', () => {
      userRepositoryMock.isUnique.mockImplementation(() => [true, false]);

      expect(handler.execute(command)).rejects.toThrow(UsernameAlreadyInUseException);
    });

    it('should throw error when email is invalid', () => {
      userRepositoryMock.isUnique.mockImplementation(() => [true, true]);

      expect(handler.execute({ ...command, email: 'invalidEmail@' })).rejects.toThrow(
        InvalidEmailAddressException,
      );
    });

    it('should throw error when username is less than 4 characters long', () => {
      userRepositoryMock.isUnique.mockImplementation(() => [true, true]);

      expect(handler.execute({ ...command, username: 'asd' })).rejects.toThrow(
        UsernameIsTooShortException,
      );
    });
  });
});
