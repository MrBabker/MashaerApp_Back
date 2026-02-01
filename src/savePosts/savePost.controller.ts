import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SavePostService } from './savePost.service';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { ThePost } from '../posts/posts.entity';
import { SavePost } from './savePost.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '../users/gaurds/authUser.guard';
import { CurrntDecorator } from '../users/decoders/currentUser.decoder';
import type { JWT_Payload } from '../utils';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('savepost')
export class SavePostController {
  constructor(
    private readonly saveServices: SavePostService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ThePost)
    private readonly postRepo: Repository<ThePost>,
    @InjectRepository(SavePost)
    private readonly savePostsRepo: Repository<SavePost>,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  public async GetSavedosts(@CurrntDecorator() payload: JWT_Payload) {
    return this.saveServices.getSavedPosts(payload.id);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  public async SavePost(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.saveServices.savePost(payload.id, postId);
  }
}
