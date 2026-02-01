import { IsBoolean } from 'class-validator';

export class UpdateNotificationDTO {
  @IsBoolean()
  isRead: boolean;
}
