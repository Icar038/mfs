import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { calculateRevisional, 
  calculateTrabalhista, 
  calculateHorasExtras, 
  calculateRecisaoTrab, 
  calculateApuracaodePontoHorasExtras,
  calculateLiquidacaosentencainicial,
  calculateSeguroDesemprego,
  calculateAtualizacaoCivil,
  calculateRevisaoFGTS,
  calculatePisPasep,
  calculatePensaoAlimenticia,
  calculateDistratoImoveis,
  calculateRevisaoAluguel,
  calculateHeranca,
  calculateDivorcio,
  calculateParcelamentoCPC916,
  calculateAtualizacaoFazenda,
  calculatePlanejamentoSucessorio,
  calculatePrevidenciaRGPS,
  calculateRestituicaoINSS,
  calculateAnalisePrevidenciaria,
  calculateBPCLOAS,
  calculateLiquidacaoSentencaPrevidenciaria,
  calculateContribuicoesAtraso,
  calculateComplementacaoPrevidenciaria,
  calculateRPPSUniao,
  calculateRPPSEstados,
  calculateRPPSMunicipios,
  calculateSuperendividamento,
  //calculateRevisaoRMCRCC,

 } from "../../calculoscode/Calculoscode";
import { generatePDF } from "../../calculoscode/calculopdf";
import axios from "axios";
import { getBANK, getEstados, getMunicipios  } from "../../Services/APIS";
import { Checkbox } from "@material-tailwind/react";
import { addMonths, format, parseISO } from "date-fns";


export function CheckboxColors() {
  return (
    <div className="flex w-max gap-4">
      <Checkbox color="blue" defaultChecked />
    </div>
  );
}

Modal.setAppElement("#root");

const calculations = [
  { id: "revisional", title: "Cálculo Revisional", statuscalc: "CIVIL" },
  { id: "trabalhista", title: "Cálculo Trabalhista Base", statuscalc: "TRABALHISTA" },
  { id: "Simulador-Verbas-Extras", title: "Simulador de Verbas, Horas Extras e Reflexos", statuscalc: "TRABALHISTA" },
  { id: "Rescisao-Trabalho", title: "Rescisão do Contrato de Trabalho", statuscalc: "TRABALHISTA"},
  { id: "Apuracao-de-Ponto-Horas-Extras", title: "Apuração de Ponto e Horas Extras", statuscalc: "TRABALHISTA"},
  { id: "Liquidacao-sentenca-inicial", title: "Liquidação de sentença/inicial", statuscalc: "TRABALHISTA"},
  { id: "Seguro-desemprego", title: "Seguro Desemprego", statuscalc: "TRABALHISTA"},
  { id: "Atualizacao-Debitos-Liquidação-Civil", title: "Atualização de Débitos e Liquidação Civil", statuscalc: "CIVIL"},
  { id: "Revisao-FGTS", title: "Revisão do FGTS", statuscalc: "CIVIL"},
  { id: "pisPasep", title: "Cálculo PIS/PASEP", statuscalc: "TRABALHISTA" },
  { id: "Pensao-Alimenticia", title: "Pensao-Alimenticia", statuscalc: "CIVIL"},
  { id: "Distrato-Imoveis", title: "Distrato de Imóveis", statuscalc: "CIVIL"},
  { id: "Revisao-Alugueis", title: "Revisão de Aluguéis", statuscalc: "CIVIL"},
  { id: "Heranca", title: "Herança", statuscalc: "CIVIL"},
  { id: "Divorcio", title: "Divórcio", statuscalc: "CIVIL"},
  { id: "Parcelamento-CPC-916", title: "Parcelamento do art. 916 do CPC", statuscalc: "CIVIL"},
  { id: "Atualizacao-Debitos-Fazenda-Publica", title: "Atualização de Débitos e Liquidação - Fazenda Pública", statuscalc: "CIVIL"},
  { id: "Planejamento-Sucessorio", title: "Planejamento Sucessório", statuscalc: "CIVIL"},
  { id: "Planejamento-Concessao-Revisao-RGPS", title: "Planejamento, Concessão, Revisão e Restabelecimento [RGPS]", statuscalc: "PREVIDENCIÁRIO"},
  { id: "Restituicao-INSS-Acima-Teto", title: "Restituição INSS acima do teto", statuscalc: "PREVIDENCIÁRIO"},
  { id: "Analise-Previdenciaria-Rapida", title: "Análise Previdenciária Rápida", statuscalc: "PREVIDENCIÁRIO"},
  { id: "Analise-BPC-LOAS", title: "Análise de Requisitos do BPC/LOAS", statuscalc: "PREVIDENCIÁRIO"},
  { id: "Liquidacao-Sentenca-Previdenciaria", title: "Liquidação de Sentença", statuscalc: "PREVIDENCIÁRIO"},
  { id: "Contribuicoes-Atraso", title: "Contribuições em Atraso", statuscalc: "PREVIDENCIÁRIO"},
  { id: "Complementacao-Previdenciaria", title: "Complementação", statuscalc: "PREVIDENCIÁRIO"},
  { id: "RPPS-Uniao-Planejamento-Concessao-Revisao", title: "RPPS União - Planejamento, Concessão e Revisão", statuscalc: "PREVIDENCIÁRIO"},
  { id: "RPPS-Estados-Planejamento-Concessao-Revisao", title: "RPPS Estados - Planejamento, Concessão e Revisão", statuscalc: "PREVIDENCIÁRIO"},
  { id: "RPPS-Municipios-Planejamento-Concessao-Revisao", title: "RPPS Municípios - Planejamento, Concessão e Revisão - Principais cidades disponíveis", statuscalc: "PREVIDENCIÁRIO"},
  { id: "Superendividamento", title: "Superendividamento", statuscalc: "BANCARIO"},
  //{ id: "Revisao-RMC-RCC", title: "Revisão da RMC e RCC com importador HISCRE", statuscalc: "BANCARIO"},
  //{ id: "Revisao-TUSD-TUST", title: "Revisão da TUSD/TUST", statuscalc: "TRIBUTARIO"},
  //{ id: "Comparação Regimes Tributários PJ", title: "Comparação Regimes Tributários PJ", statuscalc: "TRIBUTARIO"},
  //{ id: "RCT de Clínicas de Saúde", title: "RCT de Clínicas de Saúde", statuscalc: "TRIBUTARIO"},
  //{ id: "Revisão de alíquotas e base de cálculo de impostos", title: "Revisão de alíquotas e base de cálculo de impostos", statuscalc: "TRIBUTARIO"},
  //{ id: "Tese do Século", title: "Tese do Século", statuscalc: "TRIBUTARIO"},
  //{ id: "Exclusão do ISS da base de PIS/COFINS", title: "Exclusão do ISS da base de PIS/COFINS", statuscalc: "TRIBUTARIO"},
  //{ id: "Limite de 20 SM em contribuições de terceiros", title: "Limite de 20 SM em contribuições de terceiros", statuscalc: "TRIBUTARIO"},
  //{ id: "Exclusão do PIS/COFINS da própria base", title: "Exclusão do PIS/COFINS da própria base", statuscalc: "TRIBUTARIO"},
  //{ id: "Prescrição Punitiva", title: "Prescrição Punitiva", statuscalc: "PENAL"},
  //{ id: "Dosimetria da Pena", title: "Dosimetria da Pena", statuscalc: "PENAL"},
  //{ id: "Progressão de Regime", title: "Progressão de Regime", statuscalc: "PENAL"},

];

const statusColors = {
  'TRABALHISTA': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500',
  'CIVIL': 'bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500',
  'PREVIDENCIÁRIO': 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500',
  'BANCARIO': 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500',
  'TRIBUTARIO': 'bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500',
  'PENAL': 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white',
};

const daysOfWeek = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];

const Calculos = ({ handleCalculation }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCalc, setSelectedCalc] = useState(null);
  const [formData, setFormData] = useState({});
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // Estado para armazenar o resultado
  const [extraHoursMonths, setExtraHoursMonths] = useState([]);

  const openModal = (calc) => {
    setSelectedCalc(calc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({});
    setResult(null); // Limpar o resultado ao fechar o modal
    setExtraHoursMonths([]);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", formData); // Debugging log

    if (selectedCalc?.id === "revisional") {
      const calculationResult = calculateRevisional(formData);
      setResult(calculationResult);

    } else if (selectedCalc?.id === "trabalhista") {
      const calculationResult = calculateTrabalhista(formData);
      setResult(calculationResult);

    } else if (selectedCalc?.id === "Apuracao-de-Ponto-Horas-Extras") {
      const calculationResult = calculateApuracaodePontoHorasExtras(formData);
      setResult(calculationResult);

    } else if (selectedCalc?.id === "Simulador-Verbas-Extras") {
      const calculationResult = calculateHorasExtras(formData);
      setResult(calculationResult);

    } else if (selectedCalc?.id === "Rescisao-Trabalho") {
      const calculationResult = calculateRecisaoTrab(formData);
      setResult(calculationResult);

    } else if (selectedCalc?.id === "Liquidacao-sentenca-inicial") {
      const calculationResult = calculateLiquidacaosentencainicial(formData);
      setResult(calculationResult);

    } else if (selectedCalc?.id === "Seguro-desemprego") {
      const calculationResult = calculateSeguroDesemprego(formData);
      setResult(calculationResult);

    } else if (selectedCalc?.id === "Atualizacao-Debitos-Liquidação-Civil") {
      const calculationResult = calculateAtualizacaoCivil(formData);
      setResult(calculationResult);

    } else if (selectedCalc?.id === "Revisao-FGTS") {
      const calculationResult = calculateRevisaoFGTS(formData);
      setResult(calculationResult);


    } else if (selectedCalc?.id === "pisPasep") {
      const calculationResult = calculatePisPasep(formData);
      setResult(calculationResult);


    } else if (selectedCalc?.id === "Pensao-Alimenticia") {
      const calculationResult = calculatePensaoAlimenticia(formData);
      setResult(calculationResult);


    } else if (selectedCalc?.id === "Distrato-Imoveis") {
      const calculationResult = calculateDistratoImoveis(formData);
      setResult(calculationResult); 

       
    }  else if (selectedCalc?.id === "Revisao-Alugueis") {
      const calculationResult = calculateRevisaoAluguel(formData);
      setResult(calculationResult); 


    } else if (selectedCalc?.id === "Heranca") {
      const calculationResult = calculateHeranca(formData);
      setResult(calculationResult); 


    } else if (selectedCalc?.id === "Divorcio") {
      const calculationResult = calculateDivorcio(formData);
      setResult(calculationResult); 


    } else if (selectedCalc?.id === "Parcelamento-CPC-916") {
      const calculationResult = calculateParcelamentoCPC916(formData);
      setResult(calculationResult); 

      
    } else if (selectedCalc?.id === "Atualizacao-Debitos-Fazenda-Publica") {
      const calculationResult = calculateAtualizacaoFazenda(formData);
      setResult(calculationResult); 
      

    } else if (selectedCalc?.id === "Planejamento-Sucessorio") {
      const calculationResult = calculatePlanejamentoSucessorio(formData);
      setResult(calculationResult); 
      
      
    } else if (selectedCalc?.id === "Planejamento-Concessao-Revisao-RGPS") {
      const calculationResult = calculatePrevidenciaRGPS(formData);
      setResult(calculationResult);
    
      
    } else if (selectedCalc?.id === "Restituicao-INSS-Acima-Teto") {
      const calculationResult = calculateRestituicaoINSS(formData);
      setResult(calculationResult);

      
    } else if (selectedCalc?.id === "Analise-Previdenciaria-Rapida") {
      const calculationResult = calculateAnalisePrevidenciaria(formData);
      setResult(calculationResult);


    } else if (selectedCalc?.id === "Analise-BPC-LOAS") {
      const calculationResult = calculateBPCLOAS(formData);
      setResult(calculationResult);

      
    } else if (selectedCalc?.id === "Liquidacao-Sentenca-Previdenciaria") {
      const calculationResult = calculateLiquidacaoSentencaPrevidenciaria(formData);
      setResult(calculationResult);

      
    } else if (selectedCalc?.id === "Contribuicoes-Atraso") {
      const calculationResult = calculateContribuicoesAtraso(formData);
      setResult(calculationResult);

      
    } else if (selectedCalc?.id === "Complementacao-Previdenciaria") {
      const calculationResult = calculateComplementacaoPrevidenciaria(formData);
      setResult(calculationResult);

      
    } else if (selectedCalc?.id === "RPPS-Uniao-Planejamento-Concessao-Revisao") {
      const calculationResult = calculateRPPSUniao(formData);
      setResult(calculationResult);

      
    } else if (selectedCalc?.id === "RPPS-Estados-Planejamento-Concessao-Revisao") {
      const calculationResult = calculateRPPSEstados(formData);
      setResult(calculationResult);

      
    } else if (selectedCalc?.id === "RPPS-Municipios-Planejamento-Concessao-Revisao") {
      const calculationResult = calculateRPPSMunicipios(formData);
      setResult(calculationResult);

      
    } else if (selectedCalc?.id === "Superendividamento") {
      const calculationResult = calculateSuperendividamento(formData);
      setResult(calculationResult);

      
    //} else if (selectedCalc?.id === "Revisao-RMC-RCC") {
     // const calculationResult = calculateRevisaoRMCRCC(formData);
     // setResult(calculationResult);

      
    }
    
  };



  console.log("Resultado do cálculo:", result);

  const handleDownloadPDF = () => {
    if (result) {
      generatePDF(selectedCalc?.id, result, formData);
    }
  };

  useEffect(() => {
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const bankList = await getBANK();
        setBanks(bankList);
      } catch (err) {
        setError("Erro ao carregar bancos. Tente novamente mais tarde.");
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    const fetchEstados = async () => {
      const estadosData = await getEstados();
      setEstados(estadosData);
    };
  
    fetchEstados();
  }, []);
  
  const handleStateChange = async (event) => {
    const uf = event.target.value;
    setEstadoSelecionado(uf);
  
    if (uf) {
      const municipiosData = await getMunicipios(uf);
      setMunicipios(municipiosData);
    } else {
      setMunicipios([]);
    }
  };

  useEffect(() => {
    if (formData.iniciohorasextras && formData.finalhorasextras) {
      const start = parseISO(formData.iniciohorasextras);
      const end = parseISO(formData.finalhorasextras);
      const months = [];
      let current = start;

      while (current <= end) {
        months.push(format(current, "MMM yyyy"));
        current = addMonths(current, 1);
      }

      setExtraHoursMonths(months);
    }
  }, [formData.iniciohorasextras, formData.finalhorasextras]);

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculations.map((calc) => (
          <div key={calc.id} className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">{calc.title}</h2>
            {calc.statuscalc && (
              <span
                className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${statusColors[calc.statuscalc]}`}
              >
                {calc.statuscalc}
              </span>
            )}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => openModal(calc)}
            >
              Realizar Cálculo
            </button>
          </div>
        ))}
      </div>

      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              transform: "translate(-50%, -50%)",
              padding: "0",
              borderRadius: "10px",
              width: "80%",
              maxWidth: "700px",
              height: "60vh",
              overflow: "hidden",
            },
          }}
        >
          <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-white p-4 border-b">
              <h2 className="text-2xl font-bold">{selectedCalc?.title}</h2>
            </div>
            <div className="p-4 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
{selectedCalc?.id === "revisional" && (
                  <>
                    <select
                      className="w-full p-2 border rounded-lg"
                      onChange={(e) => handleInputChange("amortizacao", e.target.value)}
                    >
                      <option value="">Selecione o Método de Amortização</option>
                      <option value="price">Tabela Price</option>
                      <option value="sac">Tabela SAC</option>
                    </select>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Valor Principal"
                      onChange={(e) => handleInputChange("valorPrincipal", e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Taxa de Juros Mensal (%)"
                      onChange={(e) => handleInputChange("taxaJuros", e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Taxa de Juros Correta (%)"
                      onChange={(e) => handleInputChange("taxaJuroscorreta", e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Número de Parcelas"
                      onChange={(e) => handleInputChange("parcelas", e.target.value)}
                    />
                    <select
                      className="w-full p-2 border rounded-lg"
                      onChange={(e) => handleInputChange("instituicaoFinanceira", e.target.value)}
                    >
                      <option value="">Selecione a Instituição Financeira</option>
                      {loadingBanks && <option>Carregando bancos...</option>}
                      {error && <option disabled>{error}</option>}
                      {!loadingBanks &&
                        banks.map((bank) => (
                          <option key={bank.ispb} value={bank.name}>
                            {bank.name}
                          </option>
                        ))}
                    </select>
                  </>
)}


{/* TRABALHISTA */}
{selectedCalc?.id === "trabalhista" && (
  <>
    {/* Linha 1: Salário Bruto e Número de Dependentes */}
    <div className="flex gap-4">
      <div className="w-1/2">
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Salário Bruto"
          onChange={(e) => handleInputChange("salarioBruto", e.target.value)}
        />
      </div>
      <div className="w-1/2">
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Número de Dependentes"
          onChange={(e) => handleInputChange("Dependentes", e.target.value)}
        />
      </div>
    </div>

    {/* Linha 2: Data de Contratação e Data de Demissão */}
    <div className="flex gap-4 mt-4">
      <div className="w-1/2">
        <h1>Data de Contratação</h1>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("datacontratacao", e.target.value)}
        />
      </div>
      <div className="w-1/2">
        <h1>Data de Demissão</h1>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("datademissao", e.target.value)}
        />
      </div>
    </div>

    {/* Linha 3: Motivo e Aviso Prévio */}
    <div className="flex gap-4 mt-4">
      <div className="w-1/2">
        <h1>Motivo</h1>
        <select
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("Motivo-trabalhista", e.target.value)}
        >
          <option value="Demissão-comum-acordo">Demissão de comum acordo</option>
          <option value="Dispensa-sem-justa-causa">Dispensa sem justa causa</option>
          <option value="Pedido-Demissao">Pedido de Demissão</option>
          <option value="Encerramento-ontrato-experiência-antes-Prazo">Encerramento de contrato de experiência antes do Prazo</option>
          <option value="Encerramento-contrato-experiência-Prazo">Encerramento de contrato de experiência no Prazo</option>
          <option value="Aposentadoria-empregado">Aposentadoria do empregado</option>
          <option value="Falecimento-empregador">Falecimento do empregador</option>
        </select>
      </div>
      <div className="w-1/2">
        <h1>Aviso prévio</h1>
        <select
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("Aviso-previo", e.target.value)}
        >
          <option value="Trabalhando">Trabalhando</option>
          <option value="Indenizado-pelo-empregador">Indenizado pelo empregador</option>
          <option value="Nao-cumprido-pelo-empregado">Nao cumprido pelo empregado</option>
          <option value="Encerramento-de-contrato-de-experiência-antes-do-Prazo">Encerramento de contrato de experiência antes do Prazo</option>
          <option value="Dispensado">Dispensado</option>
        </select>
      </div>
    </div>

    {/* Linha 4: Checkbox e Saldo FGTS */}
    <div className="flex gap-4 mt-4">
      <div className="w-1/2">
        <Checkbox id="adquiridas-ano-anterior?" label="Possui férias adquiridas no ano anterior?" value={""} />
      </div>
      <div className="w-1/2">
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Saldo FGTS antes da contratação"
          onChange={(e) => handleInputChange("FGTS-antes-contratação", e.target.value)}
        />
      </div>
    </div>

    {/* Linha 5: Férias Vencidas */}
    <div className="mt-4">
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Férias vencidas"
        onChange={(e) => handleInputChange("Ferias-vencidas", e.target.value)}
      />
    </div>
  </>
)}


{/* Simulador-Verbas-Extras */}
{selectedCalc?.id === "Simulador-Verbas-Extras" && (
  <>
    {/* Linha 1: Salário Bruto e Número de Dependentes */}
    <div className="flex gap-4">
      <div className="w-1/2">
      <h1 className="font-bold"> Início da relação de trabalho</h1>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("iniciorelacaotrabalho", e.target.value)}
        />
      </div>
    </div>

    {/* Linha 2: Data de Início da ocorrência e Final da ocorrência das horas-extras */}
    
    <div className="flex gap-4 mt-4">
    <div className="w-1/2">
      <h1 className="font-bold"> Início da ocorrência das horas-extras</h1>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("iniciohorasextras", e.target.value)}
        />
      </div>
      <div className="w-1/2">
        <h1 className="font-bold"> Final da ocorrência das horas-extras</h1>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("finalhorasextras", e.target.value)}
        />
      </div>
     
  </div>
  <h1 className="font-bold"> Número de horas-extras trabalhadas por dia da semana ao longo deste período</h1>
  {/* Número de horas-extras trabalhadas por dia da semana ao longo deste período */}
  <div className="flex gap-4 mt-4">
  {daysOfWeek.map((day) => (
    <div key={day} className="w-1/5">
      <h1>{day.slice(0, 3)}</h1>
      <input
        type="time"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange(day, e.target.value)}
      />
    </div>
  ))}
  </div>

    {/* Jornada mensal de trabalho */}
    <div className="flex gap-4 mt-4">
    <div className="w-1/2">
        <h1 className="font-bold">Jornada mensal de trabalho</h1>
        <select
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("jornadaMensal", e.target.value)}
        >
          <option value="220h">220 horas</option>
          <option value="200h">200 horas</option>
          <option value="180h">180 horas</option>
          <option value="150h">150 horas</option>
        </select>
      </div>
      <div className="flex flex-col gap-2"> 
      <h1 className="font-bold"> Adicional de hora-extra</h1>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder=" 00,00%"
        onChange={(e) => handleInputChange("adicionalporcenthex", e.target.value)}
      />
      </div>
    </div>
    {extraHoursMonths.length > 0 && (
      <h1 className="font-bold mt-4">Salário no início do período de ocorrência das horas-extras:</h1>
    )}
    {extraHoursMonths.map((month) => (
  <div key={month} className="mt-4">
    <label htmlFor={`salario-${month}`} className="font-bold">{`Salário de ${month}`}</label>
    <input
      id={`salario-${month}`}
      type="number"
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange(`salario-${format(month, "MMM yyyy")}`, e.target.value)}/>
      </div>
    ))}
  </>
)}



{selectedCalc?.id === "Rescisao-Trabalho" && (
  <>
    {/* Rescisao-Trabalho */}
    <div className="flex flex-col gap-2">
      <label className="font-bold">Salário Base</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Ex: 2000"
        onChange={(e) => handleInputChange("salarioBase", e.target.value)}
      />
    </div>

    {/* Data de Admissão */}
    <div className="flex flex-col gap-2 mt-4">
      <label className="font-bold">Data de Admissão</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataAdmissao", e.target.value)}
      />
    </div>

    {/* Data de Demissão */}
    <div className="flex flex-col gap-2 mt-4">
      <label className="font-bold">Data de Demissão</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataDemissao", e.target.value)}
      />
    </div>

    {/* Tipo de Rescisão */}
    <div className="flex flex-col gap-2 mt-4">
      <label className="font-bold">Motivo da Rescisão</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("tipoRescisao", e.target.value)}
      >
        <option value="">Selecione o tipo</option>
        <option value="pedidoDemissao">Pedido de Demissão</option>
        <option value="semJustaCausa">Demissão Sem Justa Causa</option>
        <option value="justaCausa">Demissão Por Justa Causa</option>
      </select>
    </div>

    {/* Saldo de FGTS */}
    <div className="flex flex-col gap-2 mt-4">
      <label className="font-bold">Saldo de FGTS</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Ex: 10000"
        onChange={(e) => handleInputChange("saldoFGTS", e.target.value)}
      />
    </div>

    {/* Multa de FGTS */}
    <div className="flex flex-col gap-2 mt-4">
      <label className="font-bold">Multa de FGTS (%)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Ex: 40"
        onChange={(e) => handleInputChange("multaFGTS", e.target.value)}
      />
    </div>

    {/* Dias Trabalhados no Mês da Rescisão */}
    <div className="flex flex-col gap-2 mt-4">
      <label className="font-bold">Dias Trabalhados no Mês da Rescisão</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Ex: 15"
        onChange={(e) => handleInputChange("diasTrabalhados", e.target.value)}
      />
    </div>
  </>
)}




{/* Apuração de Ponto e Horas Extras */}
{selectedCalc?.id === "Apuracao-de-Ponto-Horas-Extras" && (
  <>
  <div className="flex gap-4 mt-4">
    {/* Jornada mensal de trabalho */}
    <div className="w-1/2">
      <h1 className="font-bold">Jornada mensal de trabalho</h1>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("jornadaMensal", e.target.value)}
      >
        <option value="">Selecione a Jornada</option>
        <option value="220">220 horas</option>
        <option value="200">200 horas</option>
        <option value="180">180 horas</option>
        <option value="150">150 horas</option>
      </select>
    </div>

    {/* Adicional de hora-extra */}
    <div className="w-1/2">
      <h1 className="font-bold">Adicional de Hora Extra (%)</h1>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Ex.: 50"
        onChange={(e) => handleInputChange("adicionalHorasExtras", e.target.value)}
      />
    </div>
  </div>

  {/* Salário base */}
  <div className="mt-4">
    <h1 className="font-bold">Salário Base (R$)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Digite o salário base"
      onChange={(e) => handleInputChange("salarioBase", e.target.value)}
    />
  </div>

  {/* Entrada de registros de ponto */}
  <h1 className="font-bold mt-4">Registros de Ponto:</h1>
  <p>Insira os horários de entrada e saída para cada dia da semana:</p>
  <div className="grid grid-cols-2 gap-4 mt-4">
    {["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"].map((dia) => (
      <div key={dia} className="w-full">
        <h1>{dia}:</h1>
        <input
          type="time"
          placeholder="Entrada"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange(`${dia}-entrada`, e.target.value)}
        />
        <input
          type="time"
          placeholder="Saída"
          className="w-full p-2 border rounded-lg mt-2"
          onChange={(e) => handleInputChange(`${dia}-saida`, e.target.value)}
        />
      </div>
    ))}
    </div>
  </>
)}


{/* Liquidação de Sentença */}
{selectedCalc?.id === "Liquidacao-sentenca-inicial" && (
  <>
    {/* Salário base e período do cálculo */}
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <h1 className="font-bold">Salário Base</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o salário base (R$)"
          onChange={(e) => handleInputChange("salarioBase", e.target.value)}
        />
      </div>
      <div className="w-full">
        <h1 className="font-bold">Período Inicial</h1>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("dataInicial", e.target.value)}
        />
      </div>
      <div className="w-full">
        <h1 className="font-bold">Período Final</h1>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("dataFinal", e.target.value)}
        />
      </div>
    </div>

    {/* Adicional de horas extras */}
    <div className="flex flex-col gap-4 mt-4">
      <div className="w-full">
        <h1 className="font-bold">Adicional de Horas Extras (%)</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Ex: 50"
          onChange={(e) => handleInputChange("adicionalHorasExtras", e.target.value)}
        />
      </div>
    </div>

    {/* Número de Horas Extras por Semana */}
    <div className="flex flex-col gap-4 mt-4">
      <div className="w-full">
        <h1 className="font-bold">Horas Extras Semanais</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o total de horas extras por semana"
          onChange={(e) => handleInputChange("horasExtrasSemanais", e.target.value)}
        />
      </div>
    </div>

    {/* FGTS e Multa */}
    <div className="flex flex-col gap-4 mt-4">
      <div className="w-full">
        <h1 className="font-bold">Multa FGTS (%)</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Ex: 8"
          onChange={(e) => handleInputChange("multaFgts", e.target.value)}
        />
      </div>
    </div>
  </>
)}


{/* Seguro-Desemprego */}
{selectedCalc?.id === "Seguro-desemprego" && (
  <>
    {/* Salário médio dos últimos 3 meses */}
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <h1 className="font-bold">Salário Médio (últimos 3 meses)</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o salário médio (R$)"
          onChange={(e) => handleInputChange("salarioMedio", e.target.value)}
        />
      </div>

      {/* Número de meses trabalhados nos últimos 36 meses */}
      <div className="w-full">
        <h1 className="font-bold">Meses Trabalhados (últimos 36 meses)</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o número de meses trabalhados"
          onChange={(e) => handleInputChange("mesesTrabalhados", e.target.value)}
        />
      </div>

      {/* Número de vezes que o benefício foi solicitado */}
      <div className="w-full">
        <h1 className="font-bold">Número de Solicitações Anteriores</h1>
        <select
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("numeroSolicitacoes", e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="1">Primeira Solicitação</option>
          <option value="2">Segunda Solicitação</option>
          <option value="3">Terceira ou mais Solicitações</option>
        </select>
      </div>
    </div>
  </>
  )}



  {/* Atualização de Débitos e Liquidação Civil */}
{selectedCalc?.id === "Atualizacao-Debitos-Liquidação-Civil" && (
  <>
    <div className="flex flex-col gap-4">
      {/* Valor principal do débito */}
      <div className="w-full">
        <h1 className="font-bold">Valor Principal do Débito</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o valor principal (R$)"
          onChange={(e) => handleInputChange("valorPrincipal", e.target.value)}
        />
      </div>

      {/* Data de início do débito */}
      <div className="w-full">
        <h1 className="font-bold">Data de Início do Débito</h1>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("dataInicioDebito", e.target.value)}
        />
      </div>

      {/* Data de atualização do débito */}
      <div className="w-full">
        <h1 className="font-bold">Data de Atualização</h1>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("dataAtualizacao", e.target.value)}
        />
      </div>

      {/* Juros mensais */}
      <div className="w-full">
        <h1 className="font-bold">Taxa de Juros Mensais (%)</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Ex.: 1%"
          onChange={(e) => handleInputChange("taxaJurosMensais", e.target.value)}
        />
      </div>

      {/* Índice de correção monetária */}
      <div className="w-full">
        <h1 className="font-bold">Índice de Correção Monetária</h1>
        <select
          className="w-full p-2 border rounded-lg"
          onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
        >
          <option value="IPCA">IPCA</option>
          <option value="INPC">INPC</option>
          <option value="IGP-M">IGP-M</option>
        </select>
      </div>
    </div>
  </>
)}



{selectedCalc?.id === "Revisao-FGTS" && (
  <>
    {/* Saldo Inicial */}
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1" htmlFor="saldoInicial">
        Saldo Inicial do FGTS (R$)
      </label>
      <input
        id="saldoInicial"
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 10000"
        onChange={(e) => handleInputChange("saldoInicial", e.target.value)}
      />
    </div>
     {/* Início do Período */}
     <div className="mb-4">
      <label className="block text-sm font-bold mb-1" htmlFor="periodoInicio">
        Data de Início do Período
      </label>
      <input
        id="periodoInicio"
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("periodoInicio", e.target.value)}
      />
    </div>

    {/* Fim do Período */}
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1" htmlFor="periodoFim">
        Data de Fim do Período
      </label>
      <input
        id="periodoFim"
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("periodoFim", e.target.value)}
      />
    </div>
    {/* Taxa de Correção */}
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1" htmlFor="taxaCorrecao">
        Taxa de Correção Mensal (%)
      </label>
      <input
        id="taxaCorrecao"
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 0.5"
        onChange={(e) => handleInputChange("taxaCorrecao", e.target.value)}
      />
    </div>
    
</>
)}

{/* PIS/PASEP */}

{selectedCalc?.id === "pisPasep" && (
  <>
    <h2 className="text-lg font-bold mb-4">Cálculo PIS/PASEP</h2>

    {/* Seleção de Ano Base */}
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1" htmlFor="anoBase">
        Ano Base do PIS/PASEP
      </label>
      <select
        id="anoBase"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("anoBase", e.target.value)}
      >
        <option value="">Selecione o Ano Base</option>
        <option value="2024">Ano Base 2024</option>
        <option value="2023">Ano Base 2023</option>
        <option value="2022">Ano Base 2022</option>
        <option value="2021">Ano Base 2021</option>
        <option value="2020">Ano Base 2020</option>
      </select>
    </div>

    {/* Meses Trabalhados */}
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1" htmlFor="mesesTrabalhados">
        Meses Trabalhados no Ano Base
      </label>
      <input
        id="mesesTrabalhados"
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Meses Trabalhados (Ex: 12)"
        onChange={(e) => handleInputChange("mesesTrabalhados", e.target.value)}
      />
    </div>

    {/* Benefício */}
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1" htmlFor="beneficio">
        Benefício
      </label>
      <select
        id="beneficio"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("beneficio", e.target.value)}
      >
        <option value="">Selecione o Benefício</option>
        <option value="PIS">PIS</option>
        <option value="PASEP">PASEP</option>
      </select>
    </div>

    {/* Mês de Nascimento */}
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1" htmlFor="mesNascimento">
        Mês de Nascimento
      </label>
      <input
        id="mesNascimento"
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 1 (Janeiro)"
        onChange={(e) => handleInputChange("mesNascimento", e.target.value)}
      />
    </div>
    </>
)}



{/* Pensão Alimentícia */}
{selectedCalc?.id === "Pensao-Alimenticia" && (
  <>
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-bold">Salário Bruto</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o salário bruto (R$)"
          onChange={(e) => handleInputChange("salarioBruto", e.target.value)}
        />
      </div>
      <div>
        <h1 className="font-bold">Percentual da Pensão (%)</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Exemplo: 30 para 30%"
          onChange={(e) => handleInputChange("percentualPensao", e.target.value)}
        />
      </div>
      <div>
        <h1 className="font-bold">Outras Rendas</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o valor de outras rendas (R$)"
          onChange={(e) => handleInputChange("outrasRendas", e.target.value)}
        />
      </div>
      <div>
        <h1 className="font-bold">Deduções</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o valor de deduções (R$)"
          onChange={(e) => handleInputChange("deducoes", e.target.value)}
        />
      </div>
    </div>
  </>
)}



{/* Distrato de Imóveis */}
{selectedCalc?.id === "Distrato-Imoveis" && (
  <>
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-bold">Valor do Contrato</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o valor do contrato (R$)"
          onChange={(e) => handleInputChange("valorContrato", e.target.value)}
        />
      </div>
      <div>
        <h1 className="font-bold">Percentual de Retenção (%)</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o percentual de retenção (%)"
          onChange={(e) => handleInputChange("percentualRetencao", e.target.value)}
        />
      </div>
      <div>
        <h1 className="font-bold">Taxa de Multa Rescisória (%)</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite a taxa de multa (%)"
          onChange={(e) => handleInputChange("taxaMultaRescisoria", e.target.value)}
        />
      </div>
      <div>
        <h1 className="font-bold">Despesas Administrativas</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o valor das despesas administrativas (R$)"
          onChange={(e) => handleInputChange("despesasAdministrativas", e.target.value)}
        />
      </div>
      <div>
        <h1 className="font-bold">Valor Pago pelo Comprador</h1>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Digite o valor pago pelo comprador (R$)"
          onChange={(e) => handleInputChange("valorPagoComprador", e.target.value)}
        />
      </div>
    </div>
  </>
)}




{/* Revisão de Aluguel */}
{selectedCalc?.id === "Revisao-Alugueis" && (
  <div className="flex flex-col gap-4">
    <div>
      <h1 className="font-bold">Valor Atual do Aluguel (R$)</h1>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Ex: 1500"
        onChange={(e) => handleInputChange("valorAtualAluguel", e.target.value)}
      />
    </div>

    <div>
      <h1 className="font-bold">Data de Início da Revisão</h1>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataInicio", e.target.value)}
      />
    </div>

    <div>
      <h1 className="font-bold">Data Final da Revisão</h1>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataFinal", e.target.value)}
      />
    </div>

    <div>
      <h1 className="font-bold">Índice de Correção Monetária</h1>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
      >
        <option value="">Selecione o Índice</option>
        <option value="IGPM">IGP-M</option>
        <option value="IPCA">IPCA</option>
        <option value="INPC">INPC</option>
      </select>
    </div>

    <div>
      <h1 className="font-bold">Percentual de Reajuste Adicional (%)</h1>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Ex: 5"
        onChange={(e) => handleInputChange("reajusteAdicional", e.target.value)}
      />
    </div>
  </div>
)}



{selectedCalc?.id === "Heranca" && (
  <>
    <h1 className="font-bold">Valor Total da Herança</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("valorHeranca", e.target.value)}
    />

    <h1 className="font-bold">Dívidas e Outros Descontos</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("dividas", e.target.value)}
    />

    <h1 className="font-bold">Imposto ITCMD (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("impostoITCMD", e.target.value)}
    />

    <h1 className="font-bold">Número de Herdeiros</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Ex: 3"
      onChange={(e) => handleInputChange("numHerdeiros", e.target.value)}
    />

    <h1 className="font-bold">Regime de Bens</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("regimeBens", e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="Comunhão Universal">Comunhão Universal</option>
      <option value="Parcial">Comunhão Parcial</option>
      <option value="Separação Total">Separação Total</option>
      <option value="Outro">Outro</option>
    </select>

    <h1 className="font-bold">Percentual para o Cônjuge (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("percentualConjuge", e.target.value)}
    />
  </>
)}



{selectedCalc?.id === "Divorcio" && (
  <>
    <h1 className="font-bold">Valor Total dos Bens</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("valorBens", e.target.value)}
    />

    <h1 className="font-bold">Dívidas do Casal</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("dividas", e.target.value)}
    />

    <h1 className="font-bold">Regime de Bens</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("regimeBens", e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="Comunhão Universal">Comunhão Universal</option>
      <option value="Parcial">Comunhão Parcial</option>
      <option value="Separação Total">Separação Total</option>
    </select>

    <h1 className="font-bold">Percentual para o Cônjuge (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("percentualConjuge", e.target.value)}
    />

    <h1 className="font-bold">Número de Filhos</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Ex: 2"
      onChange={(e) => handleInputChange("numFilhos", e.target.value)}
    />

    <h1 className="font-bold">Quem ficará com a guarda dos filhos?</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("guardaDosFilhos", e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="Conjuge 1">Cônjuge 1</option>
      <option value="Conjuge 2">Cônjuge 2</option>
    </select>

    <h1 className="font-bold">Salário do Cônjuge Pagante</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("salarioPagante", e.target.value)}
    />

    <h1 className="font-bold">Percentual de Pensão Alimentícia (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("pensaoPercentual", e.target.value)}
    />
  </>
)}



{selectedCalc?.id === "Parcelamento-CPC-916" && (
  <>
    <h1 className="font-bold">Valor Total da Dívida</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("valorDivida", e.target.value)}
    />

    <h1 className="font-bold">Número de Parcelas (máx. 6)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Máximo 6"
      onChange={(e) => handleInputChange("numeroParcelas", e.target.value)}
    />

    <h1 className="font-bold">Taxa de Juros Mensal (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("jurosMensais", e.target.value)}
    />

    <h1 className="font-bold">Índice de Correção Monetária</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="IPCA">IPCA</option>
      <option value="INPC">INPC</option>
      <option value="IGPM">IGPM</option>
    </select>
  </>
)}




{selectedCalc?.id === "Atualizacao-Debitos-Fazenda-Publica" && (
  <>
    <h1 className="font-bold">Valor Principal da Dívida</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("valorPrincipal", e.target.value)}
    />

    <h1 className="font-bold">Data do Débito</h1>
    <input
      type="date"
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("dataInicioDebito", e.target.value)}
    />

    <h1 className="font-bold">Data de Atualização</h1>
    <input
      type="date"
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("dataAtualizacao", e.target.value)}
    />

    <h1 className="font-bold">Taxa de Juros Mensal (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("taxaJurosMensais", e.target.value)}
    />

    <h1 className="font-bold">Índice de Correção Monetária</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="IPCA">IPCA</option>
      <option value="INPC">INPC</option>
      <option value="IGPM">IGPM</option>
      <option value="SELIC">SELIC</option>
      <option value="TR">TR</option>
    </select>

    <h1 className="font-bold">Multa Moratória (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("multaPercentual", e.target.value)}
    />
  </>
)}




{selectedCalc?.id === "Planejamento-Sucessorio" && (
  <>
    <h1 className="font-bold">Valor Total do Patrimônio</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("valorPatrimonio", e.target.value)}
    />

    <h1 className="font-bold">Quantidade de Herdeiros</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Número de herdeiros"
      onChange={(e) => handleInputChange("quantidadeHerdeiros", e.target.value)}
    />

    <h1 className="font-bold">Percentual da Herança Legítima (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("percentualLegitima", e.target.value)}
    />

    <h1 className="font-bold">Percentual da Herança Disponível (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("percentualDisponivel", e.target.value)}
    />

    <h1 className="font-bold">Regime de Bens</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("regimeBens", e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="Comunhão Parcial">Comunhão Parcial</option>
      <option value="Comunhão Universal">Comunhão Universal</option>
      <option value="Separação Total">Separação Total</option>
    </select>

    <h1 className="font-bold">Percentual do ITCMD (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("percentualItcmd", e.target.value)}
    />
  </>
)}




{selectedCalc?.id === "Planejamento-Concessao-Revisao-RGPS" && (
  <>
    <h1 className="font-bold">Tipo de Benefício</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("tipoBeneficio", e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="Aposentadoria Por Idade">Aposentadoria Por Idade</option>
      <option value="Aposentadoria Por Tempo de Contribuição">
        Aposentadoria Por Tempo de Contribuição
      </option>
      <option value="Aposentadoria Especial">Aposentadoria Especial</option>
      <option value="Pensão Por Morte">Pensão Por Morte</option>
      <option value="Auxílio-Doença">Auxílio-Doença</option>
    </select>

    <h1 className="font-bold">Salário Médio de Contribuição</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("salarioMedio", e.target.value)}
    />

    <h1 className="font-bold">Tempo de Contribuição (anos)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Anos"
      onChange={(e) => handleInputChange("tempoContribuicao", e.target.value)}
    />

    <h1 className="font-bold">Idade Atual</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Idade"
      onChange={(e) => handleInputChange("idade", e.target.value)}
    />

    <h1 className="font-bold">Fator Previdenciário</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="(Ex: 0.85, 1.00, etc.)"
      onChange={(e) => handleInputChange("fatorPrevidenciario", e.target.value)}
    />

    <h1 className="font-bold">Percentual de Revisão (%)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("percentualRevisao", e.target.value)}
    />

    <h1 className="font-bold">Contribuição Mensal (R$)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("contribuicaoMensal", e.target.value)}
    />
  </>
)}





{selectedCalc?.id === "Restituicao-INSS-Acima-Teto" && (
  <>
    <h1 className="font-bold">Salário Total (Soma de todas as rendas)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("salarioTotal", e.target.value)}
    />

    <h1 className="font-bold">Contribuição Total ao INSS no Ano</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("contribuicaoTotal", e.target.value)}
    />

    <h1 className="font-bold">Teto Máximo do INSS</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("tetoINSS", e.target.value)}
    />
  </>
)}




{selectedCalc?.id === "Analise-Previdenciaria-Rapida" && (
  <>
    <h1 className="font-bold">Idade Atual</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Idade"
      onChange={(e) => handleInputChange("idade", e.target.value)}
    />

    <h1 className="font-bold">Tempo de Contribuição (anos)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Tempo de contribuição"
      onChange={(e) => handleInputChange("tempoContribuicao", e.target.value)}
    />

    <h1 className="font-bold">Salário Médio de Contribuição</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("salarioMedio", e.target.value)}
    />

    <h1 className="font-bold">Escolha a Regra de Aposentadoria</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("regraEscolhida", e.target.value)}
    >
      <option value="">Selecione uma regra</option>
      <option value="Regra 85/95 Progressiva">Regra 85/95 Progressiva</option>
      <option value="Idade Mínima Progressiva">Idade Mínima Progressiva</option>
      <option value="Tempo de Contribuição">Tempo de Contribuição</option>
    </select>
  </>
)}




{selectedCalc?.id === "Analise-BPC-LOAS" && (
  <>
    <h1 className="font-bold">Idade do Requerente</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Idade"
      onChange={(e) => handleInputChange("idade", e.target.value)}
    />

    <h1 className="font-bold">Renda Familiar Total (R$)</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Renda total da família"
      onChange={(e) => handleInputChange("rendaFamiliarTotal", e.target.value)}
    />

    <h1 className="font-bold">Número de Membros na Família</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Quantidade de membros"
      onChange={(e) => handleInputChange("numeroMembrosFamilia", e.target.value)}
    />

    <h1 className="font-bold">Possui Deficiência?</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("possuiDeficiencia", e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="sim">Sim</option>
      <option value="nao">Não</option>
    </select>
  </>
)}



{selectedCalc?.id === "Liquidacao-Sentenca-Previdenciaria" && (
  <>
    <h1 className="font-bold">Data do Inicio do Benefico</h1>
    <input
      type="date"
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("dataInicioBeneficio", e.target.value)}
    />

    <h1 className="font-bold">Data do Final do Benefico</h1>
    <input
      type="date"
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("dataFimBeneficio", e.target.value)}
    />

    <h1 className="font-bold">Valor Mensal Beneficio</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="R$"
      onChange={(e) => handleInputChange("valorMensalBeneficio", e.target.value)}
    />

<h1 className="font-bold">Índice de Correção Monetária</h1>
    <select
      className="w-full p-2 border rounded-lg"
      onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="IPCA">IPCA</option>
      <option value="INPC">INPC</option>
      <option value="IGPM">IGPM</option>
    </select>

    <h1 className="font-bold">Juros Moratorios</h1>
    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="%"
      onChange={(e) => handleInputChange("jurosMoratorios", e.target.value)}
    />
  </>
)}



{selectedCalc?.id === "Contribuicoes-Atraso" && (
  <>
    <h2 className="text-lg font-bold">Contribuições em Atraso</h2>

    {/* Período de Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Data de Início da Contribuição</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataInicioContribuicao", e.target.value)}
      />
    </div>

    <div className="mt-2">
      <label className="font-bold">Data Final da Contribuição</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataFimContribuicao", e.target.value)}
      />
    </div>

    {/* Tipo de Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Tipo de Contribuinte</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("tipoContribuinte", e.target.value)}
      >
        <option value="">Selecione</option>
        <option value="autonomo">Autônomo</option>
        <option value="empregador">Empregador</option>
        <option value="contribuinteIndividual">Contribuinte Individual</option>
      </select>
    </div>

    {/* Valor Base */}
    <div className="mt-2">
      <label className="font-bold">Valor Base de Contribuição (R$)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Valor em reais"
        onChange={(e) => handleInputChange("valorBase", e.target.value)}
      />
    </div>

    {/* Índice de Correção */}
    <div className="mt-2">
      <label className="font-bold">Índice de Correção Monetária</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
      >
        <option value="IPCA">IPCA</option>
        <option value="INPC">INPC</option>
        <option value="IGPM">IGPM</option>
      </select>
    </div>

    {/* Juros Moratórios */}
    <div className="mt-2">
      <label className="font-bold">Taxa de Juros Moratórios (% ao mês)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 1, 2, 3..."
        onChange={(e) => handleInputChange("jurosMoratorios", e.target.value)}
      />
    </div>
  </>
)}




{selectedCalc?.id === "Complementacao-Previdenciaria" && (
  <>

    {/* Tipo de Complementação */}
    <div className="mt-2">
      <label className="font-bold">Tipo de Complementação</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("tipoComplementacao", e.target.value)}
      >
        <option value="">Selecione</option>
        <option value="tempoContribuicao">Tempo de Contribuição</option>
        <option value="salarioContribuicao">Salário de Contribuição</option>
      </select>
    </div>

    {/* Período da Complementação */}
    <div className="mt-2">
      <label className="font-bold">Data de Início</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataInicio", e.target.value)}
      />
    </div>

    <div className="mt-2">
      <label className="font-bold">Data Final</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataFinal", e.target.value)}
      />
    </div>

    {/* Valor Contribuição Atual */}
    <div className="mt-2">
      <label className="font-bold">Valor Atual de Contribuição (R$)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Valor em reais"
        onChange={(e) => handleInputChange("valorContribuicaoAtual", e.target.value)}
      />
    </div>

    {/* Índice de Correção */}
    <div className="mt-2">
      <label className="font-bold">Índice de Correção Monetária</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
      >
        <option value="IPCA">IPCA</option>
        <option value="INPC">INPC</option>
        <option value="IGPM">IGPM</option>
      </select>
    </div>

    {/* Alíquota Previdenciária */}
    <div className="mt-2">
      <label className="font-bold">Alíquota Previdenciária (%)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 11%"
        onChange={(e) => handleInputChange("aliquotaPrevidenciaria", e.target.value)}
      />
    </div>
  </>
)}





{selectedCalc?.id === "RPPS-Uniao-Planejamento-Concessao-Revisao" && (
  <>
    <h2 className="text-lg font-bold">RPPS União - Planejamento, Concessão e Revisão</h2>

    {/* Tipo de Planejamento */}
    <div className="mt-2">
      <label className="font-bold">Tipo de Planejamento</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("tipoPlanejamento", e.target.value)}
      >
        <option value="">Selecione</option>
        <option value="aposentadoria">Aposentadoria</option>
        <option value="pensao">Pensão</option>
        <option value="revisaoBeneficio">Revisão de Benefício</option>
      </select>
    </div>

    {/* Data de Início da Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Data de Início da Contribuição</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataInicioContribuicao", e.target.value)}
      />
    </div>

    {/* Data Final da Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Data Final da Contribuição</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataFinalContribuicao", e.target.value)}
      />
    </div>

    {/* Valor Contribuição Atual */}
    <div className="mt-2">
      <label className="font-bold">Valor Atual de Contribuição (R$)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Valor em reais"
        onChange={(e) => handleInputChange("valorContribuicaoAtual", e.target.value)}
      />
    </div>

    {/* Índice de Correção */}
    <div className="mt-2">
      <label className="font-bold">Índice de Correção Monetária</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
      >
        <option value="IPCA">IPCA</option>
        <option value="INPC">INPC</option>
        <option value="IGPM">IGPM</option>
      </select>
    </div>

    {/* Tempo de Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Tempo Total de Contribuição (anos)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 30 anos"
        onChange={(e) => handleInputChange("tempoContribuicao", e.target.value)}
      />
    </div>

    {/* Percentual de Alíquota Previdenciária */}
    <div className="mt-2">
      <label className="font-bold">Alíquota Previdenciária (%)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 11%"
        onChange={(e) => handleInputChange("aliquotaPrevidenciaria", e.target.value)}
      />
    </div>
  </>
)}





{selectedCalc?.id === "RPPS-Estados-Planejamento-Concessao-Revisao" && (
  <>
    <h2 className="text-lg font-bold">RPPS Estados - Planejamento, Concessão e Revisão</h2>

    {/* Estado */}
    <label className="font-bold">Estado:</label>
  <select 
    className="w-full p-2 border rounded-lg" 
    onChange={handleStateChange} 
    value={estadoSelecionado}
  >
    <option value="">Selecione o Estado</option>
    {estados.map((estado) => (
      <option key={estado.id} value={estado.sigla}>
        {estado.nome}
      </option>
    ))}
  </select>


    {/* Tipo de Planejamento */}
    <div className="mt-2">
      <label className="font-bold">Tipo de Planejamento</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("tipoPlanejamento", e.target.value)}
      >
        <option value="">Selecione</option>
        <option value="aposentadoria">Aposentadoria</option>
        <option value="pensao">Pensão</option>
        <option value="revisaoBeneficio">Revisão de Benefício</option>
      </select>
    </div>

    {/* Data de Início da Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Data de Início da Contribuição</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataInicioContribuicao", e.target.value)}
      />
    </div>

    {/* Data Final da Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Data Final da Contribuição</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataFinalContribuicao", e.target.value)}
      />
    </div>

    {/* Valor Contribuição Atual */}
    <div className="mt-2">
      <label className="font-bold">Valor Atual de Contribuição (R$)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Valor em reais"
        onChange={(e) => handleInputChange("valorContribuicaoAtual", e.target.value)}
      />
    </div>

    {/* Índice de Correção */}
    <div className="mt-2">
      <label className="font-bold">Índice de Correção Monetária</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
      >
        <option value="IPCA">IPCA</option>
        <option value="INPC">INPC</option>
        <option value="IGPM">IGPM</option>
      </select>
    </div>

    {/* Tempo de Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Tempo Total de Contribuição (anos)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 30 anos"
        onChange={(e) => handleInputChange("tempoContribuicao", e.target.value)}
      />
    </div>

    {/* Percentual de Alíquota Previdenciária */}
    <div className="mt-2">
      <label className="font-bold">Alíquota Previdenciária (%)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 14%"
        onChange={(e) => handleInputChange("aliquotaPrevidenciaria", e.target.value)}
      />
    </div>
  </>
)}





{selectedCalc?.id === "RPPS-Municipios-Planejamento-Concessao-Revisao" && (
  <>
    <h2 className="text-lg font-bold">RPPS Municípios - Planejamento, Concessão e Revisão</h2>

    {/* Estado */}
    <div>
  <label className="font-bold">Estado:</label>
  <select 
    className="w-full p-2 border rounded-lg" 
    onChange={handleStateChange} 
    value={estadoSelecionado}
  >
    <option value="">Selecione o Estado</option>
    {estados.map((estado) => (
      <option key={estado.id} value={estado.sigla}>
        {estado.nome}
      </option>
    ))}
  </select>
</div>

<div>
  <label className="font-bold">Município:</label>
  <select 
    className="w-full p-2 border rounded-lg" 
    onChange={(e) => handleInputChange("municipio", e.target.value)}
    disabled={!estadoSelecionado} // Só ativa quando um estado for selecionado
  >
    <option value="">Selecione o Município</option>
    {municipios.map((municipio) => (
      <option key={municipio.id} value={municipio.nome}>
        {municipio.nome}
      </option>
    ))}
  </select>
</div>

    {/* Tipo de Planejamento */}
    <div className="mt-2">
      <label className="font-bold">Tipo de Planejamento</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("tipoPlanejamento", e.target.value)}
      >
        <option value="">Selecione</option>
        <option value="aposentadoria">Aposentadoria</option>
        <option value="pensao">Pensão</option>
        <option value="revisaoBeneficio">Revisão de Benefício</option>
      </select>
    </div>

    {/* Data de Início da Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Data de Início da Contribuição</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataInicioContribuicao", e.target.value)}
      />
    </div>

    {/* Data Final da Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Data Final da Contribuição</label>
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("dataFinalContribuicao", e.target.value)}
      />
    </div>

    {/* Valor de Contribuição Atual */}
    <div className="mt-2">
      <label className="font-bold">Valor Atual de Contribuição (R$)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Valor em reais"
        onChange={(e) => handleInputChange("valorContribuicaoAtual", e.target.value)}
      />
    </div>

    {/* Índice de Correção */}
    <div className="mt-2">
      <label className="font-bold">Índice de Correção Monetária</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleInputChange("indiceCorrecao", e.target.value)}
      >
        <option value="IPCA">IPCA</option>
        <option value="INPC">INPC</option>
        <option value="IGPM">IGPM</option>
      </select>
    </div>

    {/* Tempo de Contribuição */}
    <div className="mt-2">
      <label className="font-bold">Tempo Total de Contribuição (anos)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 30 anos"
        onChange={(e) => handleInputChange("tempoContribuicao", e.target.value)}
      />
    </div>

    {/* Percentual de Alíquota Previdenciária */}
    <div className="mt-2">
      <label className="font-bold">Alíquota Previdenciária (%)</label>
      <input
        type="number"
        className="w-full p-2 border rounded-lg"
        placeholder="Exemplo: 14%"
        onChange={(e) => handleInputChange("aliquotaPrevidenciaria", e.target.value)}
      />
    </div>
  </>
)}



{/* Superendividamento */}
{selectedCalc?.id === "Superendividamento" && (
  <>
    <h2 className="text-lg font-bold mb-2">Informações sobre Superendividamento</h2>

    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Renda Mensal (R$)"
      onChange={(e) => handleInputChange("rendaMensal", e.target.value)}
    />

    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Total de Dívidas (R$)"
      onChange={(e) => handleInputChange("totalDividas", e.target.value)}
    />

    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Despesas Fixas Mensais (R$)"
      onChange={(e) => handleInputChange("despesasFixas", e.target.value)}
    />

    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Número de Parcelas para Refinanciamento"
      onChange={(e) => handleInputChange("parcelasRefinanciamento", e.target.value)}
    />

    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Taxa de Juros Mensal (%)"
      onChange={(e) => handleInputChange("taxaJuros", e.target.value)}
    />
  </>
)}



{/* Revisão da RMC e RCC 
{selectedCalc?.id === "Revisao-RMC-RCC" && (
  <>
    <h2 className="text-lg font-bold mb-2">Revisão da RMC e RCC</h2>

    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Valor Total do Empréstimo (R$)"
      onChange={(e) => handleInputChange("valorTotalEmprestimo", e.target.value)}
    />

    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Taxa de Juros Anual (%)"
      onChange={(e) => handleInputChange("taxaJurosAnual", e.target.value)}
    />

    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Número de Parcelas"
      onChange={(e) => handleInputChange("numeroParcelas", e.target.value)}
    />

    <input
      type="number"
      className="w-full p-2 border rounded-lg"
      placeholder="Valor da Parcela Atual (R$)"
      onChange={(e) => handleInputChange("valorParcelaAtual", e.target.value)}
    />

    <input
      type="file"
      className="w-full p-2 border rounded-lg"
      accept=".csv, .xls, .xlsx"
      onChange={(e) => handleInputChange("historicoCredito", e.target.files[0])}
    />
    <p className="text-sm text-gray-600">
      Envie o extrato HISCRE para análise automática.
    </p>
  </>
)} */}





            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Calcular
            </button>
          </form>

          {result && (
            <div className="mt-6">
              <h3 className="text-xl font-bold">Resumo:</h3>
              {selectedCalc?.id === "revisional" && (
                <>
                  <p>Total Pago Incorretamente: R$ {result.totalPago}</p>
                  <p>Total Correto: R$ {result.totalCorreto}</p>
                  <p>Diferença: R$ {result.totalDiferenca}</p>
                </>
              )}
              
                {selectedCalc?.id === "trabalhista" && (
                <>
                <p>Saldo de Salário: R$ {result.Saldosalário}</p>
                <p>Férias Proporcionais: R$ {result.Feriasproporcionais}</p>
                <p>13º Proporcional: R$ {result.decimoterceiroproporcional}</p>
                <p>Multa FGTS: R$ {result.MultaFGTS}</p>
                <p>Total: R$ {result.Totalcalc}</p>
                </>
                )}



                {selectedCalc?.id === "Rescisao-Trabalho" && (
                <>
                <p>Saldo Salário: R$ {result.saldoSalario}</p>
                <p>Férias Proporcionais: R$ {result.feriasProporcionais}</p>
                <p>Decimo Terceiro Proporcional: R$ {result.decimoTerceiroProporcional}</p>
                <p>Multa FGTS Valor: R$ {result.multaFgtsValor}</p>
                <p>Total a Pagar: R$ {result.totalAPagar}</p>
                </>
                )}



                {selectedCalc?.id === "Simulador-Verbas-Extras" && (
                <>
                <p>Total Horas Extras: H {result.totalHorasExtras}</p>
                <p>Total Geral: R$ {result.totalGeral}</p>
                </>
                )}



                {selectedCalc?.id === "Apuracao-de-Ponto-Horas-Extras" && (
                <>
                <p>Total de Horas Extras: H {result.totalHorasExtras}</p>
                <p>Total Valor Das Horas Extras: R$ {result.totalValorHorasExtras}</p>
                </>
                )}



                {selectedCalc?.id === "Liquidacao-sentenca-inicial" && (
                <>
                <p>horas Extras Totais: R$ {result.horasExtrasTotais}</p>
                <p>Valor Horas Extras: R$ {result.valorHorasExtras}</p>
                <p>Multa FGTS Valor: R$ {result.multaFgtsValor}</p>
                <p>Total Geral: R$ {result.totalGeral}</p>
                </>
                )}



                {selectedCalc?.id === "Seguro-desemprego" && (
                <>
                <p>Salario: {result.salario}</p>
                <p>Meses: {result.meses}</p>
                <p>Solicitações: {result.solicitacoes}</p>
                <p>Valor da parcela: R$ {result.valorParcela}</p>
                <p>Quantidade de parcelas: {result.parcelas}</p>
                <p>Total do benefício: {result.totalBeneficio}</p>
                </>
                )}



                {selectedCalc?.id === "Atualizacao-Debitos-Liquidação-Civil" && (
                <>
                <p>Valor Atualizado: R$ {result.valorAtualizado}</p>
                <p>Total de Juros: R$ {result.totalJuros}</p>
                <p>Total de Correção: R$ {result.totalCorrecao}</p>
                
                </>
                )}



                {selectedCalc?.id === "Revisao-FGTS" && (
                <>
                <p>Valor Atualizado: R$ {result.saldoAtualizado}</p>
                <p>Total de Juros: R$ {result.totalCorrecao}</p>
                <p>Total de Correção: R$ {result.totalCorrecao}</p>
                </>
                )}



                {selectedCalc?.id === "pisPasep" && (
                <>
                <p>Total do Benefício: <strong>R$ {result.totalBeneficio}</strong></p>
                <p>Base de Cálculo: <strong>R$ {result.baseCalculo}</strong></p>
                </>
                 )}



                {selectedCalc?.id === "Pensao-Alimenticia" && (
               <>
                <p>Salario Bruto: <strong>R$ {result.salarioBruto}</strong></p>
                <p>Outras Rendas: <strong>R$ {result.outrasRendas}</strong></p>
                <p>Deduções: <strong>R$ {result.deducoes}</strong></p>
                <p>Total Liquido: <strong>R$ {result.totalLiquido}</strong></p>
                <p>Percentual: <strong>R$ {result.percentual}</strong></p>
                <p>Valor da pensão: <strong>R$ {result.valorPensao}</strong></p>
                </>
                 )}



                {selectedCalc?.id === "Distrato-Imoveis" && (
               <>
                <p>Valor do contrato: <strong>R$ {result.contrato}</strong></p>
                <p>Valor da Retenção: <strong>R$ {result.valorRetencao}</strong></p>
                <p>Valor da Multa: <strong>R$ {result.valorMulta}</strong></p>
                <p>Despesas: <strong>R$ {result.despesas}</strong></p>
                <p>Total das Despesas: <strong>R$ {result.totalDeducoes}</strong></p>
                <p>Valor a Restituir: <strong>R$ {result.valorRestituir}</strong></p>
                </>
                 )}


                 {selectedCalc?.id === "Revisao-Alugueis" && (
                 <>
                <p>Valor Corrigido: <strong>R$ {result.valorCorrigido}</strong></p>
                <p>Total da Correção: <strong>R$ {result.totalCorrecao}</strong></p>
                <p>Total do reajuste: <strong>R$ {result.totalReajuste}</strong></p>
                </>
                 )}


                {selectedCalc?.id === "Heranca" && (
                 <>
                <p>Herança Líquida: <strong>R$ {result.herancaLiquida}</strong></p>
                <p>Imposto ITCMD: <strong>R$ {result.impostoValor}</strong></p>
                <p>Herança para o Cônjuge: <strong>R$ {result.herancaConjuge}</strong></p>
                <p>Herança por Herdeiro: <strong>R$ {result.herancaPorHerdeiro}</strong></p>
                </>
                 )}


                {selectedCalc?.id === "Divorcio" && (
                 <>
                <p>Bens Líquidos: <strong>R$ {result.bensLiquidos}</strong></p>
                <p>Bens para o Cônjuge 1: <strong>R$ {result.bensConjuge}</strong></p>
                <p>Bens para o Cônjuge 2: <strong>R$ {result.bensOutroConjuge}</strong></p>
                <p>Pensão por Filho: <strong>R$ {result.pensaoTotal}</strong></p>
                </>
                 )}



                {selectedCalc?.id === "Parcelamento-CPC-916" && (
                 <>
                <p>Entrada (30%): <strong>R$ {result.entrada}</strong></p>
                <p>Total de Parcelas: <strong> {result.totalParcelas}</strong></p>
                <p>Valor Total das Parcelas: <strong>R$ {result.valorTotalParcelas}</strong></p>
                <p>Total de Juros: <strong>R$ {result.totalJuros}</strong></p>
                <p>Total de Correção Monetária: <strong>R$ {result.totalCorrecao}</strong></p>
                </>
                 )}



                {selectedCalc?.id === "Atualizacao-Debitos-Fazenda-Publica" && (
                 <>
                <p>Valor Atualizado: <strong>R$ {result.valorAtualizado}</strong></p>
                <p>Total de Juros: <strong> {result.totalJuros}</strong></p>
                <p>Total da Correção: <strong>R$ {result.totalCorrecao}</strong></p>
                <p>Valor da Multa: <strong>R$ {result.valorMulta}</strong></p>
                </>
                 )}



                {selectedCalc?.id === "Planejamento-Sucessorio" && (
                 <>
                <p>Patrimônio Total: <strong>R$ {result.patrimonioTotal}</strong></p>
                <p>Herança Legítima: <strong>R$ {result.herancaLegitima}</strong></p>
                <p>Herança Disponível: <strong>R$ {result.herancaDisponivel}</strong></p>
                <p>Imposto ITCMD: <strong>R$ {result.impostoItcmd}</strong></p>
                <p>Direito do Cônjuge: <strong>R$ {result.direitoConjuge}</strong></p>
                <p>Valor por Herdeiro: <strong>R$ {result.valorPorHerdeiro}</strong></p>
                </>
                 )}




                {selectedCalc?.id === "Planejamento-Concessao-Revisao-RGPS" && (
                 <>
                <p>Valor Inicial do Benefício: <strong>R$ {result.valorBeneficio}</strong></p>
                <p>Valor Após Revisão: <strong>R$ {result.revisaoValor}</strong></p>
                <p>Contrinuição Total: <strong>R$ {result.contribuicaoTotal}</strong></p>
                </>
                 )}




                {selectedCalc?.id === "Restituicao-INSS-Acima-Teto" && (
                 <>
                <p>Salário Total: <strong>R$ {result.salarioTotal}</strong></p>
                <p>Contribuição Total: <strong>R$ {result.contribuicaoTotal}</strong></p>
                <p>Teto INSS: <strong>R$ {result.tetoINSS}</strong></p>
                <p>Contribuição Permitida : <strong>R$ {result.contribuicaoPermitida}</strong></p>
                <p>Valor a Restituir: <strong>R$ {result.valorRestituicao}</strong></p>
                </>
                 )} 




                {selectedCalc?.id === "Analise-Previdenciaria-Rapida" && (
                 <>
                <p>Regra Escolhida: <strong> {result.regraEscolhida}</strong></p>
                <p>Idade Atual: <strong> {result.idadeAtual}</strong></p>
                <p>Tempo de Contribuição Atual: <strong> {result.tempoContribuicaoAtual}</strong></p>
                <p>Pontos Atuais: <strong> {result.pontosAtuais}</strong></p>
                <p>Idade Faltante: <strong> {result.idadeFaltante}</strong></p>
                <p>Tempo Faltante: <strong> {result.tempoFaltante}</strong></p>
                <p>Benefício Estimado: <strong>R$ {result.beneficioEstimado}</strong></p>
                </>
                 )}




                {selectedCalc?.id === "Analise-BPC-LOAS" && (
                 <>
                <p>Idade do Requerente: <strong> {result.idadeAtual} Anos</strong></p>
                <p>Renda Per Capita: <strong>R$ {result.rendaPerCapita}</strong></p>
                <p>Limite de Renda: <strong> {result.limiteRendaPerCapita}</strong></p>
                <p><strong>Elegível ao Benefício:</strong> {result.elegivel ? "Sim ✅" : "Não ❌"}</p>
                <p><strong>Motivo:</strong> {result.motivoElegibilidade}</p>

               {result.elegivel ? (
                <p className="text-green-600 font-bold mt-2">✅ Parabéns! Você atende aos critérios do BPC/LOAS.</p>
                ) : (
                 <p className="text-red-600 font-bold mt-2">⚠ Infelizmente, não atende aos critérios do benefício.</p>
                 )}
                </>
                 )}




                {selectedCalc?.id === "Liquidacao-Sentenca-Previdenciaria" && (
                 <>
                <p><strong>Valor Atualizado:</strong> R$ {result.valorAtualizado}</p>
                <p><strong>Total de Juros:</strong> R$ {result.totalJuros}</p>
                <p><strong>Total da Correção:</strong> R$ {result.totalCorrecao}</p>
                </>
                 )}


                {selectedCalc?.id === "Contribuicoes-Atraso" && (
                <>
                <p><strong>Valor Atualizado:</strong> R$ {result.valorAtualizado}</p>
                <p><strong>Total de Juros:</strong> R$ {result.totalJuros}</p>
                <p><strong>Total da Correção:</strong> R$ {result.totalCorrecao}</p>
               </>
                 )}


                {selectedCalc?.id === "Complementacao-Previdenciaria" && (
                <>
                <p><strong>Valor Corrigido:</strong> R$ {result.valorCorrigido}</p>
                <p><strong>Total da Correção:</strong> R$ {result.totalCorrecao}</p>
                <p><strong>Total de Contribuição Corrigida:</strong> R$ {result.totalContribuicao}</p>
               </>
                 )}


                {selectedCalc?.id === "RPPS-Uniao-Planejamento-Concessao-Revisao" && (
                <>
                <p><strong>Valor Corrigido:</strong> R$ {result.valorCorrigido}</p>
                <p><strong>Total da Correção:</strong> R$ {result.totalCorrecao}</p>
                <p><strong>Total de Contribuição Corrigida:</strong> R$ {result.totalContribuicao}</p>
                </>
                 )}


                {selectedCalc?.id === "RPPS-Estados-Planejamento-Concessao-Revisao" && (
                <>
                <p><strong>Valor Corrigido:</strong> R$ {result.valorCorrigido}</p>
                <p><strong>Total da Correção:</strong> R$ {result.totalCorrecao}</p>
                <p><strong>Total de Contribuição Corrigida:</strong> R$ {result.totalContribuicao}</p>
                </>
                 )}


                {selectedCalc?.id === "RPPS-Municipios-Planejamento-Concessao-Revisao" && (
                <>
                <p><strong>Valor Corrigido:</strong> R$ {result.valorCorrigido}</p>
                <p><strong>Total da Correção:</strong> R$ {result.totalCorrecao}</p>
                <p><strong>Total de Contribuição Corrigida:</strong> R$ {result.totalContribuicao}</p>
                </>
                 )}


                {selectedCalc?.id === "Superendividamento" && (
                <>
                <p><strong>Renda Disponível:</strong> R$ {result.rendaDisponivel}</p>
                <p><strong>% da Renda Comprometida:</strong>  {result.percentualComprometido}%</p>
                <p><strong>Nova Parcela Refinanciada:</strong> R$ {result.novaParcela}</p>
                <p><strong>Total Pago no Refinanciamento:</strong> R$ {result.totalPago}</p>
                </>
                 )}


              {/*  {selectedCalc?.id === "Revisao-RMC-RCC" && (
                <>
                <p><strong>Parcela paga corrigida:</strong> R$ {result.parcelaCorrigida}</p>
                <p><strong>Total pago corrigido:</strong>  {result.totalPagoCorrigido}%</p>
                <p><strong>Diferença da parcela:</strong> R$ {result.diferencaParcela}</p>
                <p><strong>Total da diferença:</strong> R$ {result.totalDiferenca}</p>
                </>
                 )} */} 

               <button
                onClick={handleDownloadPDF}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Baixar PDF
              </button>
            </div>
          )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Calculos;
