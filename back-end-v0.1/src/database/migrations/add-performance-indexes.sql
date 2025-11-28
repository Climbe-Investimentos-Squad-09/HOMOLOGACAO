-- Adicionar índices para melhorar performance
-- Execute este script no banco de dados

-- Índices para tabela de usuários
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_situacao ON usuarios(situacao);

-- Índices para tabela de propostas
CREATE INDEX IF NOT EXISTS idx_propostas_empresa ON "Propostas"("idEmpresa");
CREATE INDEX IF NOT EXISTS idx_propostas_emissor ON "Propostas"("idEmissor");
CREATE INDEX IF NOT EXISTS idx_propostas_status ON "Propostas"("statusProposta");
CREATE INDEX IF NOT EXISTS idx_propostas_data_criacao ON "Propostas"("dataCriacao");

-- Índices para tabela de contratos
CREATE INDEX IF NOT EXISTS idx_contratos_proposta ON "Contratos"("idProposta");
CREATE INDEX IF NOT EXISTS idx_contratos_compliance ON "Contratos"("idCompliance");
CREATE INDEX IF NOT EXISTS idx_contratos_status ON "Contratos"("statusContrato");
CREATE INDEX IF NOT EXISTS idx_contratos_data_criacao ON "Contratos"("dataCriacao");

-- Índices para atribuições de propostas
CREATE INDEX IF NOT EXISTS idx_proposta_assignee_proposta ON propostas_atribuicoes("idProposta");
CREATE INDEX IF NOT EXISTS idx_proposta_assignee_usuario ON propostas_atribuicoes("idUsuario");


-- Índices para auditoria
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON "Audits"(entity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON "Audits"(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON "Audits"("userId");
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON "Audits"("createdAt");
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON "Audits"("entityId");

-- Índices para reuniões
CREATE INDEX IF NOT EXISTS idx_reunioes_criador ON reunioes("idCriador");
CREATE INDEX IF NOT EXISTS idx_reunioes_status ON reunioes(status);
CREATE INDEX IF NOT EXISTS idx_reunioes_data_hora ON reunioes("dataHoraInicio");


-- Índices compostos para queries comuns
CREATE INDEX IF NOT EXISTS idx_propostas_empresa_status ON "Propostas"("idEmpresa", "statusProposta");
CREATE INDEX IF NOT EXISTS idx_contratos_status_data ON "Contratos"("statusContrato", "dataCriacao");
CREATE INDEX IF NOT EXISTS idx_audit_entity_action ON "Audits"(entity, action);


-- Analisar tabelas após criar índices
ANALYZE usuarios;
ANALYZE "Propostas";
ANALYZE "Contratos";
ANALYZE "Audits";
ANALYZE reunioes;
ANALYZE propostas_atribuicoes;

