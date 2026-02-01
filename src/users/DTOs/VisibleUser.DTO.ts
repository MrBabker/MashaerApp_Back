/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsBoolean } from 'class-validator';

export class VisibleUserDTO {
  @IsBoolean()
  isVisible: boolean;
}
