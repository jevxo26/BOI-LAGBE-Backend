import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsOptional()
  roles?: string[];

  // Optional Student profile info during registration
  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  instituteId?: string;

  @IsString()
  @IsOptional()
  campusId?: string;

  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  programId?: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identity: string; // email or phone

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  deviceName?: string;
}

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  purpose: 'REGISTER' | 'LOGIN' | 'PASSWORD_RESET' | 'CHANGE_PHONE' | 'CHANGE_EMAIL';
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  purpose: 'REGISTER' | 'LOGIN' | 'PASSWORD_RESET' | 'CHANGE_PHONE' | 'CHANGE_EMAIL';
}
