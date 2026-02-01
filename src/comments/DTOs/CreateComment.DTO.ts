/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsBoolean, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  feel: string;
  @IsString()
  subject: string;
  @IsString()
  image: string;
  @IsBoolean()
  isVisible: boolean;
}
