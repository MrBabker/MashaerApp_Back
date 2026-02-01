import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { Repository } from 'typeorm';
import { ThePost } from '../posts/posts.entity';
import { CreateCommentDTO } from './DTOs/CreateComment.DTO';
import { User } from '../users/users.entity';
import { UpdateCommentDTO } from './DTOs/UpdateComment.DTO';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(ThePost)
    private readonly postRepo: Repository<ThePost>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async getAllCommentsRN() {
    return await this.commentRepo.find({
      where: { published: false },
      relations: ['user', 'post', 'reaction', 'replays'],
      order: {
        publishedAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }

  public async getAllCommentsRY() {
    return await this.commentRepo.find({
      where: { published: true },
      relations: ['user', 'post', 'reaction', 'replays'],
      order: {
        publishedAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }

  public async getCommentsOfPost(postId: number) {
    const post = await this.postRepo.exists({
      where: { id: postId, published: true },
    });
    if (post === false) throw new NotFoundException('post not found');

    return await this.commentRepo.find({
      where: { post: { id: postId }, published: true },
      relations: ['user', 'post', 'reaction', 'replays'],
      order: {
        publishedAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }

  public async getSingleComment(id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'post', 'reaction', 'replays'],
    });
    if (comment === null) throw new NotFoundException('comment not found');

    return comment;
  }

  public async createComment(
    userId: number,
    postId: number,
    dto: CreateCommentDTO,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user === null) throw new NotFoundException('user not found');

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (post === null) throw new NotFoundException('post not found');

    const newComment = this.commentRepo.create({
      ...dto,
      user: user,
      post: post,
    });

    await this.commentRepo.save(newComment);

    return newComment;
  }

  public async updateComment(
    userId: number,
    id: number,
    dto: UpdateCommentDTO,
  ) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'post', 'reaction', 'replays'],
    });
    if (comment === null) throw new NotFoundException('comment not found');

    if (comment.user.id !== userId)
      throw new UnauthorizedException('you cant edit this comment');

    Object.assign(comment, dto);
    const updatedComment = await this.commentRepo.save(comment);

    return updatedComment;
  }

  public async deleteComment(userId: number, id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user === null) throw new NotFoundException('user not found');

    if (comment === null) throw new NotFoundException('comment not found');

    if (comment.user.id !== userId && user.isAdmin === false)
      throw new UnauthorizedException('you cant delete this comment');

    await this.commentRepo.remove(comment);

    return { message: 'comment deleted' };
  }

  public async publishTheComment(userId: number, commentId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user === null) throw new NotFoundException('user not found');
    if (user.isAdmin === false) throw new ForbiddenException('admin only');

    const coment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!coment) throw new NotFoundException('coment not found');

    if (coment.published) {
      throw new BadRequestException('coment already published');
    }

    coment.published = true;
    coment.publishedAt = new Date();

    await this.commentRepo.save(coment);
  }
}
