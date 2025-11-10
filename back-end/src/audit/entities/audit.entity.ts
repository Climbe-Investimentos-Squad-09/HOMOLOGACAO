// src/audit/entities/audit.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ASSIGN = 'ASSIGN',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

@Entity('Audits')
export class Audit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  entity!: string;

  @Column({ type: 'varchar', length: 50 })
  action!: string;

  // 🔧 padronizado como string; facilita suportar UUID/ids compostos
  @Column({ type: 'varchar', length: 100, nullable: true })
  entityId!: string | null;

  // 🔧 pode ser nulo (rotas públicas, falhas antes de autenticar)
  @Column({ type: 'int', nullable: true })
  userId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'jsonb', nullable: true })
  before!: any | null;

  @Column({ type: 'jsonb', nullable: true })
  after!: any | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  method!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  path!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  extra!: any | null;
}
