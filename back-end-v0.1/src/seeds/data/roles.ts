// src/seeds/data/roles.ts
export const ROLE_SYSADMIN = 'SysAdmin';
export const ROLE_COMPLIANCE = 'Compliance';
export const ROLE_CEO = 'CEO';
export const ROLE_CSO = 'CSO';
export const ROLE_CMO = 'CMO';
export const ROLE_ANALISTA = 'Analista Financeiro';

// Compliance com o escopo que você definiu
export const COMPLIANCE_PERMS = [
  'contratos:visualizar',
  'contratos:criar',
  'contratos:editar',
  'contratos:excluir',
  'cargos:visualizar',
  'documentos_juridicos:visualizar',
  'documentos_juridicos:criar',
  'documentos_juridicos:editar',
  'documentos_juridicos:excluir',
  'contratos:aplicar_complexidade',
  'planilha:edicao_restrita',
  'reunioes:visualizar',
  'relatorios:visualizar',
  'relatorios:criar',
  'relatorios:editar',
  'relatorios:excluir',
  'arquivos:upload',
  'arquivos:download',
  'propostas:visualizar',
  'propostas:criar',
  'propostas:editar',
  'propostas:excluir',
  'propostas:alterar_status',
  'usuarios:visualizar',
  'usuarios:criar',
  'usuarios:editar',
  'usuarios:excluir',
  'permissoes:visualizar',
];

// CEO: amplo, mas um pouco abaixo do SysAdmin
export const CEO_PERMS = [
  ...COMPLIANCE_PERMS,
  'reunioes:agendar',
  'reunioes:editar',
  'reunioes:excluir',
  'reunioes:convidar',
  'reunioes:criar_atividade',
];

// CSO/CMO: foco em visualizar e propostas
export const CS_PERMS = [
  'reunioes:visualizar',
  'propostas:visualizar',
  'documentos_juridicos:visualizar',
  'arquivos:download',
];

// Analista: básico + propostas atribuídas via regra de negócio
export const ANALISTA_PERMS = [
  'reunioes:visualizar',
  'propostas:visualizar',
  'documentos_juridicos:visualizar',
  'arquivos:download',
];
