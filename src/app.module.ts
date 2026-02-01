import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ReplaysModule } from './Replays/Replays.module';
import { ReactionsModule } from './Reactions/Reactions.module';
import { FollowsModule } from './follows/Follows.module';
import { NotificationsModule } from './norifications/notification.module';
import { SavePostModule } from './savePosts/savePost.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    CommentsModule,
    ReplaysModule,
    ReactionsModule,
    FollowsModule,
    NotificationsModule,
    SavePostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
