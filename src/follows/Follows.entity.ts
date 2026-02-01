import { Comment } from '../comments/comments.entity';
import { User } from '../users/users.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('follows')
export class TheFollow {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (follower) => follower.follower)
  follower: User;
  @ManyToOne(() => User, (following) => following.following)
  following: User;
}
