import React, { useState, useEffect, useRef } from 'react';
import granLogo from './src/gran.png';
import {
  Printer,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  Edit3,
  Shield,
  Trash2,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Send,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Check,
  Info,
  Building2,
  FileCheck
} from 'lucide-react';

const SAMPLE_DATA = {
  codigoCI: 'CI-2026/089',
  responsavelAbertura: 'Carlos Eduardo Silva',
  cargoAbertura: 'Coordenador de Esportes',
  departamentoAbertura: 'Departamento de Esportes',
  dataAbertura: '2026-09-28',
  prazoRetorno: '2026-10-05',
  destinatario: 'Diretoria de Patrimônio e Manutenção',
  cargoDestinatario: 'Diretor Operacional',
  assunto: 'Solicitação de Manutenção Preventiva no Parque Aquático e Campo Principal',
  prioridade: 'Alta',
  status: 'Em Andamento',
  conteudo: `Solicitamos formalmente a realização de vistoria e manutenção preventiva nos sistemas de filtragem e aquecimento da piscina olímpica social.\n\nAdemais, faz-se necessária a substituição de 4 lâmpadas dos refletores de LED da quadra poliesportiva 2 e do campo de futebol principal, visando a preparação para o Campeonato Interno Gran São João agendado para o próximo mês.\n\nPedimos urgência no retorno sobre o cronograma de atendimento.`,
  dataRetorno: '2026-09-30',
  dataEncerramento: '',
  responsavelAtendimento: 'Roberto Mendonça Santos',
  cargoAtendimento: 'Gerente de Manutenção',
  despachoResposta: 'Solicitação recebida e encaminhada para a equipe técnica terceirizada. Vistoria agendada para 30/09 às 09h00. As lâmpadas de LED já se encontram em estoque para substituição imediata.'
};

const INITIAL_EMPTY_DATA = {
  codigoCI: '',
  responsavelAbertura: '',
  cargoAbertura: '',
  departamentoAbertura: '',
  dataAbertura: new Date().toISOString().split('T')[0],
  prazoRetorno: '',
  destinatario: '',
  cargoDestinatario: '',
  assunto: '',
  prioridade: 'Normal',
  status: 'Em Aberto',
  conteudo: '',
  dataRetorno: '',
  dataEncerramento: '',
  responsavelAtendimento: '',
  cargoAtendimento: '',
  despachoResposta: ''
};

const GRNLogo = ({ className = "w-16 h-20" }: { className?: string }) => (
  <img
    src={granLogo}
    alt="Sociedade Esportiva Gran São João"
    className={`object-contain ${className}`}
  />
);

export default function App() {
  const [formData, setFormData] = useState(INITIAL_EMPTY_DATA);
  const [activeTab, setActiveTab] = useState('split'); // 'edit', 'preview', 'split'
  const [zoomLevel, setZoomLevel] = useState(100);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSavedDraft, setIsSavedDraft] = useState(false);
  const documentRef = useRef(null);

  // Auto load draft from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('grn_ci_draft_data');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        setIsSavedDraft(true);
      } catch (e) {
        console.error('Erro ao carregar rascunho', e);
      }
    } else {
      // Default with sample data for better presentation
      setFormData(SAMPLE_DATA);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setIsSavedDraft(false);
  };

  const handleSaveDraft = () => {
    localStorage.setItem('grn_ci_draft_data', JSON.stringify(formData));
    setIsSavedDraft(true);
    showToast('Rascunho salvo com sucesso no navegador!');
  };

  const handleClearForm = () => {
    if (window.confirm('Deseja realmente limpar todos os campos do formulário?')) {
      setFormData(INITIAL_EMPTY_DATA);
      localStorage.removeItem('grn_ci_draft_data');
      setIsSavedDraft(false);
      showToast('Formulário limpo.');
    }
  };

  const handleLoadSample = () => {
    setFormData(SAMPLE_DATA);
    setIsSavedDraft(false);
    showToast('Dados de exemplo carregados.');
  };

  const handlePrint = () => {
    window.print();
  };

  // Status color badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Em Aberto':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock };
      case 'Em Andamento':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: AlertCircle };
      case 'Respondido':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-300', icon: FileCheck };
      case 'Encerrado':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2 };
      default:
        return { bg: 'bg-slate-100 text-slate-800 border-slate-300', icon: Info };
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased">
      {/* Dynamic Print Styles for exact A4 rendering */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only-container {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .a4-page {
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 12mm !important;
            border: none !important;
            border-radius: 0 !important;
            min-h-0 !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {}
      <header className="no-print bg-slate-900 text-white shadow-md sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-md shadow-sm">
              <GRNLogo className="w-7 h-9" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide flex items-center gap-2">
                Sociedade Esportiva Gran São João
                <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded font-normal">GRN</span>
              </h1>
              <p className="text-xs text-slate-400">Gerador de Comunicação Interna (C.I.)</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 shadow-sm"
              title="Preencher com dados de exemplo"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Carregar Exemplo</span>
            </button>

            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 shadow-sm"
              title="Salvar rascunho localmente"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Salvar Rascunho</span>
            </button>

            <button
              onClick={handleClearForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-red-950/50 text-red-300 hover:text-red-200 rounded-lg transition border border-slate-700 hover:border-red-800 shadow-sm"
              title="Limpar formulário"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden lg:inline">Limpar</span>
            </button>

            <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block"></div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow-md hover:shadow-emerald-900/30 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Gerar PDF</span>
            </button>
          </div>
        </div>
      </header>

      {}
      <nav className="no-print bg-white border-b border-slate-200 shadow-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          {/* Layout Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setActiveTab('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                activeTab === 'split'
                  ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lado a Lado (Edit + Preview)</span>
              <span className="sm:hidden">Dividido</span>
            </button>

            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                activeTab === 'edit'
                  ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Apenas Edição</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                activeTab === 'preview'
                  ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Apenas Documento</span>
            </button>
          </div>

          {/* Quick status & zoom indicator */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            {isSavedDraft && (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <Check className="w-3 h-3" /> Rascunho salvo localmente
              </span>
            )}

            {(activeTab === 'split' || activeTab === 'preview') && (
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                  className="p-1 hover:bg-white rounded text-slate-700"
                  title="Diminuir Zoom"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 font-mono text-[11px] font-semibold w-12 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                  className="p-1 hover:bg-white rounded text-slate-700"
                  title="Aumentar Zoom"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 hover:bg-white rounded text-slate-500 hover:text-slate-800 text-[10px] font-semibold"
                  title="Resetar Zoom"
                >
                  100%
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <Info className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 gap-6">
        <div
          className={`grid gap-6 ${
            activeTab === 'split'
              ? 'lg:grid-cols-12'
              : activeTab === 'edit'
              ? 'grid-cols-1 max-w-3xl mx-auto w-full'
              : 'grid-cols-1 max-w-4xl mx-auto w-full'
          }`}
        >
          {}
          {(activeTab === 'edit' || activeTab === 'split') && (
            <div
              className={`no-print bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ${
                activeTab === 'split' ? 'lg:col-span-5' : ''
              }`}
            >
              {/* Form Title Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">Formulário C.I.</h2>
                    <p className="text-xs text-slate-500">Preencha os campos para atualizar o documento</p>
                  </div>
                </div>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-mono">
                  {formData.codigoCI || 'SEM CÓDIGO'}
                </span>
              </div>

              {/* Form Content Scrollable Area */}
              <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh] text-sm">
                {/* Identification & Control Group */}
                <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Identificação & Controle
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Código / Nº C.I.
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: CI-2026/089"
                        value={formData.codigoCI}
                        onChange={(e) => handleInputChange('codigoCI', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Status do Documento
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                      >
                        <option value="Em Aberto">🟡 Em Aberto</option>
                        <option value="Em Andamento">🔵 Em Andamento</option>
                        <option value="Respondido">🟣 Respondido</option>
                        <option value="Encerrado">🟢 Encerrado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section: Opening Info */}
                <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    Abertura da Comunicação
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Responsável pela Abertura *
                    </label>
                    <input
                      type="text"
                      placeholder="Nome completo do solicitante"
                      value={formData.responsavelAbertura}
                      onChange={(e) => handleInputChange('responsavelAbertura', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Cargo / Setor
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Coordenador"
                        value={formData.cargoAbertura}
                        onChange={(e) => handleInputChange('cargoAbertura', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Data de Abertura *
                      </label>
                      <input
                        type="date"
                        value={formData.dataAbertura}
                        onChange={(e) => handleInputChange('dataAbertura', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Target Info */}
                <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    Destinatário & Prazo
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Destinatário / Setor de Destino *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Diretoria de Patrimônio"
                      value={formData.destinatario}
                      onChange={(e) => handleInputChange('destinatario', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Prazo para Retorno
                      </label>
                      <input
                        type="date"
                        value={formData.prazoRetorno}
                        onChange={(e) => handleInputChange('prazoRetorno', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Prioridade
                      </label>
                      <select
                        value={formData.prioridade}
                        onChange={(e) => handleInputChange('prioridade', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="Baixa">Baixa</option>
                        <option value="Normal">Normal</option>
                        <option value="Alta">Alta</option>
                        <option value="Urgente">Urgente</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section: Content */}
                <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Assunto e Conteúdo da Comunicação
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Assunto Principal *
                    </label>
                    <input
                      type="text"
                      placeholder="Resumo em poucas palavras do tema"
                      value={formData.assunto}
                      onChange={(e) => handleInputChange('assunto', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Conteúdo / Detalhamento da Mensagem *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Descreva detalhadamente a comunicação, solicitação ou informe..."
                      value={formData.conteudo}
                      onChange={(e) => handleInputChange('conteudo', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed resize-y"
                    ></textarea>
                  </div>
                </div>

                {/* Section: Response/Closing */}
                <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Resposta / Despacho do Atendimento
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Data de Retorno
                      </label>
                      <input
                        type="date"
                        value={formData.dataRetorno}
                        onChange={(e) => handleInputChange('dataRetorno', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Data de Encerramento
                      </label>
                      <input
                        type="date"
                        value={formData.dataEncerramento}
                        onChange={(e) => handleInputChange('dataEncerramento', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Responsável pelo Atendimento / Resposta
                    </label>
                    <input
                      type="text"
                      placeholder="Nome do responsável pelo atendimento"
                      value={formData.responsavelAtendimento}
                      onChange={(e) => handleInputChange('responsavelAtendimento', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Despacho / Parecer / Resposta Oficial
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Registre a resposta ou parecer da área consultada..."
                      value={formData.despachoResposta}
                      onChange={(e) => handleInputChange('despachoResposta', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed resize-y"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {}
          {(activeTab === 'preview' || activeTab === 'split') && (
            <div
              className={`flex flex-col items-center overflow-x-auto ${
                activeTab === 'split' ? 'lg:col-span-7' : 'w-full'
              }`}
            >
              {/* Document Container with Zoom Scale */}
              <div
                className="w-full flex justify-center transition-all duration-200"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                {/* Official A4 Printed Sheet View */}
                <div
                  ref={documentRef}
                  className="a4-page print-only-container bg-white text-slate-900 border border-slate-300 shadow-2xl rounded-sm p-8 sm:p-12 w-full max-w-[210mm] min-h-[297mm] flex flex-col justify-between relative my-2 font-sans"
                  style={{ boxSizing: 'border-box' }}
                >
                  {/* Top Decorative Italian Tricolor Bar */}
                  <div className="absolute top-0 left-0 right-0 h-2.5 flex">
                    <div className="w-1/3 bg-[#008C45]"></div>
                    <div className="w-1/3 bg-white"></div>
                    <div className="w-1/3 bg-[#CD212A]"></div>
                  </div>

                  {/* Document Header Section */}
                  <div>
                    <header className="flex items-center justify-between border-b-2 border-slate-800 pb-5 pt-3 mb-6">
                      <div className="flex items-center gap-4">
                        <GRNLogo className="w-16 h-20 flex-shrink-0" />
                        <div>
                          <h1 className="text-xl font-extrabold uppercase tracking-wide text-slate-900 leading-none">
                            Sociedade Esportiva
                          </h1>
                          <h2 className="text-2xl font-black uppercase tracking-wider text-emerald-800 leading-tight">
                            Gran São João
                          </h2>
                          <p className="text-[11px] text-slate-600 font-medium tracking-wider uppercase mt-1">
                            Fundada em 1944 • Limeira - SP
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <div className="bg-slate-900 text-white px-3 py-1 text-sm font-bold tracking-widest uppercase rounded-sm mb-1.5 shadow-sm">
                          Comunicação Interna
                        </div>
                        {formData.codigoCI && (
                          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                            {formData.codigoCI}
                          </span>
                        )}

                        {/* Status Watermark / Stamp */}
                        {formData.status && (
                          <div className="mt-2">
                            {(() => {
                              const badge = getStatusBadge(formData.status);
                              const IconComp = badge.icon;
                              return (
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded border ${badge.bg}`}
                                >
                                  <IconComp className="w-3 h-3" />
                                  {formData.status.toUpperCase()}
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </header>

                    {/* Metadata Table Grid */}
                    <div className="grid grid-cols-12 gap-x-3 gap-y-2 border border-slate-400 text-xs mb-6 rounded-sm overflow-hidden bg-slate-50/50">
                      {/* Row 1 */}
                      <div className="col-span-8 p-2 border-b border-r border-slate-300">
                        <span className="block font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                          Responsável pela Abertura
                        </span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {formData.responsavelAbertura || '—'}
                        </span>
                        {formData.cargoAbertura && (
                          <span className="text-slate-500 text-[11px] block">
                            ({formData.cargoAbertura})
                          </span>
                        )}
                      </div>

                      <div className="col-span-4 p-2 border-b border-slate-300">
                        <span className="block font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                          Data de Abertura
                        </span>
                        <span className="font-semibold text-slate-900">
                          {formData.dataAbertura
                            ? new Date(formData.dataAbertura + 'T00:00:00').toLocaleDateString('pt-BR')
                            : '—'}
                        </span>
                      </div>

                      {/* Row 2 */}
                      <div className="col-span-8 p-2 border-b border-r border-slate-300">
                        <span className="block font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                          Destinatário / Setor
                        </span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {formData.destinatario || '—'}
                        </span>
                      </div>

                      <div className="col-span-4 p-2 border-b border-slate-300">
                        <span className="block font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                          Prazo para Retorno
                        </span>
                        <span className="font-semibold text-red-700">
                          {formData.prazoRetorno
                            ? new Date(formData.prazoRetorno + 'T00:00:00').toLocaleDateString('pt-BR')
                            : '—'}
                        </span>
                      </div>

                      {/* Row 3 - Subject */}
                      <div className="col-span-12 p-2.5 bg-slate-100/80 border-b border-slate-300">
                        <span className="block font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                          Assunto
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {formData.assunto || '—'}
                        </span>
                      </div>
                    </div>

                    {/* Main Content Body */}
                    <div className="mb-8">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 bg-slate-200/70 px-3 py-1.5 rounded-t border-t border-x border-slate-300 inline-block">
                        Descrição / Conteúdo da Comunicação
                      </h3>
                      <div className="p-4 border border-slate-300 rounded-b rounded-tr bg-white min-h-[180px] text-sm text-slate-800 leading-relaxed whitespace-pre-line shadow-inner">
                        {formData.conteudo || (
                          <span className="text-slate-400 italic">
                            Nenhum conteúdo informado até o momento...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Section Response / Dispatch */}
                    <div className="mb-6">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 bg-slate-200/70 px-3 py-1.5 rounded-t border-t border-x border-slate-300 inline-block">
                        Resposta / Despacho da Área de Atendimento
                      </h3>
                      <div className="p-4 border border-slate-300 rounded-b rounded-tr bg-slate-50/50 min-h-[110px] text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                        {formData.despachoResposta ? (
                          formData.despachoResposta
                        ) : (
                          <span className="text-slate-400 italic text-xs">
                            Campo reservado para o parecer ou resposta da diretoria/setor consultado.
                          </span>
                        )}
                      </div>

                      {/* Return Dates Table */}
                      <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                        <div className="border border-slate-300 p-2 rounded bg-white flex justify-between items-center">
                          <span className="font-bold text-slate-500 uppercase text-[10px]">
                            Data de Retorno:
                          </span>
                          <span className="font-semibold text-slate-800">
                            {formData.dataRetorno
                              ? new Date(formData.dataRetorno + 'T00:00:00').toLocaleDateString('pt-BR')
                              : '___/___/______'}
                          </span>
                        </div>

                        <div className="border border-slate-300 p-2 rounded bg-white flex justify-between items-center">
                          <span className="font-bold text-slate-500 uppercase text-[10px]">
                            Data de Encerramento:
                          </span>
                          <span className="font-semibold text-slate-800">
                            {formData.dataEncerramento
                              ? new Date(formData.dataEncerramento + 'T00:00:00').toLocaleDateString('pt-BR')
                              : '___/___/______'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Signatures Block */}
                  <div className="mt-auto pt-6 border-t-2 border-slate-200">
                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-12 text-center pt-8 mb-6">
                      <div>
                        <div className="border-t border-slate-800 pt-1.5">
                          <p className="font-bold text-xs text-slate-900">
                            {formData.responsavelAbertura || 'Responsável pela Abertura'}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                            Emissor / Solicitante
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="border-t border-slate-800 pt-1.5">
                          <p className="font-bold text-xs text-slate-900">
                            {formData.responsavelAtendimento || 'Responsável pelo Atendimento'}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                            Atendimento / Visto
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Official Document Footer */}
                    <div className="text-center text-[10px] text-slate-500 border-t border-slate-200 pt-3 flex items-center justify-between">
                      <span>Sociedade Esportiva Gran São João - Documento Interno Oficial</span>
                      <span>Página 1 de 1</span>
                      <span>Impresso via Sistema GRN</span>
                    </div>

                    {/* Bottom Decorative Italian Tricolor Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
                      <div className="w-1/3 bg-[#008C45]"></div>
                      <div className="w-1/3 bg-white"></div>
                      <div className="w-1/3 bg-[#CD212A]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {}
      <footer className="no-print bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <p>
          Sociedade Esportiva Gran São João © {new Date().getFullYear()} — Módulo de Comunicação Interna.
        </p>
      </footer>
    </div>
  );
}