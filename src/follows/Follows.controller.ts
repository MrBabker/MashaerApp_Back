import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FollowsService } from './Follows.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../users/gaurds/authUser.guard';
import { CurrntDecorator } from '../users/decoders/currentUser.decoder';
import type { JWT_Payload } from '../utils';

@Controller('follows')
export class FollowsController {
  constructor(
    private readonly followsService: FollowsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('all')
  public async GetAllFollows() {
    return this.followsService.GetAllFollows();
  }

  @Get(':id')
  public async GetSingleFollow(@Param('id', ParseIntPipe) id: number) {
    return this.followsService.GetSingleFollows(id);
  }

  @Get('follower/:id')
  public async GetFollowersOfUser(@Param('id', ParseIntPipe) id: number) {
    return this.followsService.GetFollowersOfUser(id);
  }

  @Get('following/:id')
  public async GetFollowingsOfUser(@Param('id', ParseIntPipe) id: number) {
    return this.followsService.GetFollowingsOfUser(id);
  }
  @Get('counts/:id')
  public async GetFollowersFollowingsCountOfUser(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.followsService.GetFollowersFollowingsCountOfUser(id);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  public async CreateFollow(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.followsService.createFollow(payload.id, id);
  }
  @Get('check/:id')
  @UseGuards(AuthGuard)
  public async CheckAlreadyFollow(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.followsService.checkAlreadyFollow(payload.id, id);
  }
  @Get('checkhe/:id')
  @UseGuards(AuthGuard)
  public async CheckHeFollow(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.followsService.checkHeFollow(payload.id, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async DeleteFollow(
    @CurrntDecorator() payload: JWT_Payload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.followsService.unfollowUser(payload.id, id);
  }
}
