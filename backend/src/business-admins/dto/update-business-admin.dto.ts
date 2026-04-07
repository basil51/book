// update-business-admin.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateBusinessAdminDto } from './create-business-admin.dto';

export class UpdateBusinessAdminDto extends PartialType(
  CreateBusinessAdminDto,
) {}
