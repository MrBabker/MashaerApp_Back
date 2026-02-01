import { Comment } from 'src/comments/comments.Aentity';
import { TheReaction } from 'src/Reactions/Reactions.Aentity';
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

@Entity('replays')
export class TheReplay {
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

  @Column({ default: false })
  published: boolean;

  @Column({ nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replays, {
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @OneToMany(() => TheReaction, (reaction) => reaction.replay, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reaction: TheReaction[];
}
