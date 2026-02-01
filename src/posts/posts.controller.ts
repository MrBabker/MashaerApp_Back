import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThePost } from './posts.Aentity';
import { User } from 'src/users/users.aentites';
import { AuthGuard } from 'src/users/gaurds/authUser.guard';
import { CurrntDecorator } from 'src/users/decoders/currentUser.decoder';
import type { JWT_Payload } from 'src/utils';
import { CreatePostDTO } from './DTOs/CreatePost.DTO';
import { PostsService } from './posts.service';
import { UpdatePostDTO } from './DTOs/UpdatePost.DTO';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('posts')
export class PostsController {
  constructor(
    @InjectRepository(ThePost) private readonly postRepo: Repository<ThePost>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly postServices: PostsService,
  ) {}

  @Get('all/N/:page')
  public async GetAllPostsN(@Param('page', ParseIntPipe) pageno: number) {
    return this.postServices.getAllPostsRN(pageno);
  }

  @Get('all/Y/:page')
  public async GetAllPostsY(@Param('page', ParseIntPipe) pageno: number) {
    return this.postServices.getAllPostsRY(pageno);
  }

  @Get('user/hidden')
  @UseGuards(AuthGuard)
  public async GetHiddenPostsOfUser(@CurrntDecorator() payload: JWT_Payload) {
    return this.postServices.getHiddenPostsOfUser(payload.id);
  }

  @Get('feel/:feel/:page')
  public async GetAllPostsWithFeel(
    @Param('feel') feel: string,
    @Param('page', ParseIntPipe) pageno: number,
  ) {
    return this.postServices.getAllPostsWithFeel(feel, pageno);
  }

  @Get(':id')
  public async GetSinglePost(@Param('id', ParseIntPipe) id: number) {
    return this.postServices.getSinglePost(id);
  }

  @Get('user/count/:id')
  public async GetPostsCountsOfUser(@Param('id', ParseIntPipe) userId: number) {
    return this.postServices.getPostsCountOfUser(userId);
  }
  @Get('user/:id')
  public async GetPostsOfUser(@Param('id', ParseIntPipe) userId: number) {
    return this.postServices.getPostsOfUser(userId);
  }

  @Post('create')
  @UseGuards(AuthGuard)
  public async CreatePost(
    @CurrntDecorator() payload: JWT_Payload,
    @Body() dto: CreatePostDTO,
  ) {
    return this.postServices.createPost(payload.id, dto);
  }

  @Put('edit:id')
  @UseGuards(AuthGuard)
  public async UpdatePost(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDTO,
  ) {
    return this.postServices.updatePost(payload.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async DeletePost(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postServices.deletePost(payload.id, id);
  }

  @Put('pup/:id')
  @UseGuards(AuthGuard)
  public async PublishComment(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postServices.publishThePost(payload.id, postId);
  }
}
