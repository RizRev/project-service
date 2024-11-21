import { Entity, Column, OneToOne, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Kost } from "./kost";

@Entity()
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  area: string;

  @Column({ default: false })
  bathroomInside: string;

  @Column()
  electricity: string;

  @Column()
  wifi: string;

  @Column()
  bed: string;

  @Column({ default: false })
  ac?: boolean;

  @Column({ default: false })
  tv?: boolean;

  @Column({ default: false })
  refrigerator?: boolean;

  @Column({ default: false })
  wastafel?: boolean;

  @Column({ nullable: true })
  galery?: string;

  @ManyToOne(() => Kost, (kost) => kost.rooms, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "kost_id" })
  kost: Kost;
}
