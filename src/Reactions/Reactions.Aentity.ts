import { Comment } from 'src/comments/comments.Aentity';
import { ThePost } from 'src/posts/posts.Aentity';
import { TheReplay } from 'src/Replays/Replays.Aentity';
import { User } from 'src/users/users.aentites';
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
