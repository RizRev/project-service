import { Entity, Column, OneToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { KostFacility } from "./kostFacility";
import { Room } from "./room";

@Entity()
export class Kost {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  galery?: string;

  @OneToOne(() => KostFacility, (kostFacility) => kostFacility.kost, { cascade: true })
  facility?: KostFacility;

  @OneToMany(() => Room, (room) => room.kost)
  rooms?: Room[];
}
