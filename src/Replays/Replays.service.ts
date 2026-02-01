import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.aentites';
import { TheReplay } from './Replays.Aentity';
import { Comment } from 'src/comments/comments.Aentity';
import { CreateReplayDTO } from './DTOs/CreateReplay.DTO';
import { UpdateReplayDTO } from './DTOs/UpdateReplay.DTO';

@Injectable()
export class ReplaysService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(TheReplay)
    private readonly replayRepo: Repository<TheReplay>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async getAllReplaysRY() {
    return await this.replayRepo.find({
      where: { published: true },
      relations: ['user', 'comment', 'reaction'],
      order: {
        publishedAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }

  public async getAllReplaysRN() {
    return await this.replayRepo.find({
      where: { published: false },
      relations: ['user', 'comment', 'reaction'],
      order: {
        publishedAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }
  public async getReplaysOfCommentRN(commentId: number) {
    const comment = await this.commentRepo.exists({
      where: { id: commentId },
      relations: ['user', 'replays'],
    });
    if (comment === null) throw new NotFoundException('comment not found');

    return await this.replayRepo.find({
      where: { comment: { id: commentId }, published: false },
      relations: ['user', 'comment', 'reaction'],
      order: {
        publishedAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }

  public async getReplaysOfCommentRY(commentId: number) {
    const comment = await this.commentRepo.exists({
      where: { id: commentId },
      relations: ['user', 'replays'],
    });
    if (comment === null) throw new NotFoundException('comment not found');

    return await this.replayRepo.find({
      where: { comment: { id: commentId }, published: true },
      relations: ['user', 'comment', 'reaction'],
      order: {
        publishedAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }

  public async getSingleReplay(id: number) {
    const replay = await this.replayRepo.findOne({
      where: { id },
      relations: ['user', 'comment', 'reaction'],
    });
    if (replay === null) throw new NotFoundException('replay not found');

    return replay;
  }

  public async createReplay(
    userId: number,
    commentId: number,
    dto: CreateReplayDTO,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (user === null) throw new NotFoundException('user not found');

    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user', 'replays'],
    });
    if (comment === null) throw new NotFoundException('comment not found');

    const newReplay = this.replayRepo.create({
      ...dto,
      user: user,
      comment: comment,
    });

    await this.replayRepo.save(newReplay);

    return newReplay;
  }

  public async updateReplay(userId: number, id: number, dto: UpdateReplayDTO) {
    const replay = await this.replayRepo.findOne({
      where: { id },
      relations: ['user', 'comment', 'reaction'],
    });
    if (replay === null) throw new NotFoundException('replay not found');

    if (replay.user.id !== userId)
      throw new UnauthorizedException('you cant edit this replay');

    Object.assign(replay, dto);
    const updatedReplay = await this.replayRepo.save(replay);

    return updatedReplay;
  }

  public async deleteReplay(userId: number, id: number) {
    const replay = await this.replayRepo.findOne({
      where: { id },
      relations: ['user', 'comment', 'reaction'],
    });
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (user === null) throw new NotFoundException('user not found');

    if (replay === null) throw new NotFoundException('replay not found');

    if (replay.user.id !== userId && user.isAdmin === false)
      throw new UnauthorizedException('you cant delete this replay');

    await this.replayRepo.remove(replay);

    return { message: 'replay deleted' };
  }

  public async publishTheReplay(userId: number, replayId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user === null) throw new NotFoundException('user not found');
    if (user.isAdmin === false) throw new ForbiddenException('admin only');

    const replay = await this.replayRepo.findOne({ where: { id: replayId } });
    if (!replay) throw new NotFoundException('replay not found');

    if (replay.published) {
      throw new BadRequestException('replay already published');
    }

    replay.published = true;
    replay.publishedAt = new Date();

    await this.replayRepo.save(replay);
  }
}
