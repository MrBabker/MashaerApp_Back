/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsBoolean, IsString } from 'class-validator';

export class UpdatePostDTO {
  @IsString()
  feel: string;
  @IsString()
  subject: string;
  @IsString()
  image: string;
  @IsBoolean()
  isVisible: boolean;
}
