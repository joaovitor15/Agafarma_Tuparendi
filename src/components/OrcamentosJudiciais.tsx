import React, { useState, useEffect } from 'react';
import { History, Plus, Trash2, Search, X, Check, FileText, File, DollarSign, UserPlus, Save, Scale, Edit, ChevronDown, AlertTriangle, Printer } from 'lucide-react';
import { supabase } from '../supabase';
import { generateOrcamentoPdf } from '../utils/pdfGenerator';

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  created_at?: string;
}

interface Orcamento {
  id: string;
  paciente_id: string;
  user_id?: string;
  created_at?: string;
}

interface Medicamento {
  id: string;
  orcamento_id?: string;
  nome: string;
  principio: string;
  quantidade: string;
  preco: string;
}

export function OrcamentosJudiciais() {
  const [isOrcamentoModalOpen, setIsOrcamentoModalOpen] = useState(false);
  
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [isLoadingHistorico, setIsLoadingHistorico] = useState(false);
  const [selectedPacienteId, setSelectedPacienteId] = useState<string>('');
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermHistorico, setSearchTermHistorico] = useState('');
  const [editingOrcamentoId, setEditingOrcamentoId] = useState<string | null>(null);
  const [orcamentoToDelete, setOrcamentoToDelete] = useState<string | null>(null);
  
  const [isPacienteModalOpen, setIsPacienteModalOpen] = useState(false);
  const [novoPacienteNome, setNovoPacienteNome] = useState('');
  const [novoPacienteCpf, setNovoPacienteCpf] = useState('');
  
  const [settings, setSettings] = useState({
    razaoSocial: 'FARMÁCIA AGAFARMA TUPARENDI LTDA',
    cnpj: '00.000.000/0000-00',
    ie: 'ISENTO',
    endereco: 'Av. Tucunduva, Centro, Tuparendi - RS',
    nomeFantasia: 'AGAFARMA TUPARENDI',
    telefone: '(55) 3543-0000'
  });

  useEffect(() => {
    fetchPacientes();
    fetchSettings();
    fetchHistorico();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('empresa_nome, empresa_cnpj, inscricao_estadual, rua, numero, cidade, uf, telefone, nome_fantasia')
        .single();
      
      if (data) {
        setSettings({
          razaoSocial: data.empresa_nome || 'FARMÁCIA AGAFARMA TUPARENDI LTDA',
          cnpj: data.empresa_cnpj || '00.000.000/0000-00',
          ie: data.inscricao_estadual || 'ISENTO',
          endereco: data.rua ? `${data.rua}, ${data.numero}, ${data.cidade} - ${data.uf}` : 'Av. Tucunduva, Centro, Tuparendi - RS',
          nomeFantasia: data.nome_fantasia || 'AGAFARMA TUPARENDI',
          telefone: data.telefone || '(55) 3543-0000'
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const fetchHistorico = async () => {
    setIsLoadingHistorico(true);
    try {
      const { data, error } = await supabase
        .from('orcamentos_judiciais')
        .select(`
          id,
          paciente_id,
          created_at,
          paciente_orcamento:paciente_id ( nome, cpf ),
          medicamento_orcamento ( nome, principio, quantidade, preco )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching historico:', error);
      } else if (data) {
        setHistorico(data);
      }
    } catch (e) {
      console.error('Exception fetching historico:', e);
    }
    setIsLoadingHistorico(false);
  };

  const resetForm = () => {
    setSelectedPacienteId('');
    setSearchTerm('');
    setEditingOrcamentoId(null);
    setMedicamentos([{ id: Date.now().toString(), nome: '', principio: '', quantidade: '', preco: '' }]);
  };

  const fetchPacientes = async () => {
    const { data, error } = await supabase
      .from('paciente_orcamento')
      .select('*')
      .order('nome', { ascending: true });
      
    if (error) {
      console.error('Error fetching patients:', error);
    } else if (data) {
      setPacientes(data);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setNovoPacienteCpf(value);
  };

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([
    { id: Date.now().toString(), nome: '', principio: '', quantidade: '', preco: '' }
  ]);

  const filteredPacientes = pacientes.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredHistorico = historico.filter(orc => {
    const term = searchTermHistorico.toLowerCase();
    const nome = (orc.paciente_orcamento?.nome || '').toLowerCase();
    const cpf = (orc.paciente_orcamento?.cpf || '').toLowerCase();
    return nome.includes(term) || cpf.includes(term);
  });

  const handleAddMedicamento = () => {
    setMedicamentos([...medicamentos, { id: Date.now().toString(), nome: '', principio: '', quantidade: '', preco: '' }]);
  };

  const handleRemoveMedicamento = (id: string) => {
    if (medicamentos.length > 1) {
      setMedicamentos(medicamentos.filter(m => m.id !== id));
    }
  };

  const updateMedicamento = (id: string, field: keyof Medicamento, value: string) => {
    setMedicamentos(medicamentos.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handlePrecoChange = (id: string, value: string) => {
    let onlyNumbers = value.replace(/\D/g, '');
    if (onlyNumbers.length === 0) {
      updateMedicamento(id, 'preco', '');
      return;
    }
    
    const amount = (parseInt(onlyNumbers, 10) / 100).toFixed(2);
    const masked = amount.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    updateMedicamento(id, 'preco', masked);
  };

  const handleSavePaciente = async () => {
    if (!novoPacienteNome.trim()) return;
    
    const { data, error } = await supabase
      .from('paciente_orcamento')
      .insert([
        { nome: novoPacienteNome, cpf: novoPacienteCpf }
      ])
      .select();

    if (error) {
      console.error("Error saving patient:", error);
      alert("Erro ao salvar paciente.");
      return;
    }

    if (data && data.length > 0) {
      const novo = data[0] as Paciente;
      setPacientes([...pacientes, novo]);
      setSelectedPacienteId(novo.id);
      setSearchTerm(novo.nome);
      setIsPacienteModalOpen(false);
      setNovoPacienteNome('');
      setNovoPacienteCpf('');
    }
  };

  const handleSaveOrcamento = async () => {
    if (!selectedPacienteId) {
      setValidationMessage("Por favor, selecione um paciente para salvar o orçamento.");
      setShowValidationModal(true);
      return;
    }
    const emptyMeds = medicamentos.some(m => !m.nome.trim() || !m.quantidade || !m.preco);
    if (emptyMeds) {
      setValidationMessage("Por favor, preencha todos os campos obrigatórios dos medicamentos (Nome, Quantidade e Preço).");
      setShowValidationModal(true);
      return;
    }
    
    try {
      let orcamentoId = editingOrcamentoId;

      if (orcamentoId) {
        // Atualizar orçamento existente
        const { error: orcError } = await supabase
          .from('orcamentos_judiciais')
          .update({ paciente_id: selectedPacienteId })
          .eq('id', orcamentoId);
          
        if (orcError) {
          console.error("Erro ao atualizar orçamento:", orcError);
          alert("Erro ao atualizar o orçamento.");
          return;
        }

        // Deletar os medicamentos antigos
        const { error: delError } = await supabase
          .from('medicamento_orcamento')
          .delete()
          .eq('orcamento_id', orcamentoId);

        if (delError) {
          console.error("Erro ao deletar medicamentos antigos:", delError);
        }
      } else {
        // Criar novo orçamento
        const { data: orcData, error: orcError } = await supabase
          .from('orcamentos_judiciais')
          .insert([{ paciente_id: selectedPacienteId }])
          .select();

        if (orcError || !orcData || orcData.length === 0) {
          console.error("Erro ao criar orçamento:", orcError);
          alert("Erro ao criar o orçamento.");
          return;
        }

        orcamentoId = orcData[0].id;
      }

      // 2. Preparar os medicamentos para inserir
      const medicamentosToInsert = medicamentos.map(med => {
        const qtdApenasNum = med.quantidade.toString().replace(/\D/g, '');
        const qtdParse = qtdApenasNum ? parseInt(qtdApenasNum, 10) : 1;

        let precoParse = 0;
        if (med.preco) {
          const stringPreco = med.preco.toString();
          const apenasNumVirgula = stringPreco.replace(/[^\d,]/g, '');
          const comPonto = apenasNumVirgula.replace(',', '.');
          precoParse = parseFloat(comPonto);
        }

        return {
          orcamento_id: orcamentoId,
          nome: med.nome,
          principio: med.principio || null,
          quantidade: qtdParse,
          preco: isNaN(precoParse) ? 0 : precoParse
        };
      });

      // 3. Salvar (inserir) novos medicamentos
      const { error: medError } = await supabase
        .from('medicamento_orcamento')
        .insert(medicamentosToInsert);

      if (medError) {
        console.error("Erro ao salvar medicamentos do orçamento:", medError);
        alert("Erro ao salvar medicamentos do orçamento.");
        return;
      }

      alert("Orçamento salvo com sucesso!");
      
      resetForm();
      setIsOrcamentoModalOpen(false);
      fetchHistorico();

    } catch (e) {
      console.error("Exceção ao salvar orçamento:", e);
      alert("Ocorreu um erro ao salvar o orçamento.");
    }
  };

  const handleGerarPdf = () => {
    if (!selectedPacienteId) {
      setValidationMessage("Por favor, selecione um paciente para gerar o PDF.");
      setShowValidationModal(true);
      return;
    }

    const hasEmptyMeds = medicamentos.some(m => !m.nome.trim() || !m.quantidade || !m.preco);
    if (hasEmptyMeds) {
      setValidationMessage("O PDF só pode ser gerado se os dados do medicamento estiverem preenchidos.");
      setShowValidationModal(true);
      return;
    }

    const paciente = {
      nome: searchTerm,
      cpf: pacientes.find(p => p.id === selectedPacienteId)?.cpf || ''
    };

    const medsToPrint = medicamentos.map(med => ({
      nome: med.nome || '',
      principio: med.principio || '',
      quantidade: med.quantidade || '1',
      preco: med.preco || '0'
    }));

    try {
      generateOrcamentoPdf(paciente, medsToPrint, settings);
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
      alert("Ocorreu um erro ao gerar o PDF.");
    }
  };

  const handlePrintOrcamentoFromHistory = (orc: any) => {
    const paciente = {
      nome: orc.paciente_orcamento?.nome || 'Paciente Desconhecido',
      cpf: orc.paciente_orcamento?.cpf || ''
    };

    const medsToPrint = (orc.medicamento_orcamento || []).map((med: any) => ({
      nome: med.nome || '',
      principio: med.principio || '',
      quantidade: med.quantidade ? med.quantidade.toString() : '1',
      preco: typeof med.preco === 'number' ? med.preco.toFixed(2).replace('.', ',') : (med.preco || '0')
    }));

    try {
      generateOrcamentoPdf(paciente, medsToPrint, settings);
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
      alert("Ocorreu um erro ao gerar o PDF.");
    }
  };

  const handleEditOrcamento = (orc: any) => {
    setEditingOrcamentoId(orc.id);
    setSelectedPacienteId(orc.paciente_id || '');
    setSearchTerm(orc.paciente_orcamento?.nome || '');
    
    if (orc.medicamento_orcamento && orc.medicamento_orcamento.length > 0) {
      const medsForEdit = orc.medicamento_orcamento.map((med: any) => ({
        id: Date.now().toString() + Math.random().toString().substring(2, 6),
        nome: med.nome || '',
        principio: med.principio || '',
        quantidade: med.quantidade ? med.quantidade.toString() : '',
        preco: typeof med.preco === 'number' ? med.preco.toFixed(2).replace('.', ',') : (med.preco || '')
      }));
      setMedicamentos(medsForEdit);
    } else {
      setMedicamentos([{ id: Date.now().toString(), nome: '', principio: '', quantidade: '', preco: '' }]);
    }
    
    setIsOrcamentoModalOpen(true);
  };

  const handleDeleteOrcamento = (orcId: string) => {
    setOrcamentoToDelete(orcId);
  };

  const confirmDelete = async () => {
    if (!orcamentoToDelete) return;
    
    try {
      // Deletar os medicamentos filhos primeiro
      const { error: delError } = await supabase
        .from('medicamento_orcamento')
        .delete()
        .eq('orcamento_id', orcamentoToDelete);

      if (delError) {
        console.error("Erro ao deletar medicamentos:", delError);
      }

      // Deletar o orçamento (pai)
      const { error } = await supabase
        .from('orcamentos_judiciais')
        .delete()
        .eq('id', orcamentoToDelete);

      if (error) {
        console.error("Erro ao excluir orçamento:", error);
      } else {
        fetchHistorico();
      }
    } catch (e) {
      console.error("Exceção ao excluir orçamento:", e);
    } finally {
      setOrcamentoToDelete(null);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3 lg:space-x-4">
          <Scale className="w-8 h-8 lg:w-10 lg:h-10 text-[#0066b3] dark:text-blue-400 shrink-0" />
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100">Orçamentos Judiciais</h2>
            <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">
              Histórico de orçamentos e emissão de novos documentos judiciais.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button 
            onClick={() => {
              resetForm();
              setIsOrcamentoModalOpen(true);
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0066b3] text-white flex items-center justify-center hover:bg-[#005291] transition-colors shadow-sm"
            title="Novo Orçamento Judicial"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button 
            onClick={() => {
              setNovoPacienteNome('');
              setNovoPacienteCpf('');
              setIsPacienteModalOpen(true);
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-[#162032] border border-gray-300 dark:border-[#1e2b40] text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm"
            title="Cadastrar Novo Paciente"
          >
            <UserPlus className="w-5 h-5 text-[#0066b3] dark:text-blue-400" />
          </button>
        </div>
      </div>

      {/* Histórico como Página Principal */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-[#1e2b40] flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar no histórico por nome do paciente ou CPF..."
              value={searchTermHistorico}
              onChange={(e) => setSearchTermHistorico(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#1e2b40] rounded-xl focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50 dark:bg-white/5 dark:text-white text-sm"
            />
          </div>
          <button
            onClick={fetchHistorico}
            className="w-10 h-10 rounded-full text-[#0066b3] dark:text-blue-400 border border-gray-200 dark:border-[#1e2b40] bg-gray-50/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center transition-colors shadow-xs shrink-0"
            title="Atualizar lista"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {isLoadingHistorico ? (
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-[#1e2b40] flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066b3] dark:border-blue-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Carregando histórico de orçamentos...</p>
          </div>
        ) : filteredHistorico.length === 0 ? (
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-[#1e2b40] flex flex-col items-center justify-center text-center py-16">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">Nenhum orçamento encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm mb-6">
              {searchTermHistorico ? 'Nenhum orçamento corresponde aos filtros de busca.' : 'Ainda não há orçamentos judiciais registrados no sistema.'}
            </p>
            <button
              onClick={() => {
                resetForm();
                setIsOrcamentoModalOpen(true);
              }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#0066b3] text-white rounded-xl hover:bg-[#005291] transition-colors font-medium shadow-sm text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Orçamento</span>
            </button>
          </div>
        ) : (
          filteredHistorico.map((orc: any) => (
            <div key={orc.id} className="relative bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-[#1e2b40] hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3 w-full md:w-1/3 shrink-0">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl mt-0.5 shrink-0">
                  <FileText className="w-5 h-5 text-[#0066b3] dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{orc.paciente_orcamento?.nome || 'Paciente Desconhecido'}</h4>
                  <div className="flex flex-col xl:flex-row xl:items-center text-xs text-gray-500 dark:text-gray-400 gap-1 xl:gap-2 mt-1">
                    {orc.paciente_orcamento?.cpf && (
                      <span className="flex items-center">
                        <span className="font-medium mr-1 uppercase">CPF:</span> {orc.paciente_orcamento.cpf}
                      </span>
                    )}
                    {orc.paciente_orcamento?.cpf && <span className="hidden xl:inline text-gray-300 dark:text-gray-600">•</span>}
                    <span>
                      {new Date(orc.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0 md:border-l md:border-gray-100 md:dark:border-[#1e2b40] md:pl-4">
                <div className="flex flex-wrap gap-2">
                  {(orc.medicamento_orcamento || []).map((med: any, idx: number) => (
                    <div key={idx} className="flex flex-col text-xs bg-gray-50 dark:bg-[#1e2b40] border border-gray-200 dark:border-[#2a3441] rounded-lg px-3 py-1.5 shadow-xs min-w-[130px]">
                      <span className="font-medium text-gray-800 dark:text-gray-200 leading-tight">{med.nome}</span>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <span>Qtd: {med.quantidade}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#0066b3] dark:text-blue-400">
                          R$ {typeof med.preco === 'number' ? med.preco.toFixed(2).replace('.', ',') : med.preco}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões do Card: GERAR PDF > REUTILIZAR > EXCLUIR (Circulares) */}
              <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-[#1e2b40]">
                {/* 1. GERAR PDF */}
                <button
                  onClick={() => handlePrintOrcamentoFromHistory(orc)}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
                  title="Gerar e Imprimir PDF"
                >
                  <Printer className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                {/* 2. REUTILIZAR */}
                <button
                  onClick={() => handleEditOrcamento(orc)}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-[#0066b3]/30 dark:border-blue-400/30 text-[#0066b3] dark:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors shadow-sm bg-white dark:bg-[#162032]"
                  title="Reutilizar orçamento"
                >
                  <Edit className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#0066b3] dark:text-blue-400" />
                </button>

                {/* 3. EXCLUIR */}
                <button
                  onClick={() => handleDeleteOrcamento(orc.id)}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-200 dark:border-[#1e2b40] text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm bg-white dark:bg-[#162032]"
                  title="Excluir orçamento"
                >
                  <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal do Formulário de Orçamento Judicial (Aberto pelo botão circular do cabeçalho ou por Reutilizar) */}
      {isOrcamentoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#111928] w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl border border-gray-200 dark:border-[#1e2b40] flex flex-col overflow-hidden animate-in zoom-in-95 my-auto">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#1e2b40] bg-gray-50/80 dark:bg-[#162032]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#0066b3]/10 dark:bg-blue-500/20 flex items-center justify-center text-[#0066b3] dark:text-blue-400 shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {editingOrcamentoId ? 'Reutilizar / Editar Orçamento' : 'Novo Orçamento Judicial'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Preencha o paciente e os medicamentos para emitir o orçamento.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGerarPdf}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  title="Gerar PDF deste orçamento"
                >
                  <Printer className="w-4 h-4" />
                  <span>Gerar PDF</span>
                </button>
                <button
                  onClick={() => {
                    setIsOrcamentoModalOpen(false);
                    resetForm();
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corpo do Modal: As 2 Colunas de Paciente e Medicamentos */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Coluna da Esquerda: Paciente */}
                <div className="md:col-span-5 flex flex-col">
                  <div className="bg-white dark:bg-[#162032] p-5 md:p-6 rounded-2xl shadow-xs border border-gray-200 dark:border-[#1e2b40] flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-[#1e2b40] pb-2">
                      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100">1. Selecione o Paciente</h4>
                      {!selectedPacienteId && (
                        <button
                          onClick={() => {
                            setNovoPacienteNome(searchTerm);
                            setIsPacienteModalOpen(true);
                          }}
                          className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0066b3] dark:text-blue-400 border border-[#0066b3]/20 dark:border-blue-400/20 flex items-center justify-center hover:bg-[#0066b3] hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-xs"
                          title="Cadastrar Novo Paciente"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    
                    {selectedPacienteId ? (
                      <div className="flex-1 flex flex-col justify-start">
                        <div className="p-5 border border-[#0066b3]/30 dark:border-blue-500/30 bg-blue-50/40 dark:bg-blue-900/20 rounded-2xl shadow-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Paciente Selecionado</p>
                              <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                {pacientes.find(p => p.id === selectedPacienteId)?.nome}
                              </p>
                              {pacientes.find(p => p.id === selectedPacienteId)?.cpf && (
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                  CPF: {pacientes.find(p => p.id === selectedPacienteId)?.cpf}
                                </p>
                              )}
                            </div>
                            <div className="bg-[#0066b3] dark:bg-blue-500 text-white p-1 rounded-full">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => setSelectedPacienteId('')}
                            className="mt-5 px-3 py-1.5 text-xs text-[#0066b3] dark:text-blue-400 border border-[#0066b3]/30 dark:border-blue-400/30 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 font-medium transition-colors w-full"
                          >
                            Trocar Paciente
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-3 mb-4">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Buscar pelo nome..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50 dark:bg-white/5 dark:text-white text-sm"
                            />
                          </div>
                          
                          <div className="relative">
                            <select
                              value={selectedPacienteId || ""}
                              onChange={(e) => {
                                const id = e.target.value;
                                if (id) {
                                  const paciente = pacientes.find(p => p.id === id);
                                  if (paciente) {
                                    setSearchTerm(paciente.nome);
                                    setSelectedPacienteId(id);
                                  }
                                } else {
                                  setSearchTerm('');
                                }
                              }}
                              className="w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-[#162032] font-medium text-gray-700 dark:text-gray-200 text-sm appearance-none cursor-pointer"
                            >
                              <option value="">Selecione o paciente cadastrado...</option>
                              {pacientes.map(paciente => (
                                <option key={paciente.id} value={paciente.id} className="bg-white dark:bg-[#162032] dark:text-gray-200">
                                  {paciente.nome} {paciente.cpf ? `(${paciente.cpf})` : ''}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                        
                        {searchTerm.trim().length > 0 ? (
                          <div className="overflow-y-auto space-y-2 pr-1 flex-1 max-h-[300px]">
                            {filteredPacientes.length === 0 ? (
                              <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-[#1e2b40] text-xs">
                                Nenhum paciente encontrado com "{searchTerm}".
                                <button 
                                  onClick={() => {
                                    setNovoPacienteNome(searchTerm);
                                    setIsPacienteModalOpen(true);
                                  }}
                                  className="mx-auto mt-3 flex items-center justify-center text-[#0066b3] dark:text-blue-400 font-medium hover:underline w-full p-1"
                                >
                                  <UserPlus className="w-3.5 h-3.5 mr-1" />
                                  <span>Cadastrar novo paciente</span>
                                </button>
                              </div>
                            ) : (
                              filteredPacientes.map(_paciente => (
                                <div
                                  key={_paciente.id}
                                  onClick={() => setSelectedPacienteId(_paciente.id)}
                                  className={`p-3 rounded-lg cursor-pointer transition-all border text-xs ${
                                    selectedPacienteId === _paciente.id
                                      ? 'border-[#0066b3] dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/30 shadow-xs'
                                      : 'border-gray-200 dark:border-[#1e2b40] hover:border-[#0066b3]/30 hover:bg-gray-50 dark:hover:bg-gray-800'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-semibold text-gray-800 dark:text-gray-100">{_paciente.nome}</p>
                                      {_paciente.cpf && <p className="text-gray-500 dark:text-gray-400 mt-0.5">CPF: {_paciente.cpf}</p>}
                                    </div>
                                    {selectedPacienteId === _paciente.id && (
                                      <div className="bg-[#0066b3] dark:bg-blue-500 text-white p-1 rounded-full">
                                        <Check className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 dark:border-[#1e2b40] rounded-xl bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs">
                            <Search className="w-6 h-6 text-gray-300 dark:text-gray-600 mb-2" />
                            <p>Digite ou selecione o paciente acima.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Coluna da Direita: Medicamentos */}
                <div className="md:col-span-7 flex flex-col">
                  <div className="bg-white dark:bg-[#162032] p-5 md:p-6 rounded-2xl shadow-xs border border-gray-200 dark:border-[#1e2b40] flex-1">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-[#1e2b40] pb-2">2. Medicamentos do Orçamento</h4>
                    
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      {medicamentos.map((med, index) => (
                        <div key={med.id} className="relative p-4 bg-gray-50/80 dark:bg-[#111928] border border-gray-200 dark:border-[#1e2b40] rounded-xl shadow-xs group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-6 h-6 bg-[#0066b3] dark:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                              {index + 1}
                            </span>
                            {medicamentos.length > 1 && (
                              <button
                                onClick={() => handleRemoveMedicamento(med.id)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors text-xs flex items-center"
                                title="Remover este medicamento"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                Remover
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <div className="sm:col-span-7">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Medicamento *</label>
                              <input
                                id={`medicamento_nome_${index}`}
                                type="text"
                                value={med.nome}
                                onChange={(e) => updateMedicamento(med.id, 'nome', e.target.value)}
                                placeholder="Nome do medicamento"
                                className="w-full px-3 py-1.5 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-white/5 dark:text-white text-xs font-semibold"
                              />
                            </div>
                            
                            <div className="sm:col-span-5">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Princípio Ativo</label>
                              <input
                                type="text"
                                value={med.principio}
                                onChange={(e) => updateMedicamento(med.id, 'principio', e.target.value)}
                                placeholder="Opcional"
                                className="w-full px-3 py-1.5 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-white/5 dark:text-white text-xs"
                              />
                            </div>
                            
                            <div className="sm:col-span-6">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Quantidade *</label>
                              <input
                                type="text"
                                value={med.quantidade}
                                onChange={(e) => updateMedicamento(med.id, 'quantidade', e.target.value)}
                                placeholder="Ex: 2"
                                className="w-full px-3 py-1.5 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-white/5 dark:text-white text-xs"
                              />
                            </div>
                            
                            <div className="sm:col-span-6">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Unitário *</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs">R$</span>
                                <input
                                  type="text"
                                  value={med.preco}
                                  onChange={(e) => handlePrecoChange(med.id, e.target.value)}
                                  placeholder="0,00"
                                  className="w-full pl-7 pr-3 py-1.5 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-white/5 dark:text-white text-xs font-medium"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-[#1e2b40] flex justify-between items-center">
                      <button
                        onClick={handleAddMedicamento}
                        className="flex items-center space-x-1.5 text-xs text-[#0066b3] dark:text-blue-400 font-medium hover:underline p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Outro Medicamento</span>
                      </button>

                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Total de itens: {medicamentos.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-[#1e2b40] bg-gray-50/80 dark:bg-[#162032] flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsOrcamentoModalOpen(false);
                  resetForm();
                }}
                className="px-5 py-2.5 border border-gray-300 dark:border-[#1e2b40] text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveOrcamento}
                className="flex items-center space-x-1.5 px-6 py-2.5 bg-[#0066b3] text-white font-semibold rounded-xl hover:bg-[#005291] transition-colors shadow-sm text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Orçamento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Paciente */}
      {isPacienteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#162032] p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-[#1e2b40] w-full max-w-md animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-[#1e2b40] pb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#0066b3] dark:text-blue-400" />
                <span>Cadastrar Novo Paciente</span>
              </h3>
              <button onClick={() => setIsPacienteModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={novoPacienteNome}
                  onChange={(e) => setNovoPacienteNome(e.target.value)}
                  placeholder="Nome do paciente"
                  className="w-full px-3.5 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-xl focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-white/5 dark:text-white text-sm"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">CPF (Opcional)</label>
                <input
                  type="text"
                  value={novoPacienteCpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-xl focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-white/5 dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-5 mt-5 border-t border-gray-100 dark:border-[#1e2b40]">
              <button
                onClick={() => setIsPacienteModalOpen(false)}
                className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-300 dark:border-[#1e2b40] rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePaciente}
                disabled={!novoPacienteNome.trim()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-[#0066b3] text-white rounded-xl hover:bg-[#005291] font-semibold text-xs transition-colors disabled:opacity-50 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Paciente</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orcamentoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] animate-in fade-in">
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 border border-gray-200 dark:border-[#1e2b40]">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Excluir Orçamento</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">Tem certeza que deseja excluir permanentemente este orçamento? Esta ação não pode ser desfeita.</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setOrcamentoToDelete(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-300 dark:border-[#1e2b40] rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Validação */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] rounded-2xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-[#1e2b40]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Aviso</h3>
            </div>
            
            <div className="mb-6 ml-13">
              <p className="text-gray-600 dark:text-gray-300">
                {validationMessage}
              </p>
            </div>
            
            <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-[#1e2b40]">
              <button
                onClick={() => setShowValidationModal(false)}
                className="px-6 py-2 bg-[#0066b3] dark:bg-blue-600 text-white hover:bg-[#005291] dark:hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
