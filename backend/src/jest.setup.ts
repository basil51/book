import { Test } from '@nestjs/testing';

const originalCreateTestingModule = Test.createTestingModule.bind(Test);

Test.createTestingModule = ((metadata: any) =>
  originalCreateTestingModule(metadata).useMocker((token) => {
    if (typeof token === 'function' && token.name === 'ConfigService') {
      return {
        get: jest.fn((key: string) => {
          if (key === 'TWILIO_ACCOUNT_SID') {
            return 'AC00000000000000000000000000000000';
          }
          if (key === 'TWILIO_AUTH_TOKEN') {
            return 'test_token';
          }
          if (key === 'TWILIO_WHATSAPP_FROM') {
            return 'whatsapp:+14155238886';
          }
          return undefined;
        }),
      };
    }

    if (typeof token === 'string' && token.endsWith('Repository')) {
      return {
        find: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        findAndCount: jest.fn(),
        query: jest.fn(),
      };
    }

    return {};
  })) as typeof Test.createTestingModule;
