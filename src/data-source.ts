import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/users.aentites';
import { ThePost } from './posts/posts.Aentity';
import { Comment } from './comments/comments.Aentity';
import { TheReplay } from './Replays/Replays.Aentity';
import { TheReaction } from './Reactions/Reactions.Aentity';
import { TheFollow } from './follows/Follows.Aentity';
import { TheNotification } from './norifications/notification.Aentity';
import { SavePost } from './savePosts/savePost.Aentity';

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  entities: [
    User,
    ThePost,
    Comment,
    TheReplay,
    TheReaction,
    TheFollow,
    TheNotification,
    SavePost,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});
