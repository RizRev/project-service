import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  photo?: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
