-- ==============================================================
-- SCRIPT DE ATUALIZAÇÃO DA TABELA CONFIGURACOES E DADOS DE COLETA
-- Execute este script no SQL Editor do seu painel Supabase
-- ==============================================================

-- 1. Adiciona as colunas de Coleta na tabela de configuracoes caso ainda não existam
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS coleta_razao_social TEXT;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS coleta_cnpj TEXT;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS coleta_endereco TEXT;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS coleta_cidade_uf TEXT;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS coleta_cep TEXT;

-- 2. Habilita RLS na tabela configuracoes
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- 3. Atualiza as políticas de RLS para permitir que os administradores salvem as configurações
DROP POLICY IF EXISTS "Usuários podem ver todas configurações" ON configuracoes;
CREATE POLICY "Usuários podem ver todas configurações" ON configuracoes
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuários podem inserir configurações" ON configuracoes;
CREATE POLICY "Usuários podem inserir configurações" ON configuracoes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM permissoes_usuarios 
      WHERE LOWER(email) = LOWER(auth.jwt()->>'email') 
        AND (pode_acessar_config = true OR is_admin = true)
    )
  );

DROP POLICY IF EXISTS "Usuários podem atualizar configurações" ON configuracoes;
CREATE POLICY "Usuários podem atualizar configurações" ON configuracoes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM permissoes_usuarios 
      WHERE LOWER(email) = LOWER(auth.jwt()->>'email') 
        AND (pode_acessar_config = true OR is_admin = true)
    )
  );
