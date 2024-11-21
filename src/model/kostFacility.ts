import { Entity, Column, ManyToOne, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { User } from "./user";
import { Kost } from "./kost";

@Entity()
export class KostFacility {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  car?: boolean;

  @Column({ nullable: true })
  gateTime?: string;

  @Column({ default: false })
  kitchen?: boolean;

  @Column({ default: false })
  drinkWater?: boolean;

  @Column({ default: false })
  laundry?: boolean;

  @Column({ default: false })
  security?: boolean;

  @Column({ default: false })
  CCTV?: boolean;

  @Column({ nullable: true })
  other?: string;

  @OneToOne(() => Kost, (kost) => kost.facility, { onDelete: "CASCADE" })
  @JoinColumn()
  kost?: Kost;
}
