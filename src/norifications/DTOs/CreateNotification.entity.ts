import { IsNumber, IsString } from 'class-validator';

export class CreateNotificationDTO {
  @IsString()
  fromUserName: string;
  @IsNumber()
  postCommentId: number;
  @IsString()
  type: string;
  @IsString()
  talk: string;
}
