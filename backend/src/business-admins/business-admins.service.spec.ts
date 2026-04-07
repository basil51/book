import { Test, TestingModule } from '@nestjs/testing';
import { BusinessAdminsService } from './business-admins.service';

describe('BusinessAdminsService', () => {
  let service: BusinessAdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessAdminsService],
    }).compile();

    service = module.get<BusinessAdminsService>(BusinessAdminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
