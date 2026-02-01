import { Comment } from 'src/comments/comments.Aentity';
import { User } from 'src/users/users.aentites';
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
