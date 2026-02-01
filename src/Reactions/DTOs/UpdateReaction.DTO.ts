/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsBoolean, IsString } from 'class-validator';

export class UpdateReactionDTO {
  @IsString()
  type: string;

  @IsBoolean()
  isVisible: boolean;
}
