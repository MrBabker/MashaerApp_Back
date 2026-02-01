/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  usertag: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  image: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
