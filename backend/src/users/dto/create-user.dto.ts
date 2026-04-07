// src/users/dto/create-user.dto.ts
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dto/register.dto';
import { UserRole } from '@my-app/shared';

export class CreateUserDto extends RegisterDto {
  @ApiProperty({ 
    enum: UserRole, 
    required: false, 
    example: UserRole.CLIENT,
    description: 'User role - defaults to CLIENT if not specified'
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}