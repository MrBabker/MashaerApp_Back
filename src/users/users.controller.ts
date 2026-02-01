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
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTOs/CreateUser.DTO';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDTO } from './DTOs/LoginUser.DTO';
import { AuthGuard } from './gaurds/authUser.guard';
import { CurrntDecorator } from './decoders/currentUser.decoder';
import type { JWT_Payload } from '../utils';
import { UpdateUserDTO } from './DTOs/UpdateUser.DTO';
import { VisibleUserDTO } from './DTOs/VisibleUser.DTO';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly userRepos: Repository<User>,
    private readonly usersServics: UsersService,
  ) {}

  @Get('all')
  public async GetAllUsers() {
    return this.usersServics.GetAllUsers();
  }

  @Get(':id')
  public async GetSingleUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersServics.GetSingleUser(id);
  }
  @Get('')
  @UseGuards(AuthGuard)
  public async GetCurrntUser(@CurrntDecorator() payload: JWT_Payload) {
    return this.usersServics.GetCurrentUser(payload.id);
  }

  @Post('create')
  public async CreateUser(@Body() dto: CreateUserDTO) {
    return this.usersServics.createUser(dto);
  }

  @Post('login')
  public async LoginUser(@Body() dto: LoginUserDTO) {
    return this.usersServics.loginUser(dto);
  }

  @Put('update')
  @UseGuards(AuthGuard)
  public async UpdateUser(
    @CurrntDecorator() payload: JWT_Payload,
    @Body() dto: UpdateUserDTO,
  ) {
    return this.usersServics.updateUser(payload.id, dto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  public async DeleteUser(@CurrntDecorator() payload: JWT_Payload) {
    return this.usersServics.deleteUser(payload.id);
  }

  @Put('vis')
  @UseGuards(AuthGuard)
  public async VisibleUser(
    @CurrntDecorator() payload: JWT_Payload,
    @Body() dto: VisibleUserDTO,
  ) {
    return this.usersServics.visibleUser(payload.id, dto);
  }
}
