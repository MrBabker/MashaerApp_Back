import { Comment } from 'src/comments/comments.Aentity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
@Index(['userId', 'createdAt'])
export class TheNotification {
  @PrimaryGeneratedColumn()
  id: number;

  // المستخدم الذي ستظهر له الإشعار
  @Index()
  @Column()
  userId: number;

  // نوع الإشعار
  @Column()
  type: string;
  // مثال: "COMMENT_POST", "REPLY_COMMENT", "LIKE_POST"

  // ID المنشور (لو الإشعار متعلق بمنشور)
  @Column({ nullable: true })
  postId: number;

  // ID التعليق (لو الإشعار متعلق بتعليق)
  @Column({ nullable: true })
  commentId: number;

  // المستخدم الذي قام بالفعل (اللي كتب التعليق مثلا)
  @Column()
  fromUserId: number;

  // نص الإشعار (اختياري)
  @Column({ nullable: true })
  message: string;

  // هل تمت مشاهدة الإشعار
  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
