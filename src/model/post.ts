import { Entity, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class Post {
  @Column("uuid", { primary: true })
  id: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
