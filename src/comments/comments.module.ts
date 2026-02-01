import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { ThePost } from '../posts/posts.entity';
import { Comment } from './comments.entity';
import { TheReplay } from '../Replays/Replays.entity';
import { TheReaction } from '../Reactions/Reactions.entity';
import { TheFollow } from '../follows/Follows.entity';
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
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [JwtModule],
})
export class CommentsModule {}
