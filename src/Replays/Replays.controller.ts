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
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/users/gaurds/authUser.guard';
import { CurrntDecorator } from 'src/users/decoders/currentUser.decoder';
import type { JWT_Payload } from 'src/utils';
import { ReplaysService } from './Replays.service';
import { CreateReplayDTO } from './DTOs/CreateReplay.DTO';
import { UpdateReplayDTO } from './DTOs/UpdateReplay.DTO';

@Controller('replays')
export class ReplaysController {
  constructor(
    private readonly replaysServices: ReplaysService,
    private readonly jwtServics: JwtService,
  ) {}

  @Get('all/N')
  public async GetAllReplaysRN() {
    return this.replaysServices.getAllReplaysRN();
  }

  @Get('all/Y')
  public async GetAllReplaysRY() {
    return this.replaysServices.getAllReplaysRY();
  }

  @Get('comment/N/:id')
  public async GetReplaysOfCommentRN(@Param('id', ParseIntPipe) id: number) {
    return this.replaysServices.getReplaysOfCommentRN(id);
  }

  @Get('comment/Y/:id')
  public async GetReplaysOfCommentRY(@Param('id', ParseIntPipe) id: number) {
    return this.replaysServices.getReplaysOfCommentRY(id);
  }

  @Get(':id')
  public async GetSingleReplay(@Param('id', ParseIntPipe) id: number) {
    return this.replaysServices.getSingleReplay(id);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  public async CreateReplay(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: CreateReplayDTO,
  ) {
    return this.replaysServices.createReplay(payload.id, postId, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public async UpdateReplay(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() dto: UpdateReplayDTO,
  ) {
    return this.replaysServices.updateReplay(payload.id, commentId, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async DeleteReplay(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return this.replaysServices.deleteReplay(payload.id, commentId);
  }

  @Put('pup/:id')
  @UseGuards(AuthGuard)
  public async PublishComment(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) replaytId: number,
  ) {
    return this.replaysServices.publishTheReplay(payload.id, replaytId);
  }
}
