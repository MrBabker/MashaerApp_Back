/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
