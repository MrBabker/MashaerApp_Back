import { Module } from '@nestjs/common';
import { FollowsController } from './Follows.controller';
import { FollowsService } from './Follows.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/comments.entity';
import { User } from '../users/users.entity';
import { ThePost } from '../posts/posts.entity';
import { TheReplay } from '../Replays/Replays.entity';
import { TheReaction } from '../Reactions/Reactions.entity';
import { TheFollow } from './Follows.entity';
import { SYNChronize, tokenExpire } from '../utils';
import { TheNotification } from '../norifications/notification.entity';
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
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [JwtModule],
})
export class FollowsModule {}
