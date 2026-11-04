-- ==============================================================================
-- LIBERAÇÃO DE PERMISSÕES (RLS) - MÓDULO DE NOTAS FISCAIS E VENCIDOS
-- Tabelas existentes: clientes_nf, notas_fiscais_nf, itens_nf, itens_vencidos
-- ==============================================================================

-- 1. Habilitar Row Level Security (RLS) nas tabelas existentes
ALTER TABLE IF EXISTS public.clientes_nf ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notas_fiscais_nf ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.itens_nf ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.itens_vencidos ENABLE ROW LEVEL SECURITY;

-- 2. Limpar políticas antigas restritivas se existirem
DROP POLICY IF EXISTS "Permitir acesso total clientes_nf" ON public.clientes_nf;
DROP POLICY IF EXISTS "Usuários podem ver clientes_nf" ON public.clientes_nf;
DROP POLICY IF EXISTS "Usuários podem inserir clientes_nf" ON public.clientes_nf;
DROP POLICY IF EXISTS "Usuários podem atualizar clientes_nf" ON public.clientes_nf;
DROP POLICY IF EXISTS "Usuários podem deletar clientes_nf" ON public.clientes_nf;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clientes_nf;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.clientes_nf;

DROP POLICY IF EXISTS "Permitir acesso total notas_fiscais_nf" ON public.notas_fiscais_nf;
DROP POLICY IF EXISTS "Usuários podem ver suas NFs" ON public.notas_fiscais_nf;
DROP POLICY IF EXISTS "Usuários podem inserir suas NFs" ON public.notas_fiscais_nf;

DROP POLICY IF EXISTS "Permitir acesso total itens_nf" ON public.itens_nf;
DROP POLICY IF EXISTS "Usuários podem ver seus itens de NF" ON public.itens_nf;
DROP POLICY IF EXISTS "Usuários podem inserir seus itens de NF" ON public.itens_nf;

DROP POLICY IF EXISTS "Permitir acesso total itens_vencidos" ON public.itens_vencidos;
DROP POLICY IF EXISTS "Usuários podem ver seus itens de vencidos" ON public.itens_vencidos;
DROP POLICY IF EXISTS "Usuários podem inserir seus itens de vencidos" ON public.itens_vencidos;
DROP POLICY IF EXISTS "Usuários podem atualizar seus itens de vencidos" ON public.itens_vencidos;
DROP POLICY IF EXISTS "Usuários podem deletar seus itens de vencidos" ON public.itens_vencidos;

-- 3. Políticas de Acesso Total para NF EMPRESA (clientes_nf, notas_fiscais_nf e itens_nf)
CREATE POLICY "Permitir acesso total clientes_nf" ON public.clientes_nf 
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso total notas_fiscais_nf" ON public.notas_fiscais_nf 
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso total itens_nf" ON public.itens_nf 
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Política de Acesso Total para NF VENCIDOS (itens_vencidos)
CREATE POLICY "Permitir acesso total itens_vencidos" ON public.itens_vencidos 
  FOR ALL USING (true) WITH CHECK (true);
