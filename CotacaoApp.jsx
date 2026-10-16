import React, { useState } from 'react';
import { 
  Printer, 
  Plus, 
  Trash2, 
  Sparkles, 
  RotateCcw, 
  Building2, 
  FileSpreadsheet, 
  Calculator, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut,
  UserCheck
} from 'lucide-react';

export default function CotacaoApp() {
  // Estado dos Metadados do Cabeçalho da Cotação
  const [cabecalho, setCabecalho] = useState({
    centroCusto: 'Manutenção & Obras',
    cotacao: 'COT-2026/042',
    data: '14/10/2026',
    numero: '0896/2026',
    gestao: '01/04/2026 A 31/03/2028',
    solicitadoPor: 'Evandro (Infraestrutura)',
    localUso: 'Complexo Aquático / Sede Social',
    contato: '(19) 99876-5432',
    observacoes: 'Preços com entrega inclusa na sede da Sociedade Esportiva Gran São João.'
  });

  // Estado dos 4 Fornecedores
  const [fornecedores, setFornecedores] = useState([
    { id: 1, nome: 'Comercial Hidro S.A.', condPagto: '30 dias', pEntrega: '5 dias', cidade: 'Limeira - SP', fone: '(19) 3404-1000', fax: '—', email: 'vendas@hidro.com.br', contato: 'Marcos', despacho: 'Próprio' },
    { id: 2, nome: 'Suprimentos Silva Ltd', condPagto: '15/30/45 dias', pEntrega: '3 dias', cidade: 'Campinas - SP', fone: '(19) 3210-9000', fax: '—', email: 'cotacao@silvasup.com', contato: 'Renata', despacho: 'Próprio' },
    { id: 3, nome: 'Distribuidora Paulista', condPagto: 'À vista (5% desc)', pEntrega: '7 dias', cidade: 'São Paulo - SP', fone: '(11) 4002-8922', fax: '—', email: 'atendimento@dpaulista.com', contato: 'Lucas', despacho: 'Terceirizado' },
    { id: 4, nome: 'Materiais Araras Eireli', condPagto: '28 dias', pEntrega: '10 dias', cidade: 'Araras - SP', fone: '(19) 3541-0000', fax: '—', email: 'vendas@ararasmat.com', contato: 'Carla', despacho: 'Próprio' }
  ]);

  // Estado dos Itens Cotados
  const [itens, setItens] = useState([
    { id: 1, quant: 10, unidade: 'Balde', discriminacao: 'Cloro Granulado 60% Balde 10kg', f1Unit: 145.00, f2Unit: 152.00, f3Unit: 139.90, f4Unit: 160.00 },
    { id: 2, quant: 5, unidade: 'Galão', discriminacao: 'Algicida de Choque 5 Litros', f1Unit: 88.00, f2Unit: 82.50, f3Unit: 90.00, f4Unit: 85.00 },
    { id: 3, quant: 20, unidade: 'Unid', discriminacao: 'Filtro Carta/Elemento Filtrante 50 micras', f1Unit: 35.00, f2Unit: 38.00, f3Unit: 34.00, f4Unit: 40.00 }
  ]);

  // Estado dos Aprovadores (Baseado na planilha original)
  const [aprovadores, setAprovadores] = useState([
    { nome: 'EVANDRO', cargo: 'Solicitante / Infra', aprovado: true },
    { nome: 'LUIS GUSTAVO', cargo: 'Gerência Operacional', aprovado: true },
    { nome: 'EDERVAL', cargo: 'Diretoria Financeira', aprovado: false },
    { nome: 'EMERSON', cargo: 'Gerência Administrativa', aprovado: true },
    { nome: 'RAFAEL', cargo: 'Supervisão de Compras', aprovado: true },
    { nome: 'DEP. DE COMPRAS', cargo: 'Setor de Suprimentos', aprovado: true }
  ]);

  const [zoom, setZoom] = useState(100);

  // Manipulação de inputs
  const handleCabecalhoChange = (e) => {
    const { name, value } = e.target;
    setCabecalho(prev => ({ ...prev, [name]: value }));
  };

  const handleFornecedorChange = (index, field, value) => {
    const novos = [...fornecedores];
    novos[index][field] = value;
    setFornecedores(novos);
  };

  const handleItemChange = (id, field, value) => {
    setItens(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field.includes('Unit') || field === 'quant' ? parseFloat(value) || 0 : value };
      }
      return item;
    }));
  };

  const adicionarItem = () => {
    const novoId = itens.length > 0 ? Math.max(...itens.map(i => i.id)) + 1 : 1;
    setItens([
      ...itens,
      { id: novoId, quant: 1, unidade: 'UN', discriminacao: '', f1Unit: 0, f2Unit: 0, f3Unit: 0, f4Unit: 0 }
    ]);
  };

  const removerItem = (id) => {
    setItens(itens.filter(i => i.id !== id));
  };

  const toggleAprovador = (index) => {
    const novos = [...aprovadores];
    novos[index].aprovado = !novos[index].aprovado;
    setAprovadores(novos);
  };

  // Cálculos Financeiros
  const calcularTotalFornecedor = (fornIndex) => {
    const fieldKey = `f${fornIndex + 1}Unit`;
    return itens.reduce((acc, item) => acc + ((item.quant || 0) * (item[fieldKey] || 0)), 0);
  };

  const totaisFornecedores = [
    calcularTotalFornecedor(0),
    calcularTotalFornecedor(1),
    calcularTotalFornecedor(2),
    calcularTotalFornecedor(3)
  ];

  // Identificar o menor orçamento (vencedor)
  const menorTotal = Math.min(...totaisFornecedores.filter(t => t > 0));

  const formatarMoeda = (val) => {
    return val ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
  };

  const carregarExemplo = () => {
    setCabecalho({
      centroCusto: 'Manutenção & Obras',
      cotacao: 'COT-2026/0896',
      data: '14/10/2026',
      numero: '0896/2026',
      gestao: '01/04/2026 A 31/03/2028',
      solicitadoPor: 'Evandro (Infraestrutura)',
      localUso: 'Complexo Aquático',
      contato: '(19) 3404-5000',
      observacoes: 'Orçamento aprovado conforme menor valor global (Fornecedor 3).'
    });
  };

  const limparFormulario = () => {
    setItens([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-12">
      {/* CSS para Impressão A4 Landscape (Horizontal) */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            border: none !important;
            transform: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
        }
      `}</style>

      {/* Cabeçalho do App (no-print) */}
      <header className="no-print sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-[1700px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 text-white rounded-lg flex items-center justify-center font-black tracking-wider text-xl shadow border border-emerald-500">
              GRN
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Sociedade Esportiva Gran São João[cite: 2]</h1>
              <p className="text-xs text-slate-400">Planilha de Cotação // Compra (Emissão de PDF)[cite: 2]</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={carregarExemplo}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Exemplo
            </button>
            <button
              onClick={limparFormulario}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" /> Limpar Itens
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-md shadow flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" /> Exportar PDF / Imprimir
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-[1800px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* PAINEL DE CONTROLES E FORMULÁRIO (no-print) */}
        <section className="no-print lg:col-span-5 space-y-5">
          
          {/* Dados Gerais da Cotação */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-emerald-800 font-bold text-sm">
              <FileSpreadsheet className="w-4 h-4" /> Dados da Cotação & Requisitante[cite: 2]
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Centro de Custo[cite: 2]</label>
                <input
                  type="text"
                  name="centroCusto"
                  value={cabecalho.centroCusto}
                  onChange={handleCabecalhoChange}
                  className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Cotação Nº[cite: 2]</label>
                <input
                  type="text"
                  name="cotacao"
                  value={cabecalho.cotacao}
                  onChange={handleCabecalhoChange}
                  className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Data[cite: 2]</label>
                <input
                  type="text"
                  name="data"
                  value={cabecalho.data}
                  onChange={handleCabecalhoChange}
                  className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Número Req.[cite: 2]</label>
                <input
                  type="text"
                  name="numero"
                  value={cabecalho.numero}
                  onChange={handleCabecalhoChange}
                  className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Gestão[cite: 2]</label>
                <input
                  type="text"
                  name="gestao"
                  value={cabecalho.gestao}
                  onChange={handleCabecalhoChange}
                  className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Solicitado Por[cite: 2]</label>
                <input
                  type="text"
                  name="solicitadoPor"
                  value={cabecalho.solicitadoPor}
                  onChange={handleCabecalhoChange}
                  className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Local de Uso[cite: 2]</label>
                <input
                  type="text"
                  name="localUso"
                  value={cabecalho.localUso}
                  onChange={handleCabecalhoChange}
                  className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Contato Solicitante[cite: 2]</label>
                <input
                  type="text"
                  name="contato"
                  value={cabecalho.contato}
                  onChange={handleCabecalhoChange}
                  className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Dados dos Fornecedores (4) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-emerald-800 font-bold text-sm">
              <Building2 className="w-4 h-4" /> Cadastro de Fornecedores (Até 4)[cite: 2]
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {fornecedores.map((f, idx) => (
                <div key={f.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                  <span className="font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                    FORNECEDOR {idx + 1}[cite: 2]
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Razão Social / Nome"
                      value={f.nome}
                      onChange={(e) => handleFornecedorChange(idx, 'nome', e.target.value)}
                      className="col-span-2 p-1 border rounded font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Condi. Pagto"
                      value={f.condPagto}
                      onChange={(e) => handleFornecedorChange(idx, 'condPagto', e.target.value)}
                      className="p-1 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="P. Entrega"
                      value={f.pEntrega}
                      onChange={(e) => handleFornecedorChange(idx, 'pEntrega', e.target.value)}
                      className="p-1 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={f.cidade}
                      onChange={(e) => handleFornecedorChange(idx, 'cidade', e.target.value)}
                      className="p-1 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Telefone"
                      value={f.fone}
                      onChange={(e) => handleFornecedorChange(idx, 'fone', e.target.value)}
                      className="p-1 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Contato"
                      value={f.contato}
                      onChange={(e) => handleFornecedorChange(idx, 'contato', e.target.value)}
                      className="p-1 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Despacho (Próprio/Terceiro)"
                      value={f.despacho}
                      onChange={(e) => handleFornecedorChange(idx, 'despacho', e.target.value)}
                      className="p-1 border rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gerenciador de Itens e Valores */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Calculator className="w-4 h-4" /> Itens e Preços Unitários[cite: 2]
              </div>
              <button
                onClick={adicionarItem}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Item
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {itens.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Descrição do Item / Produto"
                      value={item.discriminacao}
                      onChange={(e) => handleItemChange(item.id, 'discriminacao', e.target.value)}
                      className="w-full p-1 border rounded font-semibold bg-white"
                    />
                    <button
                      onClick={() => removerItem(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">Qtd:</span>
                      <input
                        type="number"
                        value={item.quant}
                        onChange={(e) => handleItemChange(item.id, 'quant', e.target.value)}
                        className="w-full p-1 border rounded bg-white text-center"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">Unid:</span>
                      <input
                        type="text"
                        value={item.unidade}
                        onChange={(e) => handleItemChange(item.id, 'unidade', e.target.value)}
                        className="w-full p-1 border rounded bg-white text-center"
                      />
                    </div>
                  </div>

                  {/* Preços unitários para cada fornecedor */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-500">F1 Unit (R$):</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.f1Unit}
                        onChange={(e) => handleItemChange(item.id, 'f1Unit', e.target.value)}
                        className="w-full p-1 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-500">F2 Unit (R$):</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.f2Unit}
                        onChange={(e) => handleItemChange(item.id, 'f2Unit', e.target.value)}
                        className="w-full p-1 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-500">F3 Unit (R$):</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.f3Unit}
                        onChange={(e) => handleItemChange(item.id, 'f3Unit', e.target.value)}
                        className="w-full p-1 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-500">F4 Unit (R$):</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.f4Unit}
                        onChange={(e) => handleItemChange(item.id, 'f4Unit', e.target.value)}
                        className="w-full p-1 border rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuração dos Vistos / Aprovadores */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-emerald-800 font-bold text-sm">
              <UserCheck className="w-4 h-4" /> Vistos e Aprovadores[cite: 2]
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {aprovadores.map((ap, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleAprovador(idx)}
                  className={`p-2 rounded border text-left flex items-center justify-between transition ${
                    ap.aprovado ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span className="font-bold text-[11px]">{ap.nome}</span>
                  {ap.aprovado && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

        </section>

        {/* PRÉ-VISUALIZAÇÃO DA FOLHA A4 HORIZONTAL (EXPORTÁVEL / IMPRIMÍVEL) */}
        <section className="lg:col-span-7 flex flex-col items-center">
          
          {/* Controles de Zoom da Visualização */}
          <div className="no-print w-full max-w-[297mm] mb-3 flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">
              Pré-visualização A4 Horizontal (Landscape) • Impressão fiel ao modelo original[cite: 2]
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 text-slate-600 hover:bg-slate-100 rounded"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono w-12 text-center text-slate-600">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(120, zoom + 10))}
                className="p-1 text-slate-600 hover:bg-slate-100 rounded"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DOCUMENTO IMPRESSO A4 HORIZONTAL (297mm x 210mm) */}
          <div 
            className="w-full overflow-x-auto flex justify-center pb-8"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <div className="print-area w-[297mm] min-h-[210mm] bg-white p-[10mm] shadow-2xl border border-slate-300 text-slate-900 font-sans box-border text-[11px]">
              
              {/* CABEÇALHO DO DOCUMENTO GRN */}
              <div className="border-2 border-slate-900 p-2 mb-2">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-gradient-to-r from-emerald-700 via-white to-red-600 border-2 border-slate-900 rounded-b-full flex items-center justify-center p-0.5">
                      <div className="w-full h-full bg-slate-900 rounded-b-full flex items-center justify-center">
                        <span className="font-black text-amber-400 text-base">GRN</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="font-black text-base uppercase tracking-tight text-slate-900">
                        SOCIEDADE ESPORTIVA GRAN SÃO JOÃO[cite: 2]
                      </h2>
                      <h3 className="font-bold text-xs uppercase text-emerald-800 tracking-wider">
                        PLANILHA DE COTAÇÃO // COMPRA[cite: 2]
                      </h3>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[10px]">
                    <div><strong className="text-slate-600">NÚMERO:</strong> {cabecalho.numero || '—'}[cite: 2]</div>
                    <div><strong className="text-slate-600">DATA:</strong> {cabecalho.data || '—'}[cite: 2]</div>
                    <div><strong className="text-slate-600">GESTÃO:</strong> {cabecalho.gestao || '—'}[cite: 2]</div>
                  </div>
                </div>

                {/* METADADOS DO CABEÇALHO */}
                <div className="grid grid-cols-4 gap-2 text-[10px] bg-slate-50 p-2 border border-slate-300">
                  <div><strong>CENTRO DE CUSTO:</strong> {cabecalho.centroCusto || '—'}[cite: 2]</div>
                  <div><strong>COTAÇÃO:</strong> {cabecalho.cotacao || '—'}[cite: 2]</div>
                  <div><strong>SOLICITADO POR:</strong> {cabecalho.solicitadoPor || '—'}[cite: 2]</div>
                  <div><strong>LOCAL DE USO:</strong> {cabecalho.localUso || '—'}[cite: 2]</div>
                </div>
              </div>

              {/* TABELA DE FORNECEDORES (CABEÇALHO DAS COLUNAS) */}
              <table className="w-full border-collapse border-2 border-slate-900 text-[10px] mb-2">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold">
                    <th colSpan={3} className="border border-slate-800 p-1 text-left uppercase">
                      ESPECIFICAÇÃO DOS ITENS[cite: 2]
                    </th>
                    {fornecedores.map((f, idx) => (
                      <th key={idx} colSpan={3} className={`border border-slate-800 p-1 text-center uppercase ${
                        totaisFornecedores[idx] === menorTotal && menorTotal > 0 ? 'bg-emerald-700 text-amber-300' : ''
                      }`}>
                        FORNECEDOR {idx + 1}: {f.nome || '—'}[cite: 2]
                      </th>
                    ))}
                  </tr>

                  {/* Detalhes dos Fornecedores */}
                  <tr className="bg-slate-100 text-[9px] text-slate-700">
                    <td colSpan={3} className="border border-slate-400 p-1 font-bold">
                      Condições Comerciais das Propostas[cite: 2]
                    </td>
                    {fornecedores.map((f, idx) => (
                      <td key={idx} colSpan={3} className="border border-slate-400 p-1 leading-tight">
                        <div><strong>CONDI. PAGTO:</strong> {f.condPagto || '—'}[cite: 2]</div>
                        <div><strong>P.ENTREGA:</strong> {f.pEntrega || '—'} | <strong>CIDADE:</strong> {f.cidade || '—'}[cite: 2]</div>
                        <div><strong>FONE:</strong> {f.fone || '—'} | <strong>CONTATO:</strong> {f.contato || '—'}[cite: 2]</div>
                        <div><strong>DESPACHO:</strong> {f.despacho || '—'}[cite: 2]</div>
                      </td>
                    ))}
                  </tr>

                  {/* Subcabeçalho de colunas dos preços */}
                  <tr className="bg-slate-200 font-bold text-center text-[9px] uppercase">
                    <td className="border border-slate-400 p-1 w-12">QUANT[cite: 2]</td>
                    <td className="border border-slate-400 p-1 w-14">UNIDADE[cite: 2]</td>
                    <td className="border border-slate-400 p-1 text-left">DISCRIMINAÇÃO[cite: 2]</td>

                    {/* Repetição para os 4 fornecedores */}
                    {[0, 1, 2, 3].map((fIdx) => (
                      <React.Fragment key={fIdx}>
                        <td className="border border-slate-400 p-1 w-16">UNITÁRIO[cite: 2]</td>
                        <td className="border border-slate-400 p-1 w-12">PREÇO[cite: 2]</td>
                        <td className="border border-slate-400 p-1 w-20">TOTAL[cite: 2]</td>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {itens.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="border border-slate-300 p-4 text-center text-slate-400 italic">
                        Nenhum item adicionado à cotação.
                      </td>
                    </tr>
                  ) : (
                    itens.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="border border-slate-300 p-1 text-center font-bold">{item.quant}</td>
                        <td className="border border-slate-300 p-1 text-center">{item.unidade}</td>
                        <td className="border border-slate-300 p-1 font-medium">{item.discriminacao || '—'}</td>

                        {/* Fornecedor 1 */}
                        <td className="border border-slate-300 p-1 text-right">{formatarMoeda(item.f1Unit)}</td>
                        <td className="border border-slate-300 p-1 text-center text-[8px] text-slate-400">R$</td>
                        <td className="border border-slate-300 p-1 text-right font-semibold">
                          {formatarMoeda((item.quant || 0) * (item.f1Unit || 0))}
                        </td>

                        {/* Fornecedor 2 */}
                        <td className="border border-slate-300 p-1 text-right">{formatarMoeda(item.f2Unit)}</td>
                        <td className="border border-slate-300 p-1 text-center text-[8px] text-slate-400">R$</td>
                        <td className="border border-slate-300 p-1 text-right font-semibold">
                          {formatarMoeda((item.quant || 0) * (item.f2Unit || 0))}
                        </td>

                        {/* Fornecedor 3 */}
                        <td className="border border-slate-300 p-1 text-right">{formatarMoeda(item.f3Unit)}</td>
                        <td className="border border-slate-300 p-1 text-center text-[8px] text-slate-400">R$</td>
                        <td className="border border-slate-300 p-1 text-right font-semibold">
                          {formatarMoeda((item.quant || 0) * (item.f3Unit || 0))}
                        </td>

                        {/* Fornecedor 4 */}
                        <td className="border border-slate-300 p-1 text-right">{formatarMoeda(item.f4Unit)}</td>
                        <td className="border border-slate-300 p-1 text-center text-[8px] text-slate-400">R$</td>
                        <td className="border border-slate-300 p-1 text-right font-semibold">
                          {formatarMoeda((item.quant || 0) * (item.f4Unit || 0))}
                        </td>
                      </tr>
                    ))
                  )}

                  {/* LINHA DE TOTAL DO ORÇAMENTO */}
                  <tr className="bg-slate-200 font-bold border-t-2 border-slate-900">
                    <td colSpan={3} className="border border-slate-400 p-1.5 text-right uppercase text-slate-800">
                      VALOR TOTAL DO ORÇAMENTO[cite: 2]
                    </td>

                    {totaisFornecedores.map((total, idx) => {
                      const eOMenor = total === menorTotal && menorTotal > 0;
                      return (
                        <td 
                          key={idx} 
                          colSpan={3} 
                          className={`border border-slate-400 p-1.5 text-right font-extrabold text-xs ${
                            eOMenor ? 'bg-emerald-100 text-emerald-900 border-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {formatarMoeda(total)}
                          {eOMenor && <span className="block text-[8px] font-normal text-emerald-700">✓ MELHOR OPÇÃO</span>}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>

              {/* OBSERVAÇÕES / NOTAS */}
              {cabecalho.observacoes && (
                <div className="border border-slate-300 p-2 mb-3 rounded bg-slate-50 text-[10px]">
                  <strong>OBSERVAÇÕES / NOTAS:</strong>[cite: 2] {cabecalho.observacoes}
                </div>
              )}

              {/* BLOCO DE APROVAÇÕES E ASSINATURAS (CONFORME O MODELO ORIGINAL) */}
              <div className="border-2 border-slate-900 p-2 bg-slate-50">
                <div className="text-[10px] font-bold uppercase mb-2 border-b border-slate-300 pb-1 text-slate-700">
                  APROVADO POR[cite: 2]
                </div>

                <div className="grid grid-cols-6 gap-2 text-center text-[9px]">
                  {aprovadores.map((ap, idx) => (
                    <div key={idx} className="border border-slate-300 p-1.5 bg-white rounded flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{ap.nome}[cite: 2]</div>
                        <div className="text-[8px] text-slate-500">{ap.cargo}</div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200">
                        {ap.aprovado ? (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded text-[8px] border border-emerald-200">
                            ✓ VISTADO
                          </span>
                        ) : (
                          <span className="text-slate-300 italic text-[8px]">Aguardando</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}