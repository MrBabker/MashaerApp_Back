import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '../users/gaurds/authUser.guard';
import { CurrntDecorator } from '../users/decoders/currentUser.decoder';
import type { JWT_Payload } from '../utils';
import { CreateNotificationDTO } from './DTOs/CreateNotification.entity';
import { UpdateNotificationDTO } from './DTOs/UpdateNotification.DTO';

@Controller('notif')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  public async GetNotifications(@CurrntDecorator() payload: JWT_Payload) {
    return this.notificationsService.GetNotificationsOfUser(payload.id);
  }

  @Get('count')
  @UseGuards(AuthGuard)
  public async GetNotificationsCount(@CurrntDecorator() payload: JWT_Payload) {
    return this.notificationsService.GetNotificationsCount(payload.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  public async CreateNotification(
    @CurrntDecorator() payload: JWT_Payload,
    @Body() dto: CreateNotificationDTO,
  ) {
    return this.notificationsService.createNotification(
      payload.id,
      dto.fromUserName,
      dto.postCommentId,
      dto.type,
      dto.talk,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public async UpdateNotification(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationDTO,
  ) {
    return this.notificationsService.updateNotification(payload.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async DeleteNotification(
    @Param('id', ParseIntPipe) id: number,
    @CurrntDecorator() payload: JWT_Payload,
  ) {
    return this.notificationsService.deleteNotification(id, payload.id);
  }
}
