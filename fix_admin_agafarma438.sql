-- ==============================================================
-- SCRIPT DEFINITIVO DE PERMISSÕES E ADMINISTRAÇÃO (SUPABASE)
-- Execute no SQL Editor do seu projeto Supabase
-- ==============================================================

-- 1. Garante que todas as colunas necessárias existam na tabela (sem risco de erro)
ALTER TABLE permissoes_usuarios ADD COLUMN IF NOT EXISTS pode_acessar_premio BOOLEAN DEFAULT true;
ALTER TABLE permissoes_usuarios ADD COLUMN IF NOT EXISTS pode_acessar_config BOOLEAN DEFAULT false;
ALTER TABLE permissoes_usuarios ADD COLUMN IF NOT EXISTS pode_acessar_orcamentos BOOLEAN DEFAULT false;
ALTER TABLE permissoes_usuarios ADD COLUMN IF NOT EXISTS pode_acessar_notas_fiscais BOOLEAN DEFAULT false;
ALTER TABLE permissoes_usuarios ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Torna APENAS os dois e-mails administradores oficiais como Admin com acesso total
UPDATE permissoes_usuarios
SET 
  is_admin = true,
  pode_acessar_config = true,
  pode_acessar_premio = true,
  pode_acessar_orcamentos = true,
  pode_acessar_notas_fiscais = true
WHERE LOWER(email) IN ('agafarmatuparendi438@gmail.com', 'joaovitormachry@gmail.com');

-- 3. Garante que a conta do PDV e outros usuários normais NÃO sejam administradores
UPDATE permissoes_usuarios
SET 
  is_admin = false,
  pode_acessar_config = false
WHERE LOWER(email) NOT IN ('agafarmatuparendi438@gmail.com', 'joaovitormachry@gmail.com');

-- 4. Insere o e-mail agafarmatuparendi438@gmail.com caso ainda não exista na tabela:
INSERT INTO permissoes_usuarios (
  email,
  pode_acessar_premio,
  pode_acessar_config,
  pode_acessar_orcamentos,
  pode_acessar_notas_fiscais,
  is_admin
)
VALUES (
  'agafarmatuparendi438@gmail.com',
  true,
  true,
  true,
  true,
  true
)
ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  pode_acessar_config = true,
  pode_acessar_premio = true,
  pode_acessar_orcamentos = true,
  pode_acessar_notas_fiscais = true;

-- 5. Exibe a tabela atualizada para conferência
SELECT id, email, is_admin, pode_acessar_config, pode_acessar_premio, pode_acessar_orcamentos, pode_acessar_notas_fiscais 
FROM permissoes_usuarios;
