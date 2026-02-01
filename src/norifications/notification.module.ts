import { Module } from '@nestjs/common';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SYNChronize, tokenExpire } from 'src/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThePost } from 'src/posts/posts.Aentity';
import { Comment } from 'src/comments/comments.Aentity';
import { TheReplay } from 'src/Replays/Replays.Aentity';
import { TheReaction } from 'src/Reactions/Reactions.Aentity';
import { TheFollow } from 'src/follows/Follows.Aentity';
import { User } from 'src/users/users.aentites';
import { TheNotification } from './notification.Aentity';
import { NotificationsGateway } from './notifications.gateway';
import { SavePost } from 'src/savePosts/savePost.Aentity';

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
