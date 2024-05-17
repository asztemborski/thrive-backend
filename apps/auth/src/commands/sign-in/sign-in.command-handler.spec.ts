import { SignInCommandHandler } from './sign-in.command-handler';
import { Test } from '@nestjs/testing';
import { TOKENS_SERVICE, USER_REPOSITORY, VALUE_HASHER } from '../../auth.di-tokens';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InvalidCredentialsException } from '../../exceptions';
import { User } from '../../domain/entities/user.entity';
import { Email, Username } from '../../domain/value-objects';
import { SignInCommand } from './sign-in.command';

const valueHasherMock = {
  hash: jest.fn(),
  verify: jest.fn(),
};

const userMock = new User({
  email: new Email({ address: 'test@test.com', isConfirmed: false }),
  username: new Username({ value: 'test' }),
  password: 'testPassw!@#',
  refreshTokens: [],
});

const userRepositoryMock = {
  getByEmail: jest.fn(),
  insert: jest.fn(),
  isUnique: jest.fn(),
};

const command = new SignInCommand({ email: 'test@test.com', password: 'testPassw!@#' });

describe('SignInCommandHandler', () => {
  let handler: SignInCommandHandler;

  const tokensServiceMock = {
    generateAccess: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        SignInCommandHandler,
        { provide: VALUE_HASHER, useValue: valueHasherMock },
        { provide: USER_REPOSITORY, useValue: userRepositoryMock },
        { provide: TOKENS_SERVICE, useValue: tokensServiceMock },
      ],
    }).compile();

    handler = module.get(SignInCommandHandler);
  });

  describe('execute', () => {
    it('should handle without any errors', () => {
      userRepositoryMock.getByEmail.mockImplementation(() => userMock);
      valueHasherMock.verify.mockImplementation(() => true);

      expect(handler.execute(command)).resolves;
    });

    it('should throw error when email address is invalid', () => {
      userRepositoryMock.getByEmail.mockImplementation(() => undefined);

      expect(handler.execute(command)).rejects.toThrow(InvalidCredentialsException);
    });

    it('should throw error when password is invalid', () => {
      userRepositoryMock.getByEmail.mockImplementation(() => userMock);
      valueHasherMock.verify.mockImplementation(() => false);

      expect(handler.execute(command)).rejects.toThrow(InvalidCredentialsException);
    });
  });
});
