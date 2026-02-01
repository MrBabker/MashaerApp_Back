import { Exclude } from 'class-transformer';
import { Comment } from '../comments/comments.entity';
import { TheFollow } from '../follows/Follows.entity';
import { ThePost } from '../posts/posts.entity';
import { TheReaction } from '../Reactions/Reactions.entity';
import { TheReplay } from '../Replays/Replays.entity';
import { SavePost } from '../savePosts/savePost.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, nullable: false })
  name: string;

  @Column({ length: 255, unique: true, nullable: false })
  tag: string;

  @Column({ length: 150, nullable: true })
  username: string;

  @Column({ length: 255, nullable: true })
  usertag: string;

  @Index()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  image: string;

  @Exclude()
  @Column({ length: 255, nullable: false })
  password: string;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: false })
  isValidate: boolean;

  @Exclude()
  @Column({ nullable: true, default: null })
  validateToken: string;

  @Exclude()
  @Column({ nullable: true, default: null })
  resetPassToken: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ default: 'google' })
  provider: 'local' | 'google';

  @Column({ default: false })
  isBan: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ThePost, (post) => post.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  posts: ThePost[];

  @OneToMany(() => Comment, (comments) => comments.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @OneToMany(() => TheReplay, (replays) => replays.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  replays: TheReplay[];

  @OneToMany(() => TheReaction, (reaction) => reaction.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reaction: TheReaction[];

  @OneToMany(() => TheFollow, (follows) => follows.follower, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  follower: TheReaction[];

  @OneToMany(() => TheFollow, (following) => following.following, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  following: TheReaction[];

  @OneToMany(() => SavePost, (savePosts) => savePosts.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  savePosts: SavePost[];
}
