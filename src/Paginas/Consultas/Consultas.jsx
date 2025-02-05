import React, { useState, useEffect } from "react";
import { FaBuilding, FaUser, FaCar, FaFileAlt, FaPhone, FaSearch, FaTimes } from "react-icons/fa";
import { getCNPJ} from "../../Services/APICNPJConfig";
import { getProcesstjba, 
  getProcesstjal, 
  getProcesstjse, 
  getProcesstjac, 
  getProcesstjam, 
  getProcesstjap,
  getProcesstjce,
  getProcesstjdft,
  getProcesstjes,
  getProcesstjgo,
  getProcesstjma,
  getProcesstjmg,
  getProcesstjms,
  getProcesstjmt,


} from '../../Services/APIS';
import axios from "axios";


const Consultas = () => {
  const [searchValues, setSearchValues] = useState({
    processo: "",
    cnpj: "",
    cpf: "",
    placa: "",
    cpcSerasa: "",
    telefone: ""
  });

  const [selectedCourt, setSelectedCourt] = useState("tjba");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [notification, setNotification] = useState("");
  
 


  const dummyData = {
    processo: {
      nome: "João Silva",
      cpf: "123.456.789-00",
      dataNascimento: "01/01/1980",
      endereco: "Rua Residencial, 456",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      telefone: "(21) 98765-4321"
    },
    cpf: {
      nome: "João Silva",
      cpf: "123.456.789-00",
      dataNascimento: "01/01/1980",
      endereco: "Rua Residencial, 456",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      telefone: "(21) 98765-4321"
    },
    placa: {
      placa: "ABC1234",
      veiculo: "Toyota Corolla",
      ano: "2020",
      cor: "Prata",
      proprietario: "Maria Santos",
      situacao: "Regular"
    },

  };

  const handleSearch = async (type) => {
    const searchValue = searchValues[type]; // Captura o valor digitado
  
    if (!searchValue) {
      alert("Por favor, insira um valor para consulta.");
      return;
    }

    try {
      let response;
      if (type === "cnpj") {
        response = await getCNPJ(searchValue); // Passa o valor para a função da API
      } else if (type === "processo") {
        if (selectedCourt === "tjba") {
          response = await getProcesstjba(searchValue);
        } else if (selectedCourt === "tjal") {
          response = await getProcesstjal(searchValue);
        } else if (selectedCourt === "tjse") {
          response = await getProcesstjse(searchValue);
        } else if (selectedCourt === "tjac") {
          response = await getProcesstjac(searchValue);
        } else if (selectedCourt === "tjam") {
          response = await getProcesstjam(searchValue);
        } else if (selectedCourt === "tjap") {
          response = await getProcesstjap(searchValue);
        } else if (selectedCourt === "tjce") {
          response = await getProcesstjce(searchValue);
        } else if (selectedCourt === "tjdft") {
          response = await getProcesstjdft(searchValue);
        } else if (selectedCourt === "tjes") {
          response = await getProcesstjes(searchValue);
        } else if (selectedCourt === "tjgo") {
          response = await getProcesstjgo(searchValue);
        } else if (selectedCourt === "tjma") {
          response = await getProcesstjma(searchValue);
        } else if (selectedCourt === "tjmg") {
          response = await getProcesstjmg(searchValue);
        } else if (selectedCourt === "tjms") {
          response = await getProcesstjms(searchValue);
        } else if (selectedCourt === "tjmt") {
          response = await getProcesstjmt(searchValue);
        }
      } else {
        // Adicione outras condições para outros tipos de consulta (CPF, placa, etc.)
        response = dummyData[type]; // Mantém os dados fictícios para outros tipos
      }
  
      if (!response) {
        setNotification("Nenhum resultado encontrado.");
        setTimeout(() => setNotification(""), 3000);
        return;
      }

      setModalData(response); // Atualiza o estado com os dados da API
      setModalType(type);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao buscar dados. Tente novamente.");
    }
  };

  const handleInputChange = (type, value) => {
    setSearchValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const searchCards = [
    {
      id: "processo",
      title: "Consulta Processos",
      icon: FaBuilding,
      placeholder: "Digite o número do Processo"
    },
    {
      id: "cnpj",
      title: "Consulta CNPJ",
      icon: FaBuilding,
      placeholder: "Digite o CNPJ"
    },
    {
      id: "cpf",
      title: "Consulta CPF",
      icon: FaUser,
      placeholder: "Digite o CPF"
    },
    {
      id: "placa",
      title: "Consulta Placa de Veículo",
      icon: FaCar,
      placeholder: "Digite a placa"
    },
  ];

  const renderCNPJModal = () => (
    <div className="space-y-3">
      {/* Informações Empresariais */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-blue-800">Informações Empresariais</h4>
        <p><span className="font-semibold">CNPJ:</span> {modalData.cnpj}</p>
        <p><span className="font-semibold">Razão Social:</span> {modalData.razao_social}</p>
        <p><span className="font-semibold">Nome Fantasia:</span> {modalData.nome_fantasia}</p>
        <p><span className="font-semibold">Natureza Jurídica:</span> {modalData.natureza_juridica }</p>
        <p><span className="font-semibold">Porte:</span> {modalData.descricao_porte}</p>
        <p><span className="font-semibold">Capital Social:</span> {modalData.capital_social}</p>
        <p><span className="font-semibold">Data de Início de Atividade:</span> {modalData.data_inicio_atividade}</p>
      </div>
  
      {/* Localização */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-gray-800">Localização</h4>
        <p><span className="font-semibold">Endereço:</span> {modalData.logradouro}, {modalData.numero} - {modalData.complemento}</p>
        <p><span className="font-semibold">Bairro:</span> {modalData.bairro}</p>
        <p><span className="font-semibold">Cidade:</span> {modalData.municipio} - {modalData.uf}</p>
        <p><span className="font-semibold">CEP:</span> {modalData.cep}</p>
        <p><span className="font-semibold">País:</span> {modalData.pais || "Brasil"}</p>
      </div>
  
      {/* Status */}
      <div className="p-4 bg-green-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-green-800">Status</h4>
        <p><span className="font-semibold">Situação Cadastral:</span> {modalData.descricao_situacao_cadastral}</p>
        <p><span className="font-semibold">Data Situação Cadastral:</span> {modalData.data_situacao_cadastral}</p>
        <p><span className="font-semibold">Motivo da Situação Cadastral:</span> {modalData.descricao_motivo_situacao_cadastral}</p>
      </div>
  
      {/* Sócios */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-yellow-800">Sócios</h4>
        {modalData.qsa.map((socio, index) => (
          <div key={index} className="mb-4">
            <p><span className="font-semibold">Nome:</span> {socio.nome_socio}</p>
            <p><span className="font-semibold">Qualificação:</span> {socio.qualificacao_socio}</p>
            <p><span className="font-semibold">Data de Entrada:</span> {socio.data_entrada_sociedade}</p>
            <p><span className="font-semibold">Faixa Etária:</span> {socio.faixa_etaria}</p>
          </div>
        ))}
      </div>
  
      {/* Atividades Econômicas */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-purple-800">Atividades Econômicas</h4>
        <p><span className="font-semibold">CNAE Fiscal:</span> {modalData.cnae_fiscal_descricao}</p>
        <h5 className="font-semibold mt-2">CNAEs Secundários:</h5>
        <ul className="list-disc pl-5">
          {modalData.cnaes_secundarios.map((cnae, index) => (
            <li key={index}>{cnae.descricao} (Código: {cnae.codigo})</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderCPFModal = () => (
    <div className="space-y-3">
      <div className="p-4 bg-purple-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-purple-800">Dados Pessoais</h4>
        <p><span className="font-semibold">Nome:</span> {modalData.nome}</p>
        <p><span className="font-semibold">CPF:</span> {modalData.cpf}</p>
        <p><span className="font-semibold">Data de Nascimento:</span> {modalData.dataNascimento}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-gray-800">Contato</h4>
        <p><span className="font-semibold">Endereço:</span> {modalData.endereco}</p>
        <p><span className="font-semibold">Cidade:</span> {modalData.cidade}</p>
        <p><span className="font-semibold">Estado:</span> {modalData.estado}</p>
        <p><span className="font-semibold">Telefone:</span> {modalData.telefone}</p>
      </div>
    </div>
  );

  const renderPlacaModal = () => (
    <div className="space-y-3">
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-yellow-800">Dados do Veículo</h4>
        <p><span className="font-semibold">Placa:</span> {modalData.placa}</p>
        <p><span className="font-semibold">Veículo:</span> {modalData.veiculo}</p>
        <p><span className="font-semibold">Ano:</span> {modalData.ano}</p>
        <p><span className="font-semibold">Cor:</span> {modalData.cor}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-gray-800">Proprietário</h4>
        <p><span className="font-semibold">Nome:</span> {modalData.proprietario}</p>
        <p><span className="font-semibold">Situação:</span> {modalData.situacao}</p>
      </div>
    </div>
  );

  const renderCPCSerasaModal = () => (
    <div className="space-y-3">
      <div className="p-4 bg-red-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-red-800">Consulta CPC/Serasa</h4>
        <p><span className="font-semibold">Documento:</span> {modalData.documento}</p>
        <p><span className="font-semibold">Nome:</span> {modalData.nome}</p>
        <p><span className="font-semibold">Score:</span> {modalData.score}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-gray-800">Situação</h4>
        <p><span className="font-semibold">Protestos:</span> {modalData.protestos}</p>
        <p><span className="font-semibold">Processos:</span> {modalData.processos}</p>
        <p><span className="font-semibold">Última Consulta:</span> {modalData.ultimaConsulta}</p>
      </div>
    </div>
  );

  const renderTelefoneModal = () => (
    <div className="space-y-3">
      <div className="p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-indigo-800">Informações do Telefone</h4>
        <p><span className="font-semibold">Número:</span> {modalData.numero}</p>
        <p><span className="font-semibold">Titular:</span> {modalData.titular}</p>
        <p><span className="font-semibold">Operadora:</span> {modalData.operadora}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-gray-800">Detalhes</h4>
        <p><span className="font-semibold">Tipo:</span> {modalData.tipo}</p>
        <p><span className="font-semibold">Status:</span> {modalData.status}</p>
      </div>
    </div>
  );

  const renderProcessModal = () => {
    console.log('renderProcessModal called');
    console.log('modalData:', modalData);
  
    if (!modalData || !modalData.hits || !modalData.hits.hits || !modalData.hits.hits[0]) {
      return <div>Loading...</div>;
    }
  
    const processData = modalData.hits.hits[0]._source;
  
    return (
      <div className="space-y-3">
        <div className="p-4 bg-purple-50 rounded-lg">
  <h4 className="font-bold text-lg mb-2 text-purple-800">Dados do Processo</h4>
  <p><span className="font-semibold">Número do Processo:</span> {processData.numeroProcesso}</p>
  <p><span className="font-semibold">ID:</span> {processData.id}</p>
  <p><span className="font-semibold">Nível de Sigilo:</span> {processData.nivelSigilo}</p>
  <p><span className="font-semibold">Órgão Julgador:</span> {processData.orgaoJulgador.nome}</p>
  <p><span className="font-semibold">Assuntos:</span> {processData.assuntos.map((assunto, index) => (
    <span key={index}>{assunto.nome}{index < processData.assuntos.length - 1 ? ', ' : ''}</span>
  ))}</p>
  <p><span className="font-semibold">Classe:</span> {processData.classe?.nome}</p>
  <p><span className="font-semibold">Sistema:</span> {processData.sistema?.nome}</p>
  <p><span className="font-semibold">Formato:</span> {processData.formato?.nome}</p>
  <p><span className="font-semibold">Tribunal:</span> {processData.tribunal}</p>
  <p><span className="font-semibold">Data e Hora da Última Atualização:</span> {processData.dataHoraUltimaAtualizacao}</p>
  <p><span className="font-semibold">Grau:</span> {processData.grau}</p>
  <p><span className="font-semibold">Data e Hora do Ajuizamento:</span> {processData.dataAjuizamento}</p>
</div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold text-lg mb-2 text-gray-800">Movimentos</h4>
          <div className="flex flex-col gap-y-3">
          {processData.movimentos?.map((movimento, index) => (
  <div key={index} className="flex gap-x-3">
    <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
      <div className="relative z-10 size-7 flex justify-center items-center">
        <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
      </div>
    </div>
    <div className="grow pt-0.5 pb-8">
      <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
        {movimento.nome}
      </h3>
      {movimento.complementosTabelados?.map((complemento, index) => (
        <div key={index} className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
          <p>
            <span className="font-semibold">Complemento:</span> {complemento.nome} - {complemento.descricao}
          </p>
        </div>
      ))}
      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
        Data e Hora: {movimento.dataHora}
      </p>
    </div>
  </div>
))}
          </div>
        </div>
      </div>
    );
  };
  
  
  const renderModalContent = () => {
    console.log('renderModalContent called');
    console.log('modalType:', modalType);
  
    switch(modalType) {
      case "cnpj":
        return renderCNPJModal();
      case "cpf":
        return renderCPFModal();
      case "placa":
        return renderPlacaModal();
      case "cpcSerasa":
        return renderCPCSerasaModal();
      case "processo":
        return renderProcessModal();
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="container mx-auto">
        <h1 className="title">Consultas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchCards.map((card) => (
            <div 
              key={card.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <card.icon className="text-blue-600 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
              </div>

              <div className="space-y-4">
                {card.id === "processo" && (
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedCourt}
                      onChange={(e) => setSelectedCourt(e.target.value)}
                      className="p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="tjba">TJBA</option>
                      <option value="tjal">TJAL</option>
                      <option value="tjse">TJSE</option>
                      <option value="tjac">TJAC</option>
                      <option value="tjam">TJAM</option>
                      <option value="tjap">TJAP</option>
                      <option value="tjce">TJCE</option>
                      <option value="tjdft">TJDFT</option>
                      <option value="tjes">TJES</option>
                      <option value="tjgo">TJGO</option>
                      <option value="tjma">TJMA</option>
                      <option value="tjmg">TJMG</option>
                      <option value="tjms">TJMS</option>
                      <option value="tjmt">TJMT</option>
                    </select>
                    <input
                      type="text"
                      value={searchValues[card.id]}
                      onChange={(e) => handleInputChange(card.id, e.target.value)}
                      placeholder={card.placeholder}
                      className="w-full p-3 pr-10 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <button
                      onClick={() => handleSearch(card.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <FaSearch />
                    </button>
                  </div>
                )}
                {card.id !== "processo" && (
                  <div className="relative">
                    <input
                      type="text"
                      value={searchValues[card.id]}
                      onChange={(e) => handleInputChange(card.id, e.target.value)}
                      placeholder={card.placeholder}
                      className="w-full p-3 pr-10 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <button
                      onClick={() => handleSearch(card.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <FaSearch />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleSearch(card.id)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Consultar</span>
                  <FaSearch className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Resultado da Consulta</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              {renderModalContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultas;
