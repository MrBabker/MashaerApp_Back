import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThePost } from 'src/posts/posts.Aentity';
import { User } from 'src/users/users.aentites';
import { Repository } from 'typeorm';
import { SavePost } from './savePost.Aentity';

@Injectable()
export class SavePostService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ThePost)
    private readonly postRepo: Repository<ThePost>,
    @InjectRepository(SavePost)
    private readonly savePostsRepo: Repository<SavePost>,
  ) {}

  public async getSavedPosts(myId: number) {
    return await this.savePostsRepo.find({
      where: { userId: myId },
      relations: [
        'post',
        'user',
        'post.comments',
        'post.reaction',
        'post.user',
        'post.savePosts',
      ],
    });
  }

  public async savePost(myId: number, postId: number) {
    const alreadySaved = await this.savePostsRepo.findOne({
      where: { userId: myId, postId },
    });

    if (alreadySaved) {
      await this.savePostsRepo.remove(alreadySaved);
      return { message: 'post unsaved' };
    }

    const user = await this.userRepo.findOne({ where: { id: myId } });
    if (!user) throw new NotFoundException('user not found');

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('post not found');

    const savedPost = await this.savePostsRepo.save({
      userId: myId,
      postId: postId,
      user: user,
      post: post,
    });

    return savedPost;
  }
}
