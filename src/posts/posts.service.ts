import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDTO } from './DTOs/CreatePost.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { ThePost } from './posts.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { UpdatePostDTO } from './DTOs/UpdatePost.DTO';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(ThePost) private readonly postRepo: Repository<ThePost>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  public async getAllPostsRN(page: number) {
    const limit = 3;
    const skip = (page - 1) * limit;

    const posts = await this.postRepo.find({
      where: { published: false },
      relations: ['user', 'comments', 'reaction', 'savePosts'],
      order: {
        publishedAt: 'DESC',
      },
      take: limit, // عدد النتائج
      skip: skip, // تخطي النتائج السابقة
    });

    return { no: posts.length, posts: posts };
  }

  public async getAllPostsRY(page: number) {
    const limit = 3;
    const skip = (page - 1) * limit;

    const posts = await this.postRepo.find({
      where: { published: true },
      relations: ['user', 'comments', 'reaction', 'savePosts'],
      order: {
        publishedAt: 'DESC',
      },
      take: limit, // عدد النتائج
      skip: skip, // تخطي النتائج السابقة
    });

    return { no: posts.length, posts: posts };
  }

  public async getAllPostsWithFeel(feel: string, page: number) {
    const limit = 3;
    const skip = (page - 1) * limit;

    const posts = await this.postRepo.find({
      where: { feel: feel, published: true },
      relations: ['user', 'comments', 'reaction', 'savePosts'],
      order: {
        publishedAt: 'DESC', // 🔥 ترتيب عكسي
      },
      take: limit, // عدد النتائج
      skip: skip, // تخطي النتائج السابقة
    });

    return { no: posts.length, posts: posts };
  }

  public async getPostsCountOfUser(userId: number) {
    const user = await this.userRepo.exists({
      where: { id: userId },
      relations: ['posts'],
    });

    if (!user) throw new NotFoundException('User not found');
    const visiblePostsCount = await this.postRepo.count({
      where: { user: { id: userId }, isVisible: true, published: true },
    });
    const unVisiblePostsCount = await this.postRepo.count({
      where: { user: { id: userId }, isVisible: false, published: true },
    });

    return { vp: visiblePostsCount, uvp: unVisiblePostsCount };
  }

  public async getPostsOfUser(userId: number) {
    const user = await this.userRepo.exists({
      where: { id: userId },
      relations: ['posts', 'comments', 'reaction', 'replays'],
    });

    if (user === false) throw new NotFoundException('User not found');

    const post = await this.postRepo.find({
      where: { user: { id: userId }, isVisible: true },
      relations: ['user', 'comments', 'reaction'],
      order: {
        createdAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });

    if (post === null) throw new NotFoundException('post not found !');

    return post;
  }

  public async getHiddenPostsOfUser(userId: number) {
    const user = await this.userRepo.exists({
      where: { id: userId },
      relations: ['posts', 'comments', 'reaction', 'replays'],
    });

    if (user === false) throw new NotFoundException('User not found');

    const posts = await this.postRepo.find({
      where: { user: { id: userId }, isVisible: false, published: true },
      relations: ['user', 'comments', 'reaction'],
      order: {
        createdAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });

    if (posts === null) throw new NotFoundException('post not found !');

    return posts;
  }

  public async getSinglePost(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'comments', 'reaction', 'savePosts'],
    });

    if (post === null) throw new NotFoundException('post not found !');

    return post;
  }

  public async createPost(userId: number, dto: CreatePostDTO) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // 2️⃣ انشاء الـ Post Entity
    const newPost = this.postRepo.create({ ...dto, user: user });

    // 3️⃣ حفظ الـ Post
    await this.postRepo.save(newPost);

    // 4️⃣ ارجاع الـ Post
    return newPost;
  }

  public async updatePost(userId: number, id: number, dto: UpdatePostDTO) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'comments', 'reaction', 'savePosts'],
    });
    if (post === null) throw new NotFoundException('post is already deleted !');
    if (post.user.id !== userId)
      throw new UnauthorizedException('You cant edit tis post');

    // دمج التغييرات
    Object.assign(post, dto);
    const updatedPost = await this.postRepo.save(post);

    return updatedPost;
  }

  public async deletePost(userId: number, id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (post === null) throw new NotFoundException('post is already deleted !');

    if (post.user.id !== userId && user.isAdmin === false)
      throw new UnauthorizedException('You cant delete tis post');

    await this.postRepo.remove(post);
    return { message: 'Post deleted ' };
  }

  public async publishThePost(userId: number, postId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user === null) throw new NotFoundException('user not found');
    if (user.isAdmin === false) throw new ForbiddenException('admin only');

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('post not found');

    if (post.published) {
      throw new BadRequestException('post already published');
    }

    post.published = true;
    post.publishedAt = new Date();

    await this.postRepo.save(post);
  }
}
