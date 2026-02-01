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
import { CommentsService } from './comments.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/users/gaurds/authUser.guard';
import { CurrntDecorator } from 'src/users/decoders/currentUser.decoder';
import type { JWT_Payload } from 'src/utils';
import { CreateCommentDTO } from './DTOs/CreateComment.DTO';
import { UpdateCommentDTO } from './DTOs/UpdateComment.DTO';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsServices: CommentsService,
    private readonly jwtServics: JwtService,
  ) {}

  @Get('all/N')
  public async GetAllCommentsRN() {
    return this.commentsServices.getAllCommentsRN();
  }

  @Get('all/Y')
  public async GetAllCommentsRY() {
    return this.commentsServices.getAllCommentsRN();
  }

  @Get('post/:id')
  public async GetCommentsOfPost(@Param('id', ParseIntPipe) id: number) {
    return this.commentsServices.getCommentsOfPost(id);
  }

  @Get(':id')
  public async GetSingleComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentsServices.getSingleComment(id);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  public async CreateComment(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDTO,
  ) {
    return this.commentsServices.createComment(payload.id, postId, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public async UpdateComment(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentDTO,
  ) {
    return this.commentsServices.updateComment(payload.id, commentId, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async DeleteComment(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return this.commentsServices.deleteComment(payload.id, commentId);
  }

  @Put('pup/:id')
  @UseGuards(AuthGuard)
  public async PublishComment(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) commenttId: number,
  ) {
    return this.commentsServices.publishTheComment(payload.id, commenttId);
  }
}
