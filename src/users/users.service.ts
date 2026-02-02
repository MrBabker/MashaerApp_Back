import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './DTOs/CreateUser.DTO';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './DTOs/LoginUser.DTO';
import { JWT_Payload } from '../utils';
import { UpdateUserDTO } from './DTOs/UpdateUser.DTO';
import { VisibleUserDTO } from './DTOs/VisibleUser.DTO';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepos: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async GetAllUsers() {
    const users = await this.userRepos.find({
      order: {
        createdAt: 'DESC', // 🔥 ترتيب عكسي
      },
    });
    return users;
  }

  public async GetSingleUser(id: number) {
    return await this.userRepos.findOne({
      where: { id },
      relations: ['posts'],
    });
  }
  public async GetCurrentUser(id: number) {
    return this.userRepos.findOne({ where: { id: id } });
  }

  public async createUser(dto: CreateUserDTO) {
    dto.username = dto.name.toLowerCase();
    dto.usertag = dto.tag.toLowerCase();
    // 1️⃣ تحقق هل المستخدم موجود
    const existingUser = await this.userRepos.findOne({
      where: [
        { email: dto.email.toLowerCase() },
        { tag: dto.usertag.toLowerCase() },
      ],
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    try {
      // 2️⃣ تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // 3️⃣ إنشاء المستخدم
      const user = this.userRepos.create({
        ...dto,
        password: hashedPassword,
      });

      // 4️⃣ حفظ في الداتابيس
      const savedUser = await this.userRepos.save(user);

      const payload = {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      };
      const token = this.jwtService.sign(payload);

      return { user: savedUser, token };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  public async loginUser(dto: LoginUserDTO) {
    const user = await this.userRepos.findOne({
      where: [
        { email: dto.email.toLowerCase() },
        { username: dto.email.toLowerCase() },
        { usertag: dto.email.toLowerCase() },
      ],
      // relations: ['posts', 'comments', 'replays', 'reaction'],
    });
    if (user === null) throw new NotFoundException('invalid email or password');

    if (user.isBan) throw new BadRequestException('this account is BAN !');

    try {
      const dtoPass = await bcrypt.compare(dto.password, user.password);
      if (dtoPass === false)
        throw new UnauthorizedException('invalid email or password');

      const payload: JWT_Payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        tag: user.tag,
        usertag: user.usertag,
        image: user.image,
        isAdmin: user.isAdmin,
        isVisible: user.isVisible,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: user.posts,
        comments: user.comments,
        replays: user.replays,
        reaction: user.reaction,
      };
      const token = this.jwtService.sign(payload);

      return { message: 'Logged', user: user, token };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  public async updateUser(id: number, dto: UpdateUserDTO) {
    const user = await this.userRepos.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // تحديث الحقول المسموح بها فقط
    if (dto.name !== undefined) user.name = dto.name.toLowerCase();
    if (dto.email !== undefined) user.email = dto.email.toLowerCase();
    if (dto.image !== undefined) user.image = dto.image;

    try {
      const updatedUser = await this.userRepos.save(user);

      // إرجاع بيانات نظيفة
      const payload: JWT_Payload = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        username: updatedUser.username,
        tag: updatedUser.tag,
        usertag: updatedUser.usertag,
        image: updatedUser.image,
        isAdmin: updatedUser.isAdmin,
        isVisible: updatedUser.isVisible,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        posts: updatedUser.posts,
        comments: updatedUser.comments,
        replays: updatedUser.replays,
        reaction: updatedUser.reaction,
      };
      const token = this.jwtService.sign(payload);

      return { message: 'Logged', user: user, token };
    } catch (error) {
      // Email duplicate مثلاً
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  public async deleteUser(id: number) {
    const result = await this.userRepos.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Account not found!');
    }

    return { message: 'Account deleted successfully', userId: id };
  }

  public async visibleUser(id: number, dto: VisibleUserDTO) {
    const user = await this.userRepos.findOne({ where: { id } });

    if (user === null) throw new NotFoundException('Account not found');

    if (dto.isVisible === undefined) {
      throw new BadRequestException('isVisible is required');
    }

    user.isVisible = dto.isVisible;

    const newUser = await this.userRepos.save(user);

    return { isVisible: newUser.isVisible };
  }
}
