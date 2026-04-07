import { Test, TestingModule } from '@nestjs/testing';
import { BusinessAdminsController } from './business-admins.controller';

describe('BusinessAdminsController', () => {
  let controller: BusinessAdminsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessAdminsController],
    }).compile();

    controller = module.get<BusinessAdminsController>(BusinessAdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
