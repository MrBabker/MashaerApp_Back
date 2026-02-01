import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TheNotification } from './notification.Aentity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.aentites';
import { notificationsTypes } from 'src/utils';
import { ThePost } from 'src/posts/posts.Aentity';
import { Comment } from 'src/comments/comments.Aentity';
import { UpdateNotificationDTO } from './DTOs/UpdateNotification.DTO';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(TheNotification)
    private readonly notificationRepo: Repository<TheNotification>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ThePost) private readonly postRepo: Repository<ThePost>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly gateway: NotificationsGateway,
  ) {}

  public async GetNotificationsOfUser(userId: number) {
    return await this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  public async GetNotificationsCount(userId: number) {
    return await this.notificationRepo.count({
      where: { userId, isRead: false },
    });
  }

  public async createNotification(
    fromUserId: number,
    fromUserName: string,
    postCommentId: number,
    type: string,
    talk: string,
  ) {
    if (type === notificationsTypes.comment.toString()) {
      const post = await this.postRepo.findOne({
        where: { id: postCommentId },
        relations: ['user'],
      });

      if (post === null) throw new NotFoundException('post not found');
      if (fromUserId === post.user.id)
        throw new BadRequestException('cant create notification to your self');

      const newnoti = await this.notificationRepo.save({
        userId: post.user.id, // صاحب المنشور
        fromUserId: fromUserId,
        type: notificationsTypes.comment.toString(),
        postId: postCommentId,
        message: `علق ( ${fromUserName} ) على منشورك : ${talk}`,
      });

      this.gateway.sendNotification(post.user.id.toString(), newnoti);
      return newnoti;
    } else if (type === notificationsTypes.replay.toString()) {
      const comment = await this.commentRepo.findOne({
        where: { id: postCommentId },
        relations: ['user'],
      });

      if (comment === null) throw new NotFoundException('comment not found');
      if (fromUserId === comment.user.id)
        throw new BadRequestException('cant create notification to your self');

      const newnoti = await this.notificationRepo.save({
        userId: comment.user.id, // صاحب المنشور
        fromUserId: fromUserId,
        type: notificationsTypes.replay.toString(),
        commentId: postCommentId,
        message: `رد ( ${fromUserName} ) على تعليقك : ${talk}`,
      });

      this.gateway.sendNotification(comment.user.id.toString(), newnoti);
      return newnoti;
    } else if (type === notificationsTypes.follow.toString()) {
      if (fromUserId === postCommentId)
        throw new BadRequestException('cant create notification to your self');

      const newnoti = await this.notificationRepo.save({
        userId: postCommentId, // صاحب المنشور
        fromUserId: fromUserId,
        type: notificationsTypes.follow.toString(),
        commentId: postCommentId,
        message: `بدأ ( ${fromUserName} ) بمتابعتك `,
      });

      this.gateway.sendNotification(postCommentId.toString(), newnoti);
      return newnoti;
    }
  }

  public async updateNotification(
    myId: number,
    id: number,
    dto: UpdateNotificationDTO,
  ) {
    const notif = await this.notificationRepo.findOne({
      where: { id, userId: myId },
    });

    if (notif === null)
      throw new NotFoundException('notification not found or not yours');

    Object.assign(notif, dto);
    const updatedNotif = await this.notificationRepo.save(notif);

    return updatedNotif;
  }

  public async deleteNotification(id: number, userId: number) {
    const result = await this.notificationRepo.delete({ id, userId });

    if (result.affected === 0)
      throw new NotFoundException('notification not found or not yours');

    return { message: 'notification deleted' };
  }
}
