import { Comment } from './comments/comments.Aentity';
import { ThePost } from './posts/posts.Aentity';
import { TheReaction } from './Reactions/Reactions.Aentity';
import { TheReplay } from './Replays/Replays.Aentity';

export const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP';

export const CURRENT_USER_KEY = 'user';

export interface JWT_Payload {
  id: number;
  email: string;
  name: string;
  username: string;
  tag: string;
  usertag: string;
  image: string;
  isAdmin;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  posts: ThePost[];
  comments: Comment[];
  replays: TheReplay[];
  reaction: TheReaction[];
}

export const tokenExpire = '1y';
export const SYNChronize = false;

export enum notificationsTypes {
  comment = 'COMMENT_POST',
  replay = 'REPLY_COMMENT',
  follow = 'FOLLOW',
}
