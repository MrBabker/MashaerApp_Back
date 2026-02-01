import { ThePost } from 'src/posts/posts.Aentity';
import { TheReaction } from 'src/Reactions/Reactions.Aentity';
import { TheReplay } from 'src/Replays/Replays.Aentity';
import { User } from 'src/users/users.aentites';
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
