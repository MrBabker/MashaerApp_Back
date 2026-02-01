import { Comment } from '../comments/comments.entity';
import { TheReaction } from '../Reactions/Reactions.entity';
import { SavePost } from '../savePosts/savePost.entity';
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

@Entity('posts')
export class ThePost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, nullable: false })
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

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Comment, (comments) => comments.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @OneToMany(() => TheReaction, (reaction) => reaction.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reaction: TheReaction[];

  @OneToMany(() => SavePost, (savePosts) => savePosts.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  savePosts: SavePost[];
}
