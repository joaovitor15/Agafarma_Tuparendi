-- SCRIPT PARA CONFIGURAR ADMINISTRADORES E CORRIGIR PERMISSÕES NO SUPABASE
-- Execute no SQL Editor do seu projeto Supabase:

-- 1. Garante que APENAS os dois e-mails administradores oficiais tenham is_admin = true e acesso total
UPDATE permissoes_usuarios
SET 
  is_admin = true,
  pode_acessar_config = true,
  pode_acessar_premio = true,
  pode_acessar_orcamentos = true,
  pode_acessar_notas_fiscais = true
WHERE LOWER(email) IN ('agafarmatuparendi438@gmail.com', 'joaovitormachry@gmail.com');

-- 2. Garante que contas de PDV e outros usuários normais NÃO sejam administradores
UPDATE permissoes_usuarios
SET 
  is_admin = false,
  pode_acessar_config = false
WHERE LOWER(email) NOT IN ('agafarmatuparendi438@gmail.com', 'joaovitormachry@gmail.com');

-- 3. Caso agafarmatuparendi438@gmail.com ainda não exista na tabela permissoes_usuarios, insere agora:
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

-- 4. Exibe a tabela de permissões atualizada para conferência
SELECT id, email, is_admin, pode_acessar_config, pode_acessar_premio, pode_acessar_orcamentos, pode_acessar_notas_fiscais 
FROM permissoes_usuarios;
