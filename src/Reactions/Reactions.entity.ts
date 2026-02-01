import { Comment } from '../comments/comments.entity';
import { ThePost } from '../posts/posts.entity';
import { TheReplay } from '../Replays/Replays.entity';
import { User } from '../users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reactions')
export class TheReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 150, nullable: false, unique: false })
  type: string;

  @Column({ default: true })
  isVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reaction, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.reaction, {
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @ManyToOne(() => TheReplay, (replay) => replay.reaction, {
    onDelete: 'CASCADE',
  })
  replay: TheReplay;

  @ManyToOne(() => ThePost, (post) => post.reaction, {
    onDelete: 'CASCADE',
  })
  post: ThePost;
}
