import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TheFollow } from './Follows.Aentity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.aentites';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(TheFollow)
    private readonly followRepo: Repository<TheFollow>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async GetAllFollows() {
    return this.followRepo.find();
  }

  public async GetSingleFollows(id: number) {
    const follow = await this.followRepo.findOne({ where: { id } });
    if (follow === null) throw new NotFoundException('Follows not found');

    return follow;
  }

  public async GetFollowersOfUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user === null) throw new NotFoundException('user not found');

    const follows = await this.followRepo.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    return {
      user: user,
      followings: follows.map((f) => ({
        user: f.following,
      })),
    };
  }

  public async GetFollowingsOfUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user === null) throw new NotFoundException('user not found');

    const follows = await this.followRepo.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });

    return {
      user: user.name,
      followers: follows.map((f) => ({
        user: f.follower,
      })),
    };
  }

  public async GetFollowersFollowingsCountOfUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user === null) throw new NotFoundException('user not found');

    const follows = await this.followRepo.count({
      where: { following: { id: userId } },
      relations: ['follower'],
    });

    const followings = await this.followRepo.count({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    return {
      user: user,
      followers: follows,
      followings: followings,
    };
  }

  public async createFollow(userId: number, otherUserId: number) {
    if (userId === otherUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user === null) throw new NotFoundException('User not found');

    const otherUser = await this.userRepo.findOne({
      where: { id: otherUserId },
    });
    if (otherUser === null) throw new NotFoundException('otherUser not found');

    const alreadyFollow = await this.followRepo.exists({
      where: {
        follower: { id: userId },
        following: { id: otherUserId },
      },
    });

    if (alreadyFollow) {
      throw new BadRequestException('Already following this user');
    }

    const follow = this.followRepo.create({
      follower: user,
      following: otherUser,
    });

    await this.followRepo.save(follow);

    return { message: `You followed ${otherUser.name}` };
  }
  public async checkAlreadyFollow(userId: number, otherUserId: number) {
    return this.followRepo.exists({
      where: {
        follower: { id: userId },
        following: { id: otherUserId },
      },
    });
  }
  public async checkHeFollow(myId: number, hisId: number) {
    return this.followRepo.exists({
      where: {
        follower: { id: hisId },
        following: { id: myId },
      },
    });
  }

  public async unfollowUser(userId: number, otherUserId: number) {
    const result = await this.followRepo.delete({
      follower: { id: userId },
      following: { id: otherUserId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('You are not following this user');
    }

    return { message: 'Unfollowed successfully' };
  }
}
