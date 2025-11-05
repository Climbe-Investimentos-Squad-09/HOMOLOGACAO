// src/seeds/data/permissions.ts
export const PERMISSIONS: { nome: string; descricao: string }[] = [
  // contratos
  { nome: 'contratos:visualizar', descricao: 'Listar/consultar contratos' },
  { nome: 'contratos:criar', descricao: 'Criar contrato' },
  { nome: 'contratos:editar', descricao: 'Editar contrato' },
  { nome: 'contratos:excluir', descricao: 'Excluir contrato' },
  { nome: 'contratos:aplicar_complexidade', descricao: 'Aplicar nível de complexidade' },

  // cargos
  { nome: 'cargos:visualizar', descricao: 'Listar/consultar cargos' },
  { nome: 'cargos:criar', descricao: 'Criar cargo' },
  { nome: 'cargos:editar', descricao: 'Editar cargo' },
  { nome: 'cargos:excluir', descricao: 'Excluir cargo' },

  // documentos jurídicos
  { nome: 'documentos_juridicos:visualizar', descricao: 'Listar/consultar docs jurídicos' },
  { nome: 'documentos_juridicos:criar', descricao: 'Criar docs jurídicos' },
  { nome: 'documentos_juridicos:editar', descricao: 'Editar docs jurídicos' },
  { nome: 'documentos_juridicos:excluir', descricao: 'Excluir docs jurídicos' },

  // planilha
  { nome: 'planilha:edicao_restrita', descricao: 'Pode solicitar e fazer edição restrita' },

  // reuniões (meetings)
  { nome: 'reunioes:visualizar', descricao: 'Listar/consultar reuniões' },
  { nome: 'reunioes:agendar', descricao: 'Criar reuniões' },
  { nome: 'reunioes:editar', descricao: 'Editar reuniões' },
  { nome: 'reunioes:excluir', descricao: 'Excluir reuniões' },
  { nome: 'reunioes:convidar', descricao: 'Convidar participantes' },
  { nome: 'reunioes:criar_atividade', descricao: 'Criar atividades nas reuniões' },

  // relatórios
  { nome: 'relatorios:visualizar', descricao: 'Listar/consultar relatórios' },
  { nome: 'relatorios:criar', descricao: 'Criar relatórios' },
  { nome: 'relatorios:editar', descricao: 'Editar relatórios' },
  { nome: 'relatorios:excluir', descricao: 'Excluir relatórios' },

  // arquivos
  { nome: 'arquivos:upload', descricao: 'Fazer upload de arquivos' },
  { nome: 'arquivos:download', descricao: 'Fazer download de arquivos' },

  // propostas (úteis para o módulo já implementado)
  { nome: 'propostas:visualizar', descricao: 'Listar/consultar propostas' },
  { nome: 'propostas:criar', descricao: 'Criar proposta' },
  { nome: 'propostas:editar', descricao: 'Editar proposta' },
  { nome: 'propostas:excluir', descricao: 'Excluir proposta' },
  { nome: 'propostas:alterar_status', descricao: 'Alterar status da proposta' },
];
