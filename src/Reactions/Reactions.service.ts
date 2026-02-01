import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TheReaction } from './Reactions.entity';
import { Repository } from 'typeorm';
import { CreateReactionDTO } from './DTOs/CreatReaction.DTO';
import { User } from '../users/users.entity';
import { ThePost } from '../posts/posts.entity';
import { Comment } from '../comments/comments.entity';
import { TheReplay } from '../Replays/Replays.entity';
import { UpdateReactionDTO } from './DTOs/UpdateReaction.DTO';
import { ReactionsGateway } from './reactions.gateway';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(TheReaction)
    private readonly reactionRepo: Repository<TheReaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ThePost)
    private readonly postRepo: Repository<ThePost>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(TheReplay)
    private readonly replayRepo: Repository<TheReplay>,
    private readonly gateway: ReactionsGateway,
  ) {}

  public async getAllReactions() {
    return await this.reactionRepo.find({
      relations: ['user', 'comment', 'post', 'replay'],
      order: {
        createdAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }

  public async getReactyionsOfPost(postId: number) {
    const post = await this.postRepo.exists({ where: { id: postId } });
    if (post === false) throw new NotFoundException('post not found');

    return await this.reactionRepo.find({
      where: { post: { id: postId } },
      order: {
        createdAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }

  public async getReactyionsOfComment(commenttId: number) {
    const comment = await this.commentRepo.exists({
      where: { id: commenttId },
    });
    if (comment === false) throw new NotFoundException('comment not found');

    return await this.reactionRepo.find({
      where: { comment: { id: commenttId } },
      order: {
        createdAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
  }

  public async getReactyionsOfReplay(replayId: number) {
    const replay = await this.replayRepo.exists({
      where: { id: replayId },
      order: {
        createdAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
    if (replay === false) throw new NotFoundException('replay not found');

    return await this.reactionRepo.find({ where: { replay: replay } });
  }

  public async getSingleReaction(id: number) {
    const reaction = await this.reactionRepo.findOne({
      where: { id },
      relations: ['user', 'comment'],
    });

    if (reaction === null) throw new NotFoundException('reaction not found !');

    return reaction;
  }

  public async createReactionOfPost(
    userId: number,
    postId: number,
    dto: CreateReactionDTO,
  ) {
    const alreadyReaction = await this.reactionRepo.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (alreadyReaction !== null) {
      await this.reactionRepo.remove(alreadyReaction);

      const reaction = await this.reactionRepo.find({
        where: { post: { id: postId } },
      });
      this.gateway.sendReaction({
        postId,
        userId,
        type: dto.type,
        reaction: reaction,
        action: 'remove',
      });

      return { message: 'reaction deleted' };
    }

    const user = await this.userRepo.exists({ where: { id: userId } });
    if (user === false) throw new NotFoundException('user not found');

    const post = await this.postRepo.exists({ where: { id: postId } });
    if (post === false) throw new NotFoundException('post not found');

    dto.userId = userId;
    const newReaction = this.reactionRepo.create({
      ...dto,
      user: { id: userId },
      post: { id: postId },
    });

    await this.reactionRepo.save(newReaction);

    const reaction = await this.reactionRepo.find({
      where: { post: { id: postId } },
    });
    this.gateway.sendReaction({
      postId,
      userId,
      type: dto.type,

      reaction: reaction,
      action: 'add',
    });
    return newReaction;
  }
  public async createReactionOfComment(
    userId: number,
    commentId: number,
    dto: CreateReactionDTO,
  ) {
    const alreadyReaction = await this.reactionRepo.findOne({
      where: { user: { id: userId }, comment: { id: commentId } },
    });

    if (alreadyReaction !== null) {
      await this.reactionRepo.remove(alreadyReaction);

      this.gateway.sendReaction({
        commentId,
        userId,
        type: dto.type,
      });
      return { message: 'reaction deleted' };
    }

    const user = await this.userRepo.exists({ where: { id: userId } });
    if (user === false) throw new NotFoundException('user not found');

    const comment = await this.commentRepo.exists({
      where: { id: commentId },
    });
    if (comment === false) throw new NotFoundException('comment not found');

    const newReaction = this.reactionRepo.create({
      ...dto,
      user: { id: userId },
      comment: { id: commentId },
    });

    await this.reactionRepo.save(newReaction);

    this.gateway.sendReaction({
      commentId,
      userId,
      type: dto.type,
    });
    return newReaction;
  }
  public async createReactionOfReplay(
    userId: number,
    replayId: number,
    dto: CreateReactionDTO,
  ) {
    const alreadyReaction = await this.reactionRepo.findOne({
      where: { user: { id: userId }, replay: { id: replayId } },
    });

    if (alreadyReaction !== null) {
      await this.reactionRepo.remove(alreadyReaction);

      this.gateway.sendReaction({
        replayId,
        userId,
        type: dto.type,
      });
      return { message: 'reaction deleted' };
    }

    const user = await this.userRepo.exists({ where: { id: userId } });
    if (user === false) throw new NotFoundException('user not found');

    const replay = await this.replayRepo.exists({
      where: { id: replayId },
    });
    if (replay === false) throw new NotFoundException('replay not found');

    const newReaction = this.reactionRepo.create({
      ...dto,
      user: { id: userId },
      replay: { id: replayId },
    });

    await this.reactionRepo.save(newReaction);

    this.gateway.sendReaction({
      replayId,
      userId,
      type: dto.type,
    });
    return newReaction;
  }

  public async updateReaction(
    userId: number,
    id: number,
    dto: UpdateReactionDTO,
  ) {
    const reaction = await this.reactionRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (reaction === null) throw new NotFoundException('reaction not found');

    if (reaction.user.id !== userId)
      throw new UnauthorizedException('you cant edit this reaction');

    Object.assign(reaction, dto);
    const updatedReaction = await this.reactionRepo.save(reaction);

    return updatedReaction;
  }

  public async deleteReaction(userId: number, id: number) {
    const reaction = await this.reactionRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (reaction === null) throw new NotFoundException('reaction not found');

    if (reaction.user.id !== userId)
      throw new UnauthorizedException('you cant delete this reaction');

    await this.reactionRepo.remove(reaction);

    return { message: 'reaction deleted' };
  }
}
