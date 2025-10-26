import { IsEmail } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Role } from "../../roles/entities/role.entity";

@Entity("Usuarios")
export class User {
  @PrimaryGeneratedColumn()
  idUsuario!: number;

  @Column()
  nomeCompleto!: string;

  @Column({ nullable: true })
  senha?: string;

  @IsEmail()
  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  idCargo?: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dataCriacao!: Date;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "idCargo" })
  cargo?: Role;
}
