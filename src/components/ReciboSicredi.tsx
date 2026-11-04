import React, { useState, useEffect } from 'react';
import { Settings, Save, FileText, Printer } from 'lucide-react';
import { supabase } from '../supabase';
import html2pdf from 'html2pdf.js';
import extenso from 'extenso';

export const ReciboSicredi = ({ session }: { session: any }) => {
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [valorSicredi, setValorSicredi] = useState('');
  
  const [empresaNome, setEmpresaNome] = useState('');
  const [empresaCnpj, setEmpresaCnpj] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  const [showSicrediSettings, setShowSicrediSettings] = useState(false);
  const [showSettingsSuccess, setShowSettingsSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [session]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .single();
        
      if (data) {
        if (data.empresa_nome) setEmpresaNome(data.empresa_nome);
        if (data.empresa_cnpj) setEmpresaCnpj(data.empresa_cnpj);
        if (data.rua) setRua(data.rua);
        if (data.numero) setNumero(data.numero);
        if (data.cidade) setCidade(data.cidade);
        if (data.uf) setUf(data.uf);
        if (data.banco) setBanco(data.banco);
        if (data.agencia) setAgencia(data.agencia);
        if (data.conta) setConta(data.conta);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('id')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      const payload = {
        banco: banco,
        agencia: agencia,
        conta: conta,
        updated_at: new Date().toISOString()
      };
      
      if (data?.id) {
        await supabase.from('configuracoes').update(payload).eq('id', data.id);
      } else {
        await supabase.from('configuracoes').insert([payload]);
      }
      
      setShowSettingsSuccess(true);
      setTimeout(() => {
        setShowSettingsSuccess(false);
        setShowSicrediSettings(false);
      }, 3000);
      
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar configurações');
    }
  };

  const handleValorSicrediChange = (value: string) => {
    const onlyDigits = value.replace(/\D/g, '');
    const numberValue = parseInt(onlyDigits, 10);
    if (isNaN(numberValue)) {
      setValorSicredi('');
      return;
    }
    const formattedValue = (numberValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    setValorSicredi(formattedValue);
  };

  const handleGeneratePDFSicredi = () => {
    const numValor = parseFloat(valorSicredi.replace(/\./g, '').replace(',', '.')) || 0;
    if (numValor <= 0) {
      alert("Por favor, informe um valor maior que zero.");
      return;
    }

    const data = new Date();
    const mesExtenso = data.toLocaleString('pt-BR', { month: 'long' });
    const dataExtenso = `${cidade}${uf ? ' - ' + uf : ''}, ${data.getDate()} de ${mesExtenso} de ${data.getFullYear()}.`;

    const valorExtensoText = extenso(numValor, { mode: 'currency' });

    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
   <meta charset="UTF-8">
   <title>Recibo Sicredi</title>
  <style>
    @page { margin: 2.5cm; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 15px; 
      line-height: 1.6; 
      color: #000; 
      margin: 0 auto; 
      padding: 40px; 
      max-width: 21cm; 
      box-sizing: border-box;
    }
    @media print {
      body { padding: 0; max-width: none; }
    }
    
    .titulo-principal { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 40px; }
    
    .texto-recibo { text-align: justify; margin-bottom: 30px; }
    
    .subtitulo { font-weight: bold; margin-bottom: 10px; }
    .dados-bancarios { margin-bottom: 30px; line-height: 1.6; }
    
    .carimbo-container {
      width: 100%;
      margin-top: 50px;
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      page-break-inside: avoid;
    }
    .carimbo-box {
      border: 2px solid #000;
      padding: 25px;
      text-align: center;
      width: 85%;
      border-radius: 8px;
    }
    .carimbo-razao { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
    .carimbo-cnpj { font-size: 15px; margin-bottom: 35px; }
    .assinatura-linha {
      border-top: 1px solid #000;
      width: 80%;
      margin: 0 auto 5px auto;
    }
    .assinatura-texto { font-size: 14px; }
    
    .data-local { text-align: left; margin-bottom: 50px; }
  </style>
</head>
<body>
  <div class="titulo-principal">Recibo de Ressarcimento - Programa Juntos</div>

  <div class="texto-recibo">
    <b>${empresaNome}</b>, inscrito(a) no CNPJ sob o nº <b>${empresaCnpj}</b>, venho por meio deste solicitar para a Cooperativa de Crédito, Poupança e Investimento União Sicredi União RS/ES, inscrita no CNPJ sob o nº 88.894.548/0001-73, o valor de <b>R$ ${valorSicredi}</b>, (<b>${valorExtensoText}</b>), referente ao ressarcimento da utilização do Programa Juntos.
  </div>

  <div class="subtitulo">Dados bancários para ressarcimento</div>
  <div class="dados-bancarios">
  Banco/Número: <b>${banco}</b><br>
  Agência: <b>${agencia}</b><br>
  Conta Corrente: <b>${conta}</b>
  </div>

  <div class="data-local">
    ${dataExtenso}
  </div>

  <div class="carimbo-container">
    <div class="carimbo-box">
      <div class="carimbo-razao">${empresaNome}</div>
      <div class="carimbo-cnpj">CNPJ: ${empresaCnpj}</div>
      <div class="assinatura-linha"></div>
      <div class="assinatura-texto">ASSINATURA DO REPRESENTANTE LEGAL E CARIMBO</div>
    </div>
  </div>
</body>
</html>
`;

    const opt = {
      margin: 0,
      filename: 'recibo_sicredi.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(htmlContent).save();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100">Recibos Sicredi</h2>
          <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">
            Emita recibos do Programa Juntos na hora.
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleGeneratePDFSicredi}
            className="shrink-0 flex items-center justify-center p-3 lg:px-4 lg:py-2 bg-[#0066b3] text-white rounded-full lg:rounded-lg hover:bg-[#005291] transition-colors shadow-sm"
            title="Gerar PDF"
          >
            <Printer className="w-5 h-5 lg:w-4 lg:h-4" />
            <span className="hidden lg:inline lg:ml-2 font-medium">Gerar PDF</span>
          </button>
          <button 
            onClick={() => setShowSicrediSettings(!showSicrediSettings)}
            className="shrink-0 flex items-center justify-center p-3 lg:px-4 lg:py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-full lg:rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors shadow-sm border border-gray-200 dark:border-[#1e2b40]"
            title="Editar Dados Bancários"
          >
            <Settings className="w-5 h-5 lg:w-4 lg:h-4" />
            <span className="hidden lg:inline lg:ml-2 font-medium">Dados Bancários</span>
          </button>
        </div>
      </div>

      {showSicrediSettings ? (
        <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] mb-6 animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0066b3] dark:bg-blue-500"></div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0066b3] dark:text-blue-400" />
            Editar Dados Bancários do Recibo
          </h3>
          
          {showSettingsSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg flex items-center animate-in fade-in slide-in-from-top-2 text-sm">
              <Save className="w-5 h-5 mr-3 shrink-0" />
              Dados bancários salvos com sucesso!
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BANCO / NÚMERO</label>
              <input 
                type="text" 
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-[#162032] dark:text-white text-sm"
                placeholder="Ex: 748"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AGÊNCIA</label>
              <input 
                type="text" 
                value={agencia}
                onChange={(e) => setAgencia(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-[#162032] dark:text-white text-sm"
                placeholder="Ex: 0123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CONTA CORRENTE</label>
              <input 
                type="text" 
                value={conta}
                onChange={(e) => setConta(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-[#1e2b40] rounded-lg focus:ring-2 focus:ring-[#0066b3] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-[#162032] dark:text-white text-sm"
                placeholder="Ex: 12345-6"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100 dark:border-[#1e2b40]">
            <button 
              type="button"
              onClick={() => setShowSicrediSettings(false)}
              className="px-4 py-2 border border-gray-300 dark:border-[#1e2b40] text-gray-700 dark:text-gray-300 rounded-lg bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex items-center space-x-2 px-6 py-2 bg-[#0066b3] text-white rounded-lg hover:bg-[#005291] transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2">
           <div className="bg-white dark:bg-gradient-to-br dark:from-[#162032] dark:to-[#0b1120] rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e2b40] overflow-hidden relative flex flex-col h-full mb-6">
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0066b3]"></div>
             <div className="p-6 md:p-10 flex flex-col items-center justify-center h-full text-center">
               <div className="flex items-center gap-2 mb-6">
                 <FileText className="w-8 h-8 text-[#0066b3]" />
                 <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Valor do Recibo</h3>
               </div>
               
               <div className="w-full max-w-sm">
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase">Valor a Receber (R$)</label>
                   <input
                      type="text"
                      value={valorSicredi}
                     onChange={(e) => handleValorSicrediChange(e.target.value)}
                     className="w-full text-center text-4xl px-4 py-8 border border-gray-300 dark:border-[#1e2b40] rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-[#0066b3] outline-none bg-white dark:bg-[#162032] font-bold text-gray-800 dark:text-white transition-all shadow-inner dark:shadow-black/20"
                     placeholder="0,00"
                   />
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
