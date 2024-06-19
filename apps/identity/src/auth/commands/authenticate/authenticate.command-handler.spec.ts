import { Test } from '@nestjs/testing';

import { Account } from '../../../account/domain/account.entity';
import { Email } from '../../../account/domain/email.value-object';
import { Username } from '../../../account/domain/username.value-object';
import { AuthenticateCommand } from './authenticate.command';
import { AuthenticateCommandHandler } from './authenticate.command-handler';
import { IAccountRepository, IValueHasher } from '../../../account/contracts';
import { ITokenService } from '../../contracts';
import { UnauthorizedException } from '../../exceptions';

const valueHasherMock = {
  hash: jest.fn(),
  verify: jest.fn(),
};

const tokenServiceMock = {
  generateAccess: jest.fn(),
  refreshAccess: jest.fn(),
};

const accountMock = new Account({
  email: new Email({ address: 'test@test.com', isConfirmed: false }),
  username: new Username({ value: 'test' }),
  password: 'testPassw!@#',
});

const accountRepositoryMock = {
  getById: jest.fn(),
  getByEmail: jest.fn(),
  insert: jest.fn(),
  isUnique: jest.fn(),
};

const command = new AuthenticateCommand({ email: 'test@test.com', password: 'testPassw!@#' });

describe('AuthenticateCommandHandler', () => {
  let handler: AuthenticateCommandHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthenticateCommandHandler,
        { provide: IValueHasher, useValue: valueHasherMock },
        { provide: IAccountRepository, useValue: accountRepositoryMock },
        { provide: ITokenService, useValue: tokenServiceMock },
      ],
    }).compile();

    handler = module.get(AuthenticateCommandHandler);
  });

  describe('execute', () => {
    it('should handle without any errors', () => {
      accountRepositoryMock.getByEmail.mockImplementation(() => accountMock);
      valueHasherMock.verify.mockImplementation(() => true);

      expect(handler.execute(command)).resolves;
    });

    it('should throw error when email address is invalid', () => {
      accountRepositoryMock.getByEmail.mockImplementation(() => undefined);

      expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error when password is invalid', () => {
      accountRepositoryMock.getByEmail.mockImplementation(() => accountMock);
      valueHasherMock.verify.mockImplementation(() => false);

      expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
    });
  });
});
