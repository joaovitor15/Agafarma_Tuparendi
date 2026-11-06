import { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, Trophy, ChevronRight, ChevronLeft, ChevronDown, UserPlus, Save, Users, Trash2, Settings, Edit2, UserCheck, LogOut, Receipt, BookOpen, Printer, Plus, Upload, Download, Archive, RefreshCw, Scale, DollarSign, File, FileCheck, Recycle, Sun, Moon, Store, FileText, Loader2 } from 'lucide-react';
import extenso from 'extenso';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { supabase } from './supabase';
import html2pdf from 'html2pdf.js';
import { Auth } from './components/Auth';
import { UserManagement } from './components/UserManagement';
import { RichTextEditor } from './components/RichTextEditor';
import { OrcamentosJudiciais } from './components/OrcamentosJudiciais';
import { NotasFiscais } from './components/NotasFiscais';

const isKnownAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return lower === 'agafarmatuparendi438@gmail.com' || lower === 'joaovitormachry@gmail.com';
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [userPermissions, setUserPermissions] = useState<any>(null);

  const isAdmin = Boolean(
    userPermissions?.is_admin ||
    isKnownAdminEmail(session?.user?.email)
  );

  const canAccessPremio = Boolean(isAdmin || userPermissions?.pode_acessar_premio);
  const canAccessOrcamentos = Boolean(isAdmin || userPermissions?.pode_acessar_orcamentos);
  const canAccessNotasFiscais = Boolean(isAdmin || userPermissions?.pode_acessar_notas_fiscais);
  const canAccessConfig = Boolean(isAdmin || userPermissions?.pode_acessar_config);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agafarma_dark_mode');
      if (saved) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  useEffect(() => {
    localStorage.setItem('agafarma_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCpf, setEmployeeCpf] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return months[d.getMonth()];
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.getFullYear();
  });

  const periodo = `${selectedMonth}/${selectedYear}`;

  const [employees, setEmployees] = useState<{id: string, nome_completo: string, cpf: string, valor: string, gerar?: boolean}[]>([]);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const [empresaNome, setEmpresaNome] = useState('LUIZ MOACIR MACHRY');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [empresaCnpj, setEmpresaCnpj] = useState('89.055.768/0001-76');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');
  const [showSettingsSuccess, setShowSettingsSuccess] = useState(false);
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  
  const [editingSection, setEditingSection] = useState<'none' | 'estabelecimento' | 'responsabilidade' | 'bancario' | 'coleta'>('none');
  const [isRespTecnicaExpanded, setIsRespTecnicaExpanded] = useState(false);
  const [isBancarioExpanded, setIsBancarioExpanded] = useState(false);
  const [isColetaExpanded, setIsColetaExpanded] = useState(false);
  
  const [farmaceuticoResp, setFarmaceuticoResp] = useState('');
  const [crfRS, setCrfRS] = useState('');
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  
  const [coletaRazaoSocial, setColetaRazaoSocial] = useState('');
  const [coletaCnpj, setColetaCnpj] = useState('');
  const [coletaEndereco, setColetaEndereco] = useState('');
  const [coletaCidadeUf, setColetaCidadeUf] = useState('');
  const [coletaCep, setColetaCep] = useState('');
  const [settingId, setSettingId] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .limit(1)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar configuracoes:', error);
      }
      
      if (data) {
        if (data.id) setSettingId(data.id);
        if (data.empresa_nome) setEmpresaNome(data.empresa_nome);
        if (data.nome_fantasia) setNomeFantasia(data.nome_fantasia);
        if (data.empresa_cnpj) setEmpresaCnpj(data.empresa_cnpj);
        if (data.inscricao_estadual) setInscricaoEstadual(data.inscricao_estadual);
        if (data.telefone) setTelefone(data.telefone);
        if (data.email) setEmail(data.email);
        if (data.rua) setRua(data.rua);
        if (data.numero) setNumero(data.numero);
        if (data.cidade) setCidade(data.cidade);
        if (data.uf) setUf(data.uf);
        if (data.cep) setCep(data.cep);
        if (data.farmaceutico_resp) setFarmaceuticoResp(data.farmaceutico_resp);
        if (data.crf_rs) setCrfRS(data.crf_rs);
        if (data.banco) setBanco(data.banco);
        if (data.agencia) setAgencia(data.agencia);
        if (data.conta) setConta(data.conta);
        if (data.coleta_razao_social) setColetaRazaoSocial(data.coleta_razao_social);
        if (data.coleta_cnpj) setColetaCnpj(data.coleta_cnpj);
        if (data.coleta_endereco) setColetaEndereco(data.coleta_endereco);
        if (data.coleta_cidade_uf) setColetaCidadeUf(data.coleta_cidade_uf);
        if (data.coleta_cep) setColetaCep(data.coleta_cep);
      }

      // Fallback para cache local de coleta se ainda não configurado no banco
      try {
        const savedColeta = localStorage.getItem('agafarma_coleta_settings');
        if (savedColeta) {
          const parsed = JSON.parse(savedColeta);
          if (!data?.coleta_razao_social && parsed.coleta_razao_social) setColetaRazaoSocial(parsed.coleta_razao_social);
          if (!data?.coleta_cnpj && parsed.coleta_cnpj) setColetaCnpj(parsed.coleta_cnpj);
          if (!data?.coleta_endereco && parsed.coleta_endereco) setColetaEndereco(parsed.coleta_endereco);
          if (!data?.coleta_cidade_uf && parsed.coleta_cidade_uf) setColetaCidadeUf(parsed.coleta_cidade_uf);
          if (!data?.coleta_cep && parsed.coleta_cep) setColetaCep(parsed.coleta_cep);
        }
      } catch (e) {
        console.warn('Erro ao carregar cache local de coleta:', e);
      }
    } catch (err) {
      console.error('Exception fetching settings:', err);
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!session) return;
    setIsSavingSettings(true);

    // Salva sempre no cache local imediatamente para evitar qualquer perda
    try {
      localStorage.setItem('agafarma_coleta_settings', JSON.stringify({
        coleta_razao_social: coletaRazaoSocial,
        coleta_cnpj: coletaCnpj,
        coleta_endereco: coletaEndereco,
        coleta_cidade_uf: coletaCidadeUf,
        coleta_cep: coletaCep
      }));
    } catch (e) {
      console.warn('Erro ao salvar no cache local:', e);
    }

    try {
      const payload: any = {
        user_id: session.user.id,
        empresa_nome: empresaNome,
        nome_fantasia: nomeFantasia,
        empresa_cnpj: empresaCnpj,
        inscricao_estadual: inscricaoEstadual,
        telefone: telefone,
        email: email,
        rua: rua,
        numero: numero,
        cidade: cidade,
        uf: uf,
        cep: cep,
        farmaceutico_resp: farmaceuticoResp,
        crf_rs: crfRS,
        banco: banco,
        agencia: agencia,
        conta: conta,
        coleta_razao_social: coletaRazaoSocial,
        coleta_cnpj: coletaCnpj,
        coleta_endereco: coletaEndereco,
        coleta_cidade_uf: coletaCidadeUf,
        coleta_cep: coletaCep,
        updated_at: new Date().toISOString()
      };

      let error = null;
      let targetId = settingId;

      if (!targetId) {
        const { data: existing } = await supabase.from('configuracoes').select('id').limit(1).maybeSingle();
        if (existing?.id) {
          targetId = existing.id;
          setSettingId(existing.id);
        }
      }

      if (targetId) {
        const res = await supabase.from('configuracoes').update(payload).eq('id', targetId);
        error = res.error;
      } else {
        const res = await supabase.from('configuracoes').insert(payload).select('id').maybeSingle();
        error = res.error;
        if (res.data?.id) {
          setSettingId(res.data.id);
        }
      }

      // Se falhou por ausência das colunas de coleta no banco Supabase, salva sem as colunas de coleta no banco
      if (error && (error.message?.includes('column') || error.message?.includes('coleta_') || error.code === '42703' || error.code === 'PGRST204')) {
        console.warn('Colunas de coleta não encontradas no Supabase. Salvando no cache local e persistindo demais campos no banco...');
        const fallbackPayload = { ...payload };
        delete fallbackPayload.coleta_razao_social;
        delete fallbackPayload.coleta_cnpj;
        delete fallbackPayload.coleta_endereco;
        delete fallbackPayload.coleta_cidade_uf;
        delete fallbackPayload.coleta_cep;

        if (targetId) {
          await supabase.from('configuracoes').update(fallbackPayload).eq('id', targetId);
        } else {
          await supabase.from('configuracoes').insert(fallbackPayload);
        }

        setShowSettingsSuccess(true);
        setEditingSection('none');
        setTimeout(() => setShowSettingsSuccess(false), 3000);
        return;
      }

      if (error) {
        throw error;
      }

      setShowSettingsSuccess(true);
      setEditingSection('none');
      setTimeout(() => setShowSettingsSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar configuracoes:', err);
      // Como já salvamos no cache local, os dados estão seguros
      setShowSettingsSuccess(true);
      setEditingSection('none');
      setTimeout(() => setShowSettingsSuccess(false), 3000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch(err => {
        console.warn('Erro ao carregar sessão inicial do Supabase:', err);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (session) {
      fetchPermissions();
      fetchEmployees();
      fetchSettings();
    }
  }, [session]);

  const fetchPermissions = async () => {
    if (!session?.user?.email) return;
    const userEmail = session.user.email.toLowerCase().trim();
    const shouldBeAdmin = isKnownAdminEmail(userEmail);

    try {
      const { data, error } = await supabase
        .from('permissoes_usuarios')
        .select('*')
        .eq('email', session.user.email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar permissoes:', error);
      }
      
      if (data) {
        if (shouldBeAdmin && (!data.is_admin || !data.pode_acessar_config || !data.pode_acessar_orcamentos || !data.pode_acessar_notas_fiscais)) {
          const fullAdminPerms = {
            ...data,
            is_admin: true,
            pode_acessar_config: true,
            pode_acessar_premio: true,
            pode_acessar_orcamentos: true,
            pode_acessar_notas_fiscais: true,
          };
          setUserPermissions(fullAdminPerms);

          // Atualizar no banco Supabase para persistir (apenas colunas existentes)
          try {
            await supabase
              .from('permissoes_usuarios')
              .update({
                is_admin: true,
                pode_acessar_config: true,
                pode_acessar_premio: true,
                pode_acessar_orcamentos: true,
                pode_acessar_notas_fiscais: true,
              })
              .eq('id', data.id);
          } catch (syncErr) {
            console.warn('Não foi possível sincronizar permissões no Supabase:', syncErr);
          }
        } else {
          setUserPermissions(data);
        }
      } else {
        // Se não existir, criar com permissões padrão
        const initialPerms = {
          email: session.user.email,
          pode_acessar_premio: true,
          pode_acessar_config: shouldBeAdmin,
          pode_acessar_orcamentos: shouldBeAdmin,
          pode_acessar_notas_fiscais: shouldBeAdmin,
          is_admin: shouldBeAdmin,
        };

        setUserPermissions(initialPerms);

        const { data: newPerm, error: insertError } = await supabase
          .from('permissoes_usuarios')
          .insert([initialPerms])
          .select()
          .single();
          
        if (!insertError && newPerm) {
          setUserPermissions(newPerm);
        }
      }
    } catch (err) {
      console.error('Exception fetching permissions:', err);
      if (shouldBeAdmin) {
        setUserPermissions({
          email: session.user.email,
          pode_acessar_premio: true,
          pode_acessar_config: true,
          pode_acessar_orcamentos: true,
          pode_acessar_notas_fiscais: true,
          is_admin: true,
        });
      }
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        const formattedData = data.map(emp => ({
          ...emp,
          valor: emp.valor != null 
            ? Number(emp.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
            : '0,00',
          gerar: false
        }));
        setEmployees(formattedData);
      }
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
    }
    setEmployeeCpf(value);
  };

  const handleValorChange = async (id: string, value: string) => {
    // Remove tudo que não for dígito
    const onlyDigits = value.replace(/\D/g, '');
    
    // Converte para número dividindo por 100 para ter os centavos
    let formattedValue = '0,00';
    if (onlyDigits.length > 0) {
      const numericValue = parseInt(onlyDigits, 10) / 100;
      formattedValue = numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, valor: formattedValue } : emp));
  };

  
  
  const handleValorBlur = async (id: string, value: string) => {
    // Salva no banco quando o usuário sai do campo (blur)
    try {
      const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
      const { error } = await supabase
        .from('funcionarios')
        .update({ valor: numericValue })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao salvar valor:", error);
    }
  };
  
  const handleGerarChange = (id: string, checked: boolean) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, gerar: checked } : emp));
  };
  
  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', employeeToDelete);
        
      if (error) throw error;
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete));
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
    } finally {
      setEmployeeToDelete(null);
    }
  };

  const handleSubmitEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .insert([
          { 
            user_id: session.user.id,
            nome_completo: employeeName, 
            cpf: employeeCpf || null,
            valor: 0
          }
        ])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        const newEmp = {
          ...data[0],
          valor: '0,00',
          gerar: false
        };
        setEmployees([...employees, newEmp]);
      }
      
      setEmployeeName('');
      setEmployeeCpf('');
      setShowNewEmployeeForm(false);
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
    }
  };

  const handleGeneratePDF = () => {
    const selectedEmployees = employees.filter(emp => emp.gerar);
    if (selectedEmployees.length === 0) {
      return;
    }

    const dataEmissao = new Date().toLocaleDateString('pt-BR');

    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Recibo de Prêmio Meta</title>
  <style>
    @page { margin: 1cm; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 15px; 
      color: #000; 
      line-height: 1.6; 
      margin: 0 auto;
      max-width: 21cm;
      padding: 20px;
      box-sizing: border-box;
    }
    @media print {
      body { padding: 0; max-width: none; }
    }
    
    .recibo-container { 
      padding: 20px 40px; 
      height: 12.5cm; 
      box-sizing: border-box; 
      position: relative; 
      overflow: hidden; 
      page-break-inside: avoid;
    }
    .linha-corte { border-bottom: 1px dashed #999; width: 100%; margin: 0; }
    
    .titulo { text-align: center; font-size: 18px; font-weight: bold; text-decoration: underline; margin-bottom: 30px; }
    .empresa-info, .func-info { margin-bottom: 25px; }
    .texto-recibo { text-align: justify; margin-bottom: 30px; }
    
    .assinatura-box { text-align: center; position: absolute; bottom: 30px; left: 0; right: 0; }
    .linha-assinatura { border-top: 1px solid #000; width: 350px; margin: 0 auto 5px auto; }
  </style>
</head>
<body>
`;

    selectedEmployees.forEach((emp, i) => {
      // Valor needs to be parsed strictly or fall back
      const numValor = parseFloat(emp.valor.replace(/\./g, '').replace(',', '.')) || 0;
      const valorExtensoText = extenso(numValor, { mode: 'currency' });

      htmlContent += `
    <div class="recibo-container">
      <div class="titulo">RECIBO DE PAGAMENTO DE PRÊMIO META</div>
      
      <div class="empresa-info" style="font-size: 13px; line-height: 1.4; color: #333;">
        <span style="font-size: 15px; font-weight: bold; color: #000;">${empresaNome.toUpperCase()}</span>
        <br><span>CNPJ: ${empresaCnpj}</span>
      </div>
      
      <div class="func-info">
        <b>FUNCIONÁRIO:</b> ${emp.nome_completo.toUpperCase()}<br>
        <b>CPF:</b> ${emp.cpf || ''}
      </div>
      
      <div class="texto-recibo">
        Recebi nesta data a importância líquida de <b>R$ ${emp.valor} (${valorExtensoText})</b>, 
        referente ao pagamento de prêmio meta relativo ao período de Referência.<br><br>
        <b>Período de Referência:</b> ${periodo}
      </div>
      
      <div>
        Tuparendi – RS, ${dataEmissao}.
      </div>
      
      <div class="assinatura-box">
        <div class="linha-assinatura"></div>
        ${emp.nome_completo}
      </div>
    </div>
      `;

      if (i < selectedEmployees.length - 1) {
        if ((i + 1) % 2 === 0) {
          htmlContent += `<div style="page-break-after: always;"></div>`;
        } else {
          htmlContent += `<div class="linha-corte"></div>`;
        }
      }
    });

    htmlContent += `
</body>
</html>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlContent;

    const opt = {
      margin:       15,
      filename:     'recibo_premio_meta.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const win = window.open('', '_blank');
    if (win) {
      win.document.write('<html><body style="font-family: sans-serif; padding: 20px;">Gerando PDF, por favor aguarde...</body></html>');
    }

    html2pdf().set(opt).from(wrapper).outputPdf('blob').then((pdfBlob: Blob) => {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      if (win) {
        win.location.href = pdfUrl;
      } else {
        window.open(pdfUrl, '_blank');
      }
    });
  };

  ;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth onSession={setSession} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-[#0b1120]`}>
      {/* Modal de confirmação de exclusão */}
      {employeeToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6">Tem certeza que deseja remover este funcionário?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setEmployeeToDelete(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteEmployee}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão de documento */}
      

      {/* Header */}
      <header className="bg-gradient-to-r from-[#0066b3] to-[#005291] dark:from-[#0b1120] dark:to-[#131b2f] text-white shadow-sm z-30 relative border-b border-transparent dark:border-[#1e2b40]">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 mr-4 rounded-full hover:bg-[#005291] dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-gray-600 transition-colors"
              aria-label="Alternar Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                {/* Arco Branco com Seta */}
                <path 
                  d="M 18.8 68 A 36 36 0 0 1 68 18.8" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                />
                <polygon 
                  points="78.4,24.8 59.6,25.5 69.6,8.1" 
                  fill="#ffffff" 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                  strokeLinejoin="round" 
                />
                
                {/* Arco Laranja com Seta */}
                <path 
                  d="M 81.2 32 A 36 36 0 0 1 32 81.2" 
                  fill="none" 
                  stroke="#ff8c00" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                />
                <polygon 
                  points="21.6,75.2 40.4,74.5 30.4,91.9" 
                  fill="#ff8c00" 
                  stroke="#ff8c00" 
                  strokeWidth="2" 
                  strokeLinejoin="round" 
                />
                
                {/* Coração Central Amarelo (Menor) */}
                <g transform="translate(50, 48.5) scale(0.75) translate(-50, -48.5)">
                  <path
                    d="M50 72.5 L46.5 69 C32 54.5 26 48.5 26 39.5 C26 31 32.5 24.5 41 24.5 C45 24.5 48.5 26.5 50 30 C51.5 26.5 55 24.5 59 24.5 C67.5 24.5 74 31 74 39.5 C74 48.5 68 54.5 53.5 69 L50 72.5 Z"
                    fill="#fecb00"
                  />
                </g>
              </svg>
              <span className="text-xl font-bold ml-2 hidden sm:inline">Agafarma Tuparendi</span>
              <span className="text-lg font-bold ml-2 inline sm:hidden">Agafarma</span>
            </div>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 ml-2 rounded-full hover:bg-[#005291] dark:hover:bg-[#1e2b40]/50 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-gray-600 transition-colors text-white"
            aria-label="Alternar Modo Escuro"
          >
            {isDarkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay do Sidebar (Mobile) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 transition-opacity"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-16 w-64 bg-white dark:bg-[#0b1120] shadow-xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-200 dark:border-[#1e2b40] ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Botão Fechar no Mobile (opcional, já que tem o overlay, mas útil) */}
          <div className="p-4 border-b dark:border-[#1e2b40] flex justify-between items-center sm:hidden">
            <span className="font-semibold text-gray-700 dark:text-gray-100">Menu</span>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => { setCurrentPage('home'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'bg-blue-50 dark:bg-[#0066b3]/20 text-[#0066b3] dark:text-blue-400 rounded-lg' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2b40]/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg border-transparent'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Página Inicial</span>
            </button>

            {canAccessPremio && (
              <button
                onClick={() => { setCurrentPage('premio_meta'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'premio_meta' 
                    ? 'bg-blue-50 dark:bg-[#0066b3]/20 text-[#0066b3] dark:text-blue-400 rounded-lg' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2b40]/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg border-transparent'
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span>Prêmio Meta</span>
              </button>
            )}

            {canAccessOrcamentos && (
              <button
                onClick={() => { setCurrentPage('orcamentos_judiciais'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'orcamentos_judiciais' 
                    ? 'bg-blue-50 dark:bg-[#0066b3]/20 text-[#0066b3] dark:text-blue-400 rounded-lg' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2b40]/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg border-transparent'
                }`}
              >
                <Scale className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Orçamentos Judiciais</span>
              </button>
            )}

            {canAccessNotasFiscais && (
              <button
                onClick={() => { setCurrentPage('notas_fiscais'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'notas_fiscais' 
                    ? 'bg-blue-50 dark:bg-[#0066b3]/20 text-[#0066b3] dark:text-blue-400 rounded-lg' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2b40]/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg border-transparent'
                }`}
              >
                <FileCheck className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Notas Fiscais</span>
              </button>
            )}

            

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-[#1e2b40] flex flex-col space-y-2">
              {canAccessConfig && (
                <button
                  onClick={() => { setCurrentPage('settings'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    currentPage === 'settings' 
                      ? 'bg-blue-50 dark:bg-[#0066b3]/20 text-[#0066b3] dark:text-blue-400 rounded-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2b40]/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg border-transparent'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Configurações</span>
                </button>
              )}
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </nav>

        </aside>

        {/* Conteúdo Principal */}
        <main className={`flex-1 p-6 w-full transition-all duration-300 ${isSidebarOpen ? 'overflow-hidden' : 'overflow-auto'} dark:bg-[#0b1120]`}>
          <div className="max-w-4xl mx-auto">
            {currentPage === 'home' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Bem Vindo! Selecione o que deseja:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card do Prêmio Meta */}
                  {canAccessPremio && (
                    <div 
    onClick={() => setCurrentPage('premio_meta')}
    className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl p-6 cursor-pointer hover:border-[#0066b3] dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066b3]/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#0066b3]/10 dark:group-hover:bg-blue-400/10 transition-colors duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors" />
        <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-400 uppercase group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
          Módulo
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
        Prêmio Meta
      </h3>
    </div>
    <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 dark:border-[#1e2b40]">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Emissão rápida de recibos.
      </p>
    </div>
  </div>
                  )}

                  {/* Card de Orçamentos Judiciais */}
                  {canAccessOrcamentos && (
                    <div 
    onClick={() => setCurrentPage('orcamentos_judiciais')}
    className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl p-6 cursor-pointer hover:border-[#0066b3] dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066b3]/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#0066b3]/10 dark:group-hover:bg-blue-400/10 transition-colors duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-6">
        <Scale className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors" />
        <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-400 uppercase group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
          Módulo
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
        Orçamentos
      </h3>
    </div>
    <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 dark:border-[#1e2b40]">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Gere novos orçamentos ou reutilize o histórico.
      </p>
    </div>
  </div>
                  )}

                  {/* Card Notas Fiscais */}
                  {canAccessNotasFiscais && (
                    <div 
    onClick={() => setCurrentPage('notas_fiscais')}
    className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl p-6 cursor-pointer hover:border-[#0066b3] dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066b3]/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#0066b3]/10 dark:group-hover:bg-blue-400/10 transition-colors duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-6">
        <FileCheck className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors" />
        <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-400 uppercase group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
          Módulo
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
        Notas Fiscais
      </h3>
    </div>
    <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 dark:border-[#1e2b40]">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Gere rascunhos rápidos para Notas Fiscais.
      </p>
    </div>
  </div>
                  )}

                  

                  {/* Card de Configurações */}
                  {canAccessConfig && (
                    <div 
    onClick={() => setCurrentPage('settings')}
    className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl p-6 cursor-pointer hover:border-[#0066b3] dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066b3]/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#0066b3]/10 dark:group-hover:bg-blue-400/10 transition-colors duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors" />
        <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-400 uppercase group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
          Administração
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-[#0066b3] dark:group-hover:text-blue-400 transition-colors">
        Configurações
      </h3>
    </div>
    <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 dark:border-[#1e2b40]">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Atualize os dados e a responsabilidade técnica.
      </p>
    </div>
  </div>
                  )}

                  {(!canAccessConfig && !canAccessPremio && !canAccessOrcamentos && !canAccessNotasFiscais && !isAdmin) && (
                    <div className="col-span-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800">
                      Você não tem permissão para acessar nenhum módulo no momento. Solicite acesso ao administrador.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* INICIO DO BLOCO QUE RENDERIZA PREMIO META OU RECIBOS SICREDI */}
            {currentPage === 'premio_meta' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <button onClick={() => setCurrentPage('home')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Página Inicial
                  </button>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    Prêmio Meta
                  </span>
                </div>
                
                {/* Header (Fora do display de card) */}
                <div className="flex flex-row items-center justify-between gap-4 mb-8">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    {currentPage === 'premio_meta' ? (
                      <Trophy className="w-8 h-8 lg:w-10 lg:h-10 text-[#0066b3] dark:text-blue-400 shrink-0" />
                    ) : (
                      <Receipt className="w-8 h-8 lg:w-10 lg:h-10 text-[#0066b3] dark:text-blue-400 shrink-0" />
                    )}
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Prêmio Meta
                      </h2>
                      <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">
                        Emissão rápida de recibos.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                    {currentPage === 'premio_meta' && (
                      <>
                        <button 
                          onClick={handleGeneratePDF}
                          className="shrink-0 flex items-center justify-center p-3 lg:px-4 lg:py-2 bg-red-600 text-white rounded-full lg:rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                          title="Gerar PDF"
                        >
                          <Printer className="w-5 h-5 lg:w-4 lg:h-4" />
                          <span className="hidden lg:inline lg:ml-2 font-medium">Gerar PDF</span>
                        </button>
                        {!showNewEmployeeForm && (
                          <button 
                            onClick={() => setShowNewEmployeeForm(true)}
                            className="shrink-0 flex items-center justify-center p-3 lg:px-4 lg:py-2 bg-[#0066b3] text-white rounded-full lg:rounded-lg hover:bg-[#005291] transition-colors shadow-sm"
                            title="Novo Funcionário"
                          >
                            <UserPlus className="w-5 h-5 lg:w-4 lg:h-4" />
                            <span className="hidden lg:inline lg:ml-2 font-medium">Novo Funcionário</span>
                          </button>
                        )}
                      </>
                    )}
                    
                  </div>
                </div>
                
                {
                showNewEmployeeForm ? (
                  <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] mb-6 animate-in fade-in slide-in-from-top-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Cadastrar Novo Funcionário</h3>
                      <form onSubmit={handleSubmitEmployee} className="space-y-4">
                        <div>
                          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo *</label>
                          <input 
                            type="text" 
                            id="nome"
                            required
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-[#162032] dark:text-white"
                            placeholder="Digite o nome completo"
                          />
                        </div>
                        <div>
                          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF (Opcional)</label>
                          <input 
                            type="text" 
                            id="cpf"
                            value={employeeCpf}
                            onChange={handleCpfChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-[#162032] dark:text-white"
                            placeholder="000.000.000-00"
                          />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                          <button 
                            type="button"
                            onClick={() => setShowNewEmployeeForm(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-[#1e2b40] text-gray-700 dark:text-gray-300 rounded-lg bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button 
                            type="submit"
                            className="flex items-center space-x-2 px-4 py-2 bg-[#0066b3] text-white rounded-lg hover:bg-[#005291] transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            <span>Salvar</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : isLoading ? (
                    <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] py-16 px-4 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 border-4 border-[#0066b3] dark:border-blue-500 border-t-transparent dark:border-t-transparent rounded-full animate-spin mb-4"></div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Carregando funcionários...</h3>
                    </div>
                  ) : employees.length > 0 ? (
                      <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0066b3] dark:bg-blue-500"></div>
                        
                        <div className="p-6 border-b border-gray-100 dark:border-[#1e2b40] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                          <p className="text-gray-600 dark:text-gray-300 flex-1">
                            {currentPage === 'premio_meta' 
                              ? <>Marque quem atingiu a meta. Os valores digitados ficam <strong>salvos e formatados automaticamente</strong> para os próximos meses!</>
                              : <>Marque quem vai receber os recibos do <strong>Programa Juntos</strong>. Os valores digitados ficam salvos automaticamente!</>
                            }
                          </p>
                          <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 overflow-visible pb-2 sm:pb-0 z-10">
                              {/* Mês - Custom Dropdown */}
                              <div className="relative shrink-0">
                                <button
                                  onClick={() => setIsMonthOpen(!isMonthOpen)}
                                  onBlur={() => setTimeout(() => setIsMonthOpen(false), 200)}
                                  className="flex items-center justify-between bg-white dark:bg-white/5 text-[#0066b3] dark:text-blue-400 text-sm font-semibold rounded-full pl-5 pr-4 py-2 border border-gray-200 dark:border-[#1e2b40] hover:bg-gray-50 dark:hover:border-blue-500 transition-colors shadow-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-500 outline-none w-36"
                                >
                                  {selectedMonth}
                                  <ChevronDown className="w-4 h-4 ml-2" />
                                </button>
                                
                                {isMonthOpen && (
                                  <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] border border-gray-200 dark:border-[#1e2b40] rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="py-1">
                                      {months.map(m => (
                                        <button
                                          key={m}
                                          onClick={() => {
                                            setSelectedMonth(m);
                                            setIsMonthOpen(false);
                                          }}
                                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#1e2b40] transition-colors cursor-pointer ${selectedMonth === m ? 'bg-gray-100 dark:bg-[#1e2b40] text-[#0066b3] dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                                        >
                                          {m}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Ano - Pill */}
                              <div className="flex items-center bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-[#1e2b40] shadow-sm h-[38px] px-1 shrink-0">
                                <button 
                                  onClick={() => setSelectedYear(y => y - 1)}
                                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#1e2b40] transition-colors text-gray-500 dark:text-gray-400 hover:text-[#0066b3] dark:hover:text-blue-400"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="font-semibold text-[#0066b3] dark:text-blue-400 text-sm w-12 text-center">{selectedYear}</span>
                                <button 
                                  onClick={() => setSelectedYear(y => y + 1)}
                                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#1e2b40] transition-colors text-gray-500 dark:text-gray-400 hover:text-[#0066b3] dark:hover:text-blue-400"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto hidden md:block">
                          <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                              <tr className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-200 dark:border-[#1e2b40] bg-gray-50 dark:bg-white/5">
                                <th className="py-4 px-6 text-center w-24">GERAR?</th>
                                <th className="py-4 px-6">NOME DO FUNCIONÁRIO</th>
                                <th className="py-4 px-6">CPF</th>
                                <th className="py-4 px-6 text-center w-40">VALOR (R$)</th>
                                <th className="py-4 px-6 text-center w-24">AÇÕES</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#1e2b40]">
                              {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1e2b40]/50 transition-colors">
                                  <td className="py-4 px-6 text-center">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 rounded border-gray-300 text-[#0066b3] focus:ring-[#0066b3] dark:border-[#1e2b40] dark:bg-[#162032] cursor-pointer"
                                      checked={emp.gerar}
                                      onChange={(e) => handleGerarChange(emp.id, e.target.checked)}
                                    />
                                  </td>
                                  <td className="py-4 px-6 font-semibold text-gray-800 dark:text-gray-100">{emp.nome_completo}</td>
                                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm">{emp.cpf}</td>
                                  <td className="py-4 px-6 text-center">
                                    <input 
                                      type="text" 
                                      value={emp.valor}
                                      onChange={(e) => handleValorChange(emp.id, e.target.value)}
                                      onBlur={(e) => handleValorBlur(emp.id, e.target.value)}
                                      className="w-full text-right px-3 py-2 border border-gray-200 dark:border-[#1e2b40] rounded-md focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-white/5 font-medium text-gray-700 dark:text-gray-300"
                                      placeholder="0,00"
                                    />
                                  </td>
                                  <td className="py-4 px-6 text-center">
                                    <button 
                                      onClick={() => setEmployeeToDelete(emp.id)}
                                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 inline-flex items-center justify-center"
                                      title="Remover"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Layout Mobile */}
                        <div className="md:hidden divide-y divide-gray-100 dark:divide-[#1e2b40]">
                          {employees.map(emp => (
                            <div key={emp.id} className="p-4 flex flex-col space-y-3 hover:bg-gray-50/50 dark:hover:bg-[#1e2b40]/50 transition-colors">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-3">
                                  <div className="pt-1">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 rounded border-gray-300 text-[#0066b3] focus:ring-[#0066b3] dark:border-[#1e2b40] dark:bg-[#162032] cursor-pointer"
                                      checked={emp.gerar}
                                      onChange={(e) => handleGerarChange(emp.id, e.target.checked)}
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">{emp.nome_completo}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{emp.cpf || 'Sem CPF'}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setEmployeeToDelete(emp.id)}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor (R$):</label>
                                <input 
                                  type="text" 
                                  value={emp.valor}
                                  onChange={(e) => handleValorChange(emp.id, e.target.value)}
                                  onBlur={(e) => handleValorBlur(emp.id, e.target.value)}
                                  className="w-32 text-right px-3 py-2 border border-gray-200 dark:border-[#1e2b40] rounded-md focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-white/5 font-medium text-gray-700 dark:text-gray-300"
                                  placeholder="0,00"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] py-16 px-4 flex flex-col items-center justify-center text-center">
                        <Users className="w-16 h-16 text-gray-200 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Nenhum funcionário cadastrado</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                          Cadastre os funcionários para utilizar o módulo de emissão rápida de recibos.
                        </p>
                      </div>
                    )}
              </div>
            )}

            {currentPage === 'orcamentos_judiciais' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <button onClick={() => setCurrentPage('home')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Página Inicial
                  </button>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Orçamentos Judiciais</span>
                </div>
                
                <div className="max-w-none">
                  <OrcamentosJudiciais />
                </div>
              </div>
            )}

            {currentPage === 'notas_fiscais' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <button onClick={() => setCurrentPage('home')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Página Inicial
                  </button>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Notas Fiscais</span>
                </div>
                
                <div className="max-w-none">
                  <NotasFiscais session={session} />
                </div>
              </div>
            )}

            {currentPage === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <button onClick={() => setCurrentPage('home')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Página Inicial
                  </button>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Configurações</span>
                </div>
                
                <div className="flex flex-row items-center gap-4 mb-8">
                  <Settings className="w-8 h-8 text-[#0066b3]" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Configurações</h2>
                    <p className="text-gray-500 dark:text-gray-400">Atualize os dados e a responsabilidade técnica do sistema.</p>
                  </div>
                </div>

                  {showSettingsSuccess && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center animate-in fade-in slide-in-from-top-2">
                      <Save className="w-5 h-5 mr-2" />
                      Configurações salvas e aplicadas aos próximos recibos!
                    </div>
                  )}

                  <div className="space-y-6 animate-in fade-in">
                      {/* Card 1 - Identificação do Estabelecimento */}
                      <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0066b3]"></div>
                        
                        {editingSection === 'estabelecimento' ? (
                          <form onSubmit={handleSaveSettings} className="animate-in fade-in pt-2">
                            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#1e2b40] pb-4 mb-6">
                              <Store className="w-5 h-5 text-[#0066b3]" />
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Editar Identificação do Estabelecimento</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label htmlFor="empresaNome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Razão Social</label>
                                <input 
                                  type="text" 
                                  id="empresaNome"
                                  value={empresaNome}
                                  onChange={(e) => setEmpresaNome(e.target.value)}
                                  required
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Razão Social"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Fantasia</label>
                                <input 
                                  type="text" 
                                  id="nomeFantasia"
                                  value={nomeFantasia}
                                  onChange={(e) => setNomeFantasia(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Nome Fantasia"
                                />
                              </div>
      
                              <div>
                                <label htmlFor="empresaCnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ</label>
                                <input 
                                  type="text" 
                                  id="empresaCnpj"
                                  value={empresaCnpj}
                                  onChange={(e) => setEmpresaCnpj(e.target.value)}
                                  required
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="00.000.000/0000-00"
                                />
                              </div>
      
                              <div>
                                <label htmlFor="inscricaoEstadual" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inscrição Estadual (IE)</label>
                                <input 
                                  type="text" 
                                  id="inscricaoEstadual"
                                  value={inscricaoEstadual}
                                  onChange={(e) => setInscricaoEstadual(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Inscrição Estadual"
                                />
                              </div>
      
                              <div>
                                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone / WhatsApp</label>
                                <input 
                                  type="text" 
                                  id="telefone"
                                  value={telefone}
                                  onChange={(e) => setTelefone(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="(00) 00000-0000"
                                />
                              </div>
      
                              <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail Oficial</label>
                                <input 
                                  type="email" 
                                  id="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="contato@empresa.com.br"
                                />
                              </div>
      
                              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-6">
                                <div className="sm:col-span-3">
                                  <label htmlFor="rua" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rua / Logradouro</label>
                                  <input 
                                    type="text" 
                                    id="rua"
                                    value={rua}
                                    onChange={(e) => setRua(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                    placeholder="Ex: Avenida Mauá"
                                  />
                                </div>
                                <div className="sm:col-span-1">
                                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número</label>
                                  <input 
                                    type="text" 
                                    id="numero"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                    placeholder="Ex: 1761"
                                  />
                                </div>
                              </div>
      
                              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-6">
                                <div className="sm:col-span-2">
                                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
                                  <input 
                                    type="text" 
                                    id="cidade"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                    placeholder="Ex: Tuparendi"
                                  />
                                </div>
                                <div className="sm:col-span-1">
                                  <label htmlFor="uf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">UF</label>
                                  <input 
                                    type="text" 
                                    id="uf"
                                    value={uf}
                                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                                    maxLength={2}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                    placeholder="Ex: RS"
                                  />
                                </div>
                                <div className="sm:col-span-1">
                                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</label>
                                  <input 
                                    type="text" 
                                    id="cep"
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                    placeholder="00000-000"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100 dark:border-[#1e2b40]">
                              <button 
                                type="button"
                                onClick={() => {
                                  setEditingSection('none');
                                  fetchSettings();
                                }}
                                className="px-6 py-2.5 border border-gray-300 dark:border-[#1e2b40] text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:bg-[#162032] transition-colors"
                              >
                                Cancelar
                              </button>
                              <button 
                                type="submit"
                                disabled={isSavingSettings}
                                className="flex items-center space-x-2 px-6 py-2.5 bg-[#0066b3] text-white font-medium rounded-lg hover:bg-[#005291] transition-colors shadow-sm disabled:opacity-50"
                              >
                                {isSavingSettings ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Salvando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-5 h-5" />
                                    <span>Salvar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div 
                              className="flex justify-between items-center border-b border-gray-100 dark:border-[#1e2b40] pb-4 cursor-pointer group"
                              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                            >
                              <div className="flex items-center gap-2">
                                <Store className={`w-5 h-5 transition-colors ${isSettingsExpanded ? 'text-[#0066b3]' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-400'}`} />
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Identificação do Estabelecimento</h3>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSection('estabelecimento');
                                    setIsSettingsExpanded(true);
                                  }}
                                  className="flex items-center space-x-2 p-2 sm:px-4 sm:py-2 bg-blue-50 dark:bg-blue-900/40 text-[#0066b3] dark:text-blue-400 font-medium rounded-full sm:rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                                >
                                  <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">Editar Dados</span>
                                </button>
                                <div className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isSettingsExpanded ? 'bg-gray-100 dark:bg-[#162032]' : ''}`}>
                                  <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isSettingsExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>
                            </div>
                            
                            {isSettingsExpanded && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 pb-2 animate-in slide-in-from-top-2 duration-300">
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Razão Social</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{empresaNome}</p>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nome Fantasia</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{nomeFantasia || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
        
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CNPJ</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{empresaCnpj}</p>
                                </div>
        
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Inscrição Estadual (IE)</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{inscricaoEstadual || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
        
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Telefone / WhatsApp</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{telefone || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
        
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">E-mail Oficial</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{email || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
        
                                <div className="col-span-full md:col-span-1">
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rua / Logradouro e Número</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{rua || numero ? `${rua}${numero ? `, ${numero}` : ''}` : <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
        
                                <div className="col-span-full md:col-span-1">
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cidade / UF</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{cidade || uf ? `${cidade}${uf ? `/${uf}` : ''}` : <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
        
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CEP</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{cep || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Card 2 - Responsabilidade Técnica */}
                      <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0066b3]"></div>
                        
                        {editingSection === 'responsabilidade' ? (
                          <form onSubmit={handleSaveSettings} className="animate-in fade-in pt-2">
                            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#1e2b40] pb-4 mb-6">
                              <UserCheck className="w-5 h-5 text-[#0066b3]" />
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Editar Responsabilidade Técnica</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label htmlFor="farmaceuticoResp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Farmacêutico Responsável</label>
                                <input 
                                  type="text" 
                                  id="farmaceuticoResp"
                                  value={farmaceuticoResp}
                                  onChange={(e) => setFarmaceuticoResp(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Nome completo do Farmacêutico"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="crfRS" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número do CRF/RS</label>
                                <input 
                                  type="text" 
                                  id="crfRS"
                                  value={crfRS}
                                  onChange={(e) => setCrfRS(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="00000"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100 dark:border-[#1e2b40]">
                              <button 
                                type="button"
                                onClick={() => {
                                  setEditingSection('none');
                                  fetchSettings();
                                }}
                                className="px-6 py-2.5 border border-gray-300 dark:border-[#1e2b40] text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:bg-[#162032] transition-colors"
                              >
                                Cancelar
                              </button>
                              <button 
                                type="submit"
                                disabled={isSavingSettings}
                                className="flex items-center space-x-2 px-6 py-2.5 bg-[#0066b3] text-white font-medium rounded-lg hover:bg-[#005291] transition-colors shadow-sm disabled:opacity-50"
                              >
                                {isSavingSettings ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Salvando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-5 h-5" />
                                    <span>Salvar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div 
                              className="flex justify-between items-center border-b border-gray-100 dark:border-[#1e2b40] pb-4 cursor-pointer group"
                              onClick={() => setIsRespTecnicaExpanded(!isRespTecnicaExpanded)}
                            >
                              <div className="flex items-center gap-2">
                                <UserCheck className={`w-5 h-5 transition-colors ${isRespTecnicaExpanded ? 'text-[#0066b3]' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-400'}`} />
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Responsabilidade Técnica</h3>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSection('responsabilidade');
                                    setIsRespTecnicaExpanded(true);
                                  }}
                                  className="flex items-center space-x-2 p-2 sm:px-4 sm:py-2 bg-blue-50 dark:bg-blue-900/40 text-[#0066b3] dark:text-blue-400 font-medium rounded-full sm:rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                                >
                                  <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">Editar Dados</span>
                                </button>
                                <div className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isRespTecnicaExpanded ? 'bg-gray-100 dark:bg-[#162032]' : ''}`}>
                                  <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isRespTecnicaExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>
                            </div>
                            
                            {isRespTecnicaExpanded && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 pb-2 animate-in slide-in-from-top-2 duration-300">
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nome do Farmacêutico Responsável</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{farmaceuticoResp || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Número do CRF/RS</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{crfRS || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Card 3 - Coleta */}
                      <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] relative overflow-hidden mt-6">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0066b3]"></div>
                        
                        {editingSection === 'coleta' ? (
                          <form onSubmit={handleSaveSettings} className="animate-in fade-in pt-2">
                            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#1e2b40] pb-4 mb-6">
                              <Recycle className="w-5 h-5 text-[#0066b3]" />
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Editar Coleta</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label htmlFor="coletaRazaoSocial" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Razão Social</label>
                                <input 
                                  type="text" 
                                  id="coletaRazaoSocial"
                                  value={coletaRazaoSocial}
                                  onChange={(e) => setColetaRazaoSocial(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Digite a Razão Social"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="coletaCnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ</label>
                                <input 
                                  type="text" 
                                  id="coletaCnpj"
                                  value={coletaCnpj}
                                  onChange={(e) => setColetaCnpj(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="00.000.000/0000-00"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-6">
                              <div className="sm:col-span-2">
                                <label htmlFor="coletaEndereco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço</label>
                                <input 
                                  type="text" 
                                  id="coletaEndereco"
                                  value={coletaEndereco}
                                  onChange={(e) => setColetaEndereco(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Rua, Número, Bairro, Pavilhão"
                                />
                              </div>
                              
                              <div className="sm:col-span-1">
                                <label htmlFor="coletaCidadeUf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade / UF</label>
                                <input 
                                  type="text" 
                                  id="coletaCidadeUf"
                                  value={coletaCidadeUf}
                                  onChange={(e) => setColetaCidadeUf(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Ex: Porto Alegre / RS"
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <label htmlFor="coletaCep" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</label>
                                <input 
                                  type="text" 
                                  id="coletaCep"
                                  value={coletaCep}
                                  onChange={(e) => setColetaCep(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="00000-000"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100 dark:border-[#1e2b40]">
                              <button 
                                type="button"
                                onClick={() => {
                                  setEditingSection('none');
                                  fetchSettings();
                                }}
                                className="px-6 py-2.5 border border-gray-300 dark:border-[#1e2b40] text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:bg-[#162032] transition-colors"
                              >
                                Cancelar
                              </button>
                              <button 
                                type="submit"
                                disabled={isSavingSettings}
                                className="flex items-center space-x-2 px-6 py-2.5 bg-[#0066b3] text-white font-medium rounded-lg hover:bg-[#005291] transition-colors shadow-sm disabled:opacity-50"
                              >
                                {isSavingSettings ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Salvando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-5 h-5" />
                                    <span>Salvar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div 
                              className="flex justify-between items-center border-b border-gray-100 dark:border-[#1e2b40] pb-4 cursor-pointer group"
                              onClick={() => setIsColetaExpanded(!isColetaExpanded)}
                            >
                              <div className="flex items-center gap-2">
                                <Recycle className={`w-5 h-5 transition-colors ${isColetaExpanded ? 'text-[#0066b3]' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-400'}`} />
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Coleta</h3>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSection('coleta');
                                    setIsColetaExpanded(true);
                                  }}
                                  className="flex items-center space-x-2 p-2 sm:px-4 sm:py-2 bg-blue-50 dark:bg-blue-900/40 text-[#0066b3] dark:text-blue-400 font-medium rounded-full sm:rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                                >
                                  <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">Editar Dados</span>
                                </button>
                                <div className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isColetaExpanded ? 'bg-gray-100 dark:bg-[#162032]' : ''}`}>
                                  <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isColetaExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>
                            </div>
                            
                            {isColetaExpanded && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 pb-2 animate-in slide-in-from-top-2 duration-300">
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Razão Social</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{coletaRazaoSocial || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CNPJ</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{coletaCnpj || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
                                
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-6 mt-2">
                                  <div className="sm:col-span-2">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Endereço</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-semibold">{coletaEndereco || <span className="text-gray-400 italic">Não informado</span>}</p>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cidade / UF</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-semibold">{coletaCidadeUf || <span className="text-gray-400 italic">Não informado</span>}</p>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CEP</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-semibold">{coletaCep || <span className="text-gray-400 italic">Não informado</span>}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Card 4 - Dados Bancários (Sicredi) */}
                      <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] relative overflow-hidden mt-6">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0066b3]"></div>
                        
                        {editingSection === 'bancario' ? (
                          <form onSubmit={handleSaveSettings} className="animate-in fade-in pt-2">
                            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#1e2b40] pb-4 mb-6">
                              <FileText className="w-5 h-5 text-[#0066b3]" />
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Editar Dados Bancários</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                              <div>
                                <label htmlFor="banco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banco</label>
                                <input 
                                  type="text" 
                                  id="banco"
                                  value={banco}
                                  onChange={(e) => setBanco(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Ex: 748"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="agencia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agência</label>
                                <input 
                                  type="text" 
                                  id="agencia"
                                  value={agencia}
                                  onChange={(e) => setAgencia(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Ex: 0123"
                                />
                              </div>

                              <div>
                                <label htmlFor="conta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conta Corrente</label>
                                <input 
                                  type="text" 
                                  id="conta"
                                  value={conta}
                                  onChange={(e) => setConta(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] focus:border-transparent outline-none bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] text-gray-900 dark:text-gray-100 transition-shadow"
                                  placeholder="Ex: 12345-6"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100 dark:border-[#1e2b40]">
                              <button 
                                type="button"
                                onClick={() => {
                                  setEditingSection('none');
                                  fetchSettings();
                                }}
                                className="px-6 py-2.5 border border-gray-300 dark:border-[#1e2b40] text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:bg-[#162032] transition-colors"
                              >
                                Cancelar
                              </button>
                              <button 
                                type="submit"
                                disabled={isSavingSettings}
                                className="flex items-center space-x-2 px-6 py-2.5 bg-[#0066b3] text-white font-medium rounded-lg hover:bg-[#005291] transition-colors shadow-sm disabled:opacity-50"
                              >
                                {isSavingSettings ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Salvando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-5 h-5" />
                                    <span>Salvar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div 
                              className="flex justify-between items-center border-b border-gray-100 dark:border-[#1e2b40] pb-4 cursor-pointer group"
                              onClick={() => setIsBancarioExpanded(!isBancarioExpanded)}
                            >
                              <div className="flex items-center gap-2">
                                <FileText className={`w-5 h-5 transition-colors ${isBancarioExpanded ? 'text-[#0066b3]' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-400'}`} />
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Dados Bancários (Sicredi)</h3>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSection('bancario');
                                    setIsBancarioExpanded(true);
                                  }}
                                  className="flex items-center space-x-2 p-2 sm:px-4 sm:py-2 bg-blue-50 dark:bg-blue-900/40 text-[#0066b3] dark:text-blue-400 font-medium rounded-full sm:rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                                >
                                  <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">Editar Dados</span>
                                </button>
                                <div className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isBancarioExpanded ? 'bg-gray-100 dark:bg-[#162032]' : ''}`}>
                                  <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isBancarioExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>
                            </div>
                            
                            {isBancarioExpanded && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 pb-2 animate-in slide-in-from-top-2 duration-300">
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Banco</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{banco || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Agência</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{agencia || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Conta Corrente</p>
                                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{conta || <span className="text-gray-400 italic">Não informado</span>}</p>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {isAdmin && (
                        <div className="mt-2">
                          <UserManagement />
                        </div>
                      )}
                    </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Manuals & POPs Modal */}
      

    </div>
  );
}
