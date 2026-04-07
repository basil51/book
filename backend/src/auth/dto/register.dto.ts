// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmailOrPhone } from 'src/common/validators/email-or-phone.validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    example: 'user@example.com',
    description:
      'Email address (optional, but either email or phone must be provided)',
  })
  @IsOptional()
  @ValidateIf((o: RegisterDto) => !o.phone || !!o.email) // Validate email if phone is not provided OR if email is provided
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsEmailOrPhone({ message: 'Either email or phone number must be provided' })
  email?: string;

  @ApiProperty({
    required: false,
    example: '+1234567890',
    description:
      'Phone number (optional, but either email or phone must be provided)',
  })
  @IsOptional()
  @ValidateIf((o: RegisterDto) => !o.email || !!o.phone) // Validate phone if email is not provided OR if phone is provided
  @IsString({ message: 'Please provide a valid phone number' })
  phone?: string;

  @ApiProperty({ minLength: 8, example: 'securePassword123' })
  @IsString()
  @MinLength(8)
  password: string;
}
