import { ThePost } from '../posts/posts.entity';
import { User } from '../users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('saveposts')
export class SavePost {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: number;

  @Index()
  @Column()
  postId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.savePosts, {
    onDelete: 'CASCADE',
  })
  user: User;
  @ManyToOne(() => ThePost, (post) => post.savePosts, {
    onDelete: 'CASCADE',
  })
  post: ThePost;
}
