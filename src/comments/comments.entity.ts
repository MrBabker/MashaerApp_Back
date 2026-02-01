import { ThePost } from '../posts/posts.entity';
import { TheReaction } from '../Reactions/Reactions.entity';
import { TheReplay } from '../Replays/Replays.entity';
import { User } from '../users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, nullable: true })
  feel: string;

  @Column({ nullable: false })
  subject: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  published: boolean;

  @Column({ nullable: true })
  publishedAt: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => ThePost, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  post: ThePost;

  @OneToMany(() => TheReplay, (replays) => replays.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  replays: TheReplay[];

  @OneToMany(() => TheReaction, (reaction) => reaction.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reaction: TheReaction[];
}
