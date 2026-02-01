import { Module } from '@nestjs/common';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SYNChronize, tokenExpire } from '../utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThePost } from '../posts/posts.entity';
import { Comment } from '../comments/comments.entity';
import { TheReplay } from '../Replays/Replays.entity';
import { TheReaction } from '../Reactions/Reactions.entity';
import { TheFollow } from '../follows/Follows.entity';
import { User } from '../users/users.entity';
import { TheNotification } from './notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { SavePost } from '../savePosts/savePost.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (conig: ConfigService) => {
        return {
          global: true,
          secret: conig.get<string>('JWTKEY'),
          signOptions: { expiresIn: tokenExpire },
        };
      },
    }),

    TypeOrmModule.forFeature([
      User,
      ThePost,
      Comment,
      TheReplay,
      TheReaction,
      TheFollow,
      TheNotification,
      SavePost,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_Connect'),
        entities: [
          User,
          ThePost,
          Comment,
          TheReplay,
          TheReaction,
          TheFollow,
          TheNotification,
          SavePost,
        ],
        synchronize: SYNChronize, // استخدمها فقط للتجربة (تحذفها في الإنتاج)
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [JwtModule, NotificationsGateway],
})
export class NotificationsModule {}
