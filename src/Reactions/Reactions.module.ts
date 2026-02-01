import { Module } from '@nestjs/common';
import { ReactionsController } from './Reactions.controller';
import { ReactionsService } from './Reactions.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/users.entity';
import { ThePost } from '../posts/posts.entity';
import { Comment } from '../comments/comments.entity';
import { TheReplay } from '../Replays/Replays.entity';
import { TheReaction } from './Reactions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TheFollow } from '../follows/Follows.entity';
import { SYNChronize, tokenExpire } from '../utils';
import { TheNotification } from '../norifications/notification.entity';
import { ReactionsGateway } from './reactions.gateway';
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
  controllers: [ReactionsController],
  providers: [ReactionsService, ReactionsGateway],
  exports: [JwtModule, ReactionsGateway],
})
export class ReactionsModule {}
