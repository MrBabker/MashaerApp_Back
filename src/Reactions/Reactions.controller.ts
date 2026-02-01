import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { ReactionsService } from './Reactions.service';
import { AuthGuard } from '../users/gaurds/authUser.guard';
import { CurrntDecorator } from '../users/decoders/currentUser.decoder';
import type { JWT_Payload } from '../utils';
import { CreateReactionDTO } from './DTOs/CreatReaction.DTO';
import { UpdateReactionDTO } from './DTOs/UpdateReaction.DTO';

@Controller('reactions')
export class ReactionsController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly reactionServices: ReactionsService,
  ) {}

  @Get('all')
  public async GetAllReactions() {
    return this.reactionServices.getAllReactions();
  }

  @Get('post/:id')
  public async GetReactionsOfPost(@Param('id', ParseIntPipe) id: number) {
    return this.reactionServices.getReactyionsOfPost(id);
  }
  @Get('comment/:id')
  public async GetReactionsOfComment(@Param('id', ParseIntPipe) id: number) {
    return this.reactionServices.getReactyionsOfComment(id);
  }
  @Get('replay/:id')
  public async GetReactionsOfReplay(@Param('id', ParseIntPipe) id: number) {
    return this.reactionServices.getReactyionsOfReplay(id);
  }

  @Get(':id')
  public async GetSingleReaction(@Param('id', ParseIntPipe) id: number) {
    return this.reactionServices.getSingleReaction(id);
  }

  @Post('post/:id')
  @UseGuards(AuthGuard)
  public async CreateReactionOfPost(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: CreateReactionDTO,
  ) {
    return this.reactionServices.createReactionOfPost(payload.id, postId, dto);
  }

  @Post('comment/:id')
  @UseGuards(AuthGuard)
  public async CreateReactionOfComment(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) commenttId: number,
    @Body() dto: CreateReactionDTO,
  ) {
    return this.reactionServices.createReactionOfComment(
      payload.id,
      commenttId,
      dto,
    );
  }

  @Post('replay/:id')
  @UseGuards(AuthGuard)
  public async CreateReactionOfReplay(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) replayId: number,
    @Body() dto: CreateReactionDTO,
  ) {
    return this.reactionServices.createReactionOfReplay(
      payload.id,
      replayId,
      dto,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public async UpdateReaction(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReactionDTO,
  ) {
    return this.reactionServices.updateReaction(payload.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async DeleteReaction(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reactionServices.deleteReaction(payload.id, id);
  }
}
