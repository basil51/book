// create-business-admin.dto.ts
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateBusinessAdminDto {
  @IsNumber()
  user: { id: number };

  @IsNumber()
  business: { id: number };

  @IsBoolean()
  isOwner: boolean;
}
