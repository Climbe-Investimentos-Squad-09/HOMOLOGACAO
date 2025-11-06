// src/config/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';

// ==== ENTITIES (liste explicitamente para evitar erros de metadata no seed) ====
import { Permission } from '../modules/permissions/entities/permission.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/user/entities/user.entity';
import { Companies } from '../modules/companies/entities/companies.entity';

import { Proposals } from '../modules/proposals/entities/proposals.entity';
import { ProposalAssignee } from '../modules/proposals/entities/proposal-assignee.entity';

import { Contract } from '../modules/contracts/entities/contracts.entity';
import { ContractAssignee } from '../modules/contracts/entities/contract-assignee.entity';

import { Audit } from '../audit/entities/audit.entity';

// Meetings
import { Reuniao } from '../modules/meetings/Entities/meeting.entity';
import { ReuniaoParticipante } from '../modules/meetings/Entities/meeting-member.entity';
import { ReuniaoAtividade } from '../modules/meetings/Entities/meeting-activity.entity';

// ==== helpers ====
const required = (name: string): string => {
  const v = process.env[name];
  if (!v || v.trim() === '') {
    throw new Error(`[DB] Missing required env: ${name}`);
  }
  return v;
};

const parseBool = (v?: string) =>
  typeof v === 'string' &&
  ['1', 'true', 'yes', 'on'].includes(v.trim().toLowerCase());

// ==== DataSource p/ SEED (usa .env diretamente) ====
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: required('DB_HOST'),
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: required('DB_USERNAME'),
  password: required('DB_PASSWORD'),
  database: required('DB_NAME'),

  // Liste ENTIDADES explicitamente para evitar "No metadata for X was found"
  entities: [
    Permission,
    Role,
    User,
    Companies,
    Proposals,
    ProposalAssignee,
    Contract,
    ContractAssignee,
    Audit,
    Reuniao,
    ReuniaoParticipante,
    ReuniaoAtividade,
  ],

  // No seed, normalmente deixamos false e aplicamos DDL por migration/SQL.
  // Se estiver prototipando local, você pode mudar para true temporariamente.
  synchronize: parseBool(process.env.TYPEORM_SYNC) ?? false,

  logging: parseBool(process.env.TYPEORM_LOGGING) ?? true,

  // Se usar Postgres com SSL (cloud), habilite abaixo via env:
  ssl: parseBool(process.env.DB_SSL) ? { rejectUnauthorized: false } : false,
});
