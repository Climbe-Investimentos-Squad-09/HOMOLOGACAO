// src/seeds/seed.ts
import 'dotenv/config';
import { AppDataSource } from '../config/data-source';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

// Entities
import { Permission } from '../modules/permissions/entities/permission.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/user/entities/user.entity';
import { Companies } from '../modules/companies/entities/companies.entity';
import { Proposals, StatusProposta } from '../modules/proposals/entities/proposals.entity';
import { ProposalAssignee } from '../modules/proposals/entities/proposal-assignee.entity';
import { Contract } from '../modules/contracts/entities/contracts.entity';

// Meetings (ajuste caminhos conforme seu projeto: "meeting" ou "reuniao")
import {
  Reuniao,
  ModalidadeReuniao,
  StatusReuniao,
} from '../modules/meetings/entities/meeting.entity';
import {
  ReuniaoParticipante,
  StatusConvite,
} from '../modules/meetings/entities/meeting-member.entity';

// Seeds data
import { PERMISSIONS } from './data/permissions';
import {
  ROLE_SYSADMIN,
  ROLE_COMPLIANCE,
  ROLE_CEO,
  ROLE_CSO,
  ROLE_CMO,
  ROLE_ANALISTA,
  COMPLIANCE_PERMS,
  CEO_PERMS,
  CS_PERMS,
  ANALISTA_PERMS,
} from './data/roles';

// utils
import { upsertUnique } from './utils/upsert';

// enums usuários
import { SituacaoUsuario } from '../modules/user/enums/situacao-usuario-enum.dto';

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

async function main() {
  await AppDataSource.initialize();

  const permRepo = AppDataSource.getRepository(Permission);
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const compRepo = AppDataSource.getRepository(Companies);
  const propRepo = AppDataSource.getRepository(Proposals);
  const propAssRepo = AppDataSource.getRepository(ProposalAssignee);
  const contractRepo = AppDataSource.getRepository(Contract);
  const meetingRepo = AppDataSource.getRepository(Reuniao);
  const meetingMemberRepo = AppDataSource.getRepository(ReuniaoParticipante);

  // 1) Permissões
  for (const p of PERMISSIONS) {
    await upsertUnique(permRepo, { nome: p.nome } as any, { descricao: p.descricao });
  }
  const allPerms = await permRepo.find();
  const permsByName = new Map(allPerms.map((p) => [p.nome, p]));

  // 2) Roles
  const sysAdminRole = await upsertUnique(roleRepo, { nomeCargo: ROLE_SYSADMIN } as any, {});
  const complianceRole = await upsertUnique(roleRepo, { nomeCargo: ROLE_COMPLIANCE } as any, {});
  const ceoRole = await upsertUnique(roleRepo, { nomeCargo: ROLE_CEO } as any, {});
  const csoRole = await upsertUnique(roleRepo, { nomeCargo: ROLE_CSO } as any, {});
  const cmoRole = await upsertUnique(roleRepo, { nomeCargo: ROLE_CMO } as any, {});
  const analistaRole = await upsertUnique(roleRepo, { nomeCargo: ROLE_ANALISTA } as any, {});

  // 3) Vincular permissões às roles
  // SysAdmin: TODAS
  (sysAdminRole as any).permissoes = allPerms;

  // Compliance
  (complianceRole as any).permissoes = COMPLIANCE_PERMS
    .map((n) => permsByName.get(n))
    .filter(Boolean) as Permission[];

  // CEO
  (ceoRole as any).permissoes = CEO_PERMS.map((n) => permsByName.get(n)).filter(Boolean) as Permission[];

  // CSO / CMO
  (csoRole as any).permissoes = CS_PERMS.map((n) => permsByName.get(n)).filter(Boolean) as Permission[];
  (cmoRole as any).permissoes = CS_PERMS.map((n) => permsByName.get(n)).filter(Boolean) as Permission[];

  // Analista
  (analistaRole as any).permissoes = ANALISTA_PERMS.map((n) => permsByName.get(n)).filter(Boolean) as Permission[];

  await roleRepo.save([sysAdminRole, complianceRole, ceoRole, csoRole, cmoRole, analistaRole]);

  // 4) Usuários
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@climbe.local';
  const complEmail = process.env.SEED_COMPLIANCE_EMAIL || 'compliance@climbe.local';
  const ceoEmail = process.env.SEED_CEO_EMAIL || 'ceo@climbe.local';
  const csoEmail = process.env.SEED_CSO_EMAIL || 'cso@climbe.local';
  const cmoEmail = process.env.SEED_CMO_EMAIL || 'cmo@climbe.local';
  const anaEmail = process.env.SEED_ANALISTA_EMAIL || 'analista@climbe.local';

  const admin = await upsertUnique(
    userRepo,
    { email: adminEmail } as any,
    {
      nomeCompleto: 'Sys Admin',
      senha: sha256(process.env.SEED_ADMIN_PASSWORD || 'admin123'),
      situacao: SituacaoUsuario.Ativo,
      cargo: sysAdminRole,
      dataCriacao: new Date(),
      ultimoAcesso: new Date(),
    },
  );

  const compliance = await upsertUnique(
    userRepo,
    { email: complEmail } as any,
    {
      nomeCompleto: 'Compliance',
      senha: sha256(process.env.SEED_COMPLIANCE_PASSWORD || 'compliance123'),
      situacao: SituacaoUsuario.Ativo,
      cargo: complianceRole,
      dataCriacao: new Date(),
      ultimoAcesso: new Date(),
    },
  );

  const ceo = await upsertUnique(
    userRepo,
    { email: ceoEmail } as any,
    {
      nomeCompleto: 'CEO',
      senha: sha256(process.env.SEED_CEO_PASSWORD || 'ceo123'),
      situacao: SituacaoUsuario.Ativo,
      cargo: ceoRole,
      dataCriacao: new Date(),
      ultimoAcesso: new Date(),
    },
  );

  const cso = await upsertUnique(
    userRepo,
    { email: csoEmail } as any,
    {
      nomeCompleto: 'CSO',
      senha: sha256(process.env.SEED_CSO_PASSWORD || 'cso123'),
      situacao: SituacaoUsuario.Ativo,
      cargo: csoRole,
      dataCriacao: new Date(),
      ultimoAcesso: new Date(),
    },
  );

  const cmo = await upsertUnique(
    userRepo,
    { email: cmoEmail } as any,
    {
      nomeCompleto: 'CMO',
      senha: sha256(process.env.SEED_CMO_PASSWORD || 'cmo123'),
      situacao: SituacaoUsuario.Ativo,
      cargo: cmoRole,
      dataCriacao: new Date(),
      ultimoAcesso: new Date(),
    },
  );

  const analista = await upsertUnique(
    userRepo,
    { email: anaEmail } as any,
    {
      nomeCompleto: 'Analista Financeiro',
      senha: sha256(process.env.SEED_ANALISTA_PASSWORD || 'analista123'),
      situacao: SituacaoUsuario.Ativo,
      cargo: analistaRole,
      dataCriacao: new Date(),
      ultimoAcesso: new Date(),
    },
  );

  // 5) Empresa exemplo
  const empresa = await upsertUnique(
    compRepo,
    { email: 'contato@acme.com' } as any,
    {
      razaoSocial: 'ACME S.A.',
      nomeFantasia: 'ACME',
      cnpj: '12.345.678/0001-99',
      endereco: 'Rua Fictícia, 123 - São Paulo/SP',
      telefone: '(11) 99999-9999',
      representanteLegal: 'Maria Souza',
    } as Partial<Companies>,
  );

  // 6) Proposta (em análise) + atribuições (ANALISTA/CSO/CMO)
  const proposta = propRepo.create({
    idEmpresa: (empresa as any).idEmpresa,
    empresa: empresa as any,
    idEmissor: (compliance as any).idUsuario,
    valorProposta: 150000.0,
    prazoValidade: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    statusProposta: StatusProposta.EM_ANALISE,
  });
  const savedProp = await propRepo.save(proposta);

  // Assignees (Unique por proposta+role)
  const pa1 = propAssRepo.create({ proposta: savedProp, usuario: analista as any, role: 'ANALISTA' });
  const pa2 = propAssRepo.create({ proposta: savedProp, usuario: cso as any, role: 'CSO' });
  const pa3 = propAssRepo.create({ proposta: savedProp, usuario: cmo as any, role: 'CMO' });
  await propAssRepo.save([pa1, pa2, pa3]);

  // 7) Aprovar proposta e criar contrato
  savedProp.statusProposta = StatusProposta.APROVADA;
  await propRepo.save(savedProp);

  const contrato = contractRepo.create({
    proposta: savedProp,
    compliance: compliance as any,
    statusContrato: 'Ativo',
  } as any);
  const savedContrato = await contractRepo.save(contrato);

  // 8) Reunião exemplo (remoto) + participante criador
  const inicio = new Date();
  inicio.setHours(inicio.getHours() + 2);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1000);

  const meeting = meetingRepo.create({
    titulo: 'Kickoff ACME',
    pauta: 'Apresentação e escopo inicial',
    dataHoraInicio: inicio,
    dataHoraFim: fim,
    modalidade: ModalidadeReuniao.REMOTO,
    linkRemoto: 'https://meet.google.com/xxx-yyy-zzz',
    status: StatusReuniao.AGENDADA,
    criador: compliance as any,
  });
  const savedMeeting = await meetingRepo.save(meeting);

  const meetingCreator = meetingMemberRepo.create({
    reuniao: savedMeeting,
    usuario: compliance as any,
    statusConvite: StatusConvite.ACEITO,
  });
  await meetingMemberRepo.save(meetingCreator);

  console.log('[seed] OK');
  console.table([
    { role: 'SysAdmin', email: adminEmail },
    { role: 'Compliance', email: complEmail },
    { role: 'CEO', email: ceoEmail },
    { role: 'CSO', email: csoEmail },
    { role: 'CMO', email: cmoEmail },
    { role: 'Analista', email: anaEmail },
  ]);

  await AppDataSource.destroy();
}

main().catch(async (err) => {
  console.error('[seed] ERRO:', err);
  try {
    await AppDataSource.destroy();
  } catch {}
  process.exit(1);
});
