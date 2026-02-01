import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateReactionDTO {
  @IsNumber()
  userId: number;

  @IsString()
  type: string;

  @IsBoolean()
  isVisible: boolean;
}
