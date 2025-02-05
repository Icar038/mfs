import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEllipsisV, FaTimes } from "react-icons/fa";
import { IoCheckmarkCircle, IoCloseCircle, IoTimeOutline } from "react-icons/io5";
import { fetchProcess, addProcess, fetchClients, addClient, deleteProcess, updateProcess, saveApiDataToDatabase } from "@/constants";
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
import { auth } from "@/Services/FirebaseConfig";

const Processos = () => {
  const [processes, setProcesses] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    active: true,
    closed: true,
    pending: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [newProcess, setNewProcess] = useState({
    author: "",
    defendant: "",
    processName: "",
    caseNumber: "",
    status: "active",
    date: "",
    area: "",
    clients: [],
    court: ""
  });
  const [newClient, setNewClient] = useState({
    name: "",
    cpf: "",
    cnpj: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    ProtocoloStatus: "AÇÃO PROTOCOLADA/INICIADA",
    priority: "normal",
    datetime: "",
    description: ""
  });
  const [clientType, setClientType] = useState("fisica");
  const [showClientForm, setShowClientForm] = useState(false);
  const [apiData, setApiData] = useState(null);

  const tribunais = [
    { value: "tjba", label: "TJBA" },
    { value: "tjal", label: "TJAL" },
    { value: "tjse", label: "TJSE" },
    { value: "tjac", label: "TJAC" },
    { value: "tjam", label: "TJAM" },
    { value: "tjap", label: "TJAP" },
    { value: "tjce", label: "TJCE" },
    { value: "tjdft", label: "TJDFT" },
    { value: "tjes", label: "TJES" },
    { value: "tjgo", label: "TJGO" },
    { value: "tjma", label: "TJMA" },
    { value: "tjmg", label: "TJMG" },
    { value: "tjms", label: "TJMS" },
    { value: "tjmt", label: "TJMT" }
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const processList = await fetchProcess();
        setProcesses(processList || []);
        const clientList = await fetchClients();
        setClients(clientList || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (newProcess.author && newProcess.defendant) {
      const authorFirstName = newProcess.author.split(" ")[0];
      const defendantFirstName = newProcess.defendant.split(" ")[0];
      setNewProcess((prev) => ({
        ...prev,
        processName: `${authorFirstName} X ${defendantFirstName}`
      }));
    }
  }, [newProcess.author, newProcess.defendant]);

  const statusColors = {
    active: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800"
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "active":
        return <IoCheckmarkCircle className="w-5 h-5 text-green-600" />;
      case "closed":
        return <IoCloseCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <IoTimeOutline className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const handleAddProcess = async () => {
    if (newProcess.processName && newProcess.caseNumber && newProcess.clients.length > 0) {
      try {
        await addProcess(newProcess);
        setProcesses([...processes, { ...newProcess, id: Date.now() }]);
        setNewProcess({ author: "", defendant: "", processName: "", caseNumber: "", status: "active", area: "", clients: [], court: "" });
        setShowAddForm(false);
      } catch (error) {
        console.error("Erro ao adicionar processo:", error);
      }
    }
  };

  const handleAddClient = async () => {
    try {
      const addedClient = await addClient(newClient);
      const clientWithId = {
        ...newClient,
        id: addedClient?.id || Date.now() // Garante que um ID seja atribuído
      };
      setClients([...clients, clientWithId]);
      setNewProcess({
        ...newProcess,
        clients: [...newProcess.clients, clientWithId]
      });
      setShowClientForm(false);
      setNewClient({
        name: "",
        cpf: "",
        cnpj: "",
        email: "",
        phone: "",
        birthDate: "",
        address: "",
        ProtocoloStatus: "AÇÃO PROTOCOLADA/INICIADA",
        priority: "normal",
        datetime: "",
        description: ""
      });
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };

  const handleClientSelection = (clientId) => {
    const selectedClient = clients.find(client => client.id === clientId);
    if (selectedClient && !newProcess.clients.some(client => client.id === clientId)) {
      setNewProcess({
        ...newProcess,
        clients: [...newProcess.clients, selectedClient]
      });
    }
  };

  const handleDeleteProcess = async (processId) => {
    try {
      await deleteProcess(processId);
      setProcesses(processes.filter(process => process.id !== processId));
    } catch (error) {
      console.error("Erro ao excluir processo:", error);
    }
  };

  const handleEditProcess = async () => {
    try {
      await updateProcess(selectedProcess.id, selectedProcess);
      setProcesses(processes.map(process => process.id === selectedProcess.id ? selectedProcess : process));
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao editar processo:", error);
    }
  };

  const fetchProcessDetails = async (processNumber, court) => {
    if (!processNumber || !court) {
      console.error("Número do processo ou tribunal não fornecido.");
      return;
    }

    try {
      let response;
      console.log(`Fetching details for process number: ${processNumber} from court: ${court}`);
      if (court === "tjba") {
        response = await getProcesstjba(processNumber);
      } else if (court === "tjal") {
        response = await getProcesstjal(processNumber);
      } else if (court === "tjse") {
        response = await getProcesstjse(processNumber);
      } else if (court === "tjac") {
        response = await getProcesstjac(processNumber);
      } else if (court === "tjam") {
        response = await getProcesstjam(processNumber);
      } else if (court === "tjap") {
        response = await getProcesstjap(processNumber);
      } else if (court === "tjce") {
        response = await getProcesstjce(processNumber);
      } else if (court === "tjdft") {
        response = await getProcesstjdft(processNumber);
      } else if (court === "tjes") {
        response = await getProcesstjes(processNumber);
      } else if (court === "tjgo") {
        response = await getProcesstjgo(processNumber);
      } else if (court === "tjma") {
        response = await getProcesstjma(processNumber);
      } else if (court === "tjmg") {
        response = await getProcesstjmg(processNumber);
      } else if (court === "tjms") {
        response = await getProcesstjms(processNumber);
      } else if (court === "tjmt") {
        response = await getProcesstjmt(processNumber);
      } else {
        console.error("Tribunal não encontrado.");
        return;
      }
  
      
      console.log('API Response:', response);
      const apiData = response.hits.hits[0]._source;
      setApiData(apiData);
      await saveApiDataToDatabase(selectedProcess.id, apiData); // Save API data to the database
      setModalType("view");
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao buscar processo:', error);
    }
  };
  
  const handleViewProcess = async (process) => {
    setSelectedProcess(process);
    setModalType("view");
    setShowModal(true);
    await fetchProcessDetails(process.caseNumber, process.court);
  };

  const filteredProcesses = processes.filter(
    (process) =>
      filters[process.status] &&
      (process.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.caseNumber.includes(searchTerm))
  );

  const renderModalContent = () => {
    if (!selectedProcess) return null;
  
    if (modalType === "view") {
      return (
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-700">Informações do Autor</h3>
              <p>Nome: {selectedProcess.author}</p>
              <p>CPF: {selectedProcess.cpf}</p>
              <p>Endereço: {selectedProcess.address}</p>
            </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-700">Informações do Réu</h3>
              <p>Nome: {selectedProcess.defendant}</p>
              <p>CPF: {selectedProcess.defendantCpf}</p>
              <p>Endereço: {selectedProcess.defendantAddress}</p>
            </div>
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg"> 
          <div>
            <h3 className="font-medium text-gray-700">Informações</h3>
            <p>Número do Processo: {apiData?.numeroProcesso}</p>
            <p>Tribunal: {selectedProcess.court}</p>
            <p>Data de Início: {apiData?.dataInicio}</p>
          </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-lg mb-2 text-gray-800">Movimentos</h4>
            <div className="flex flex-col gap-y-3">
              {apiData?.movimentos?.map((movimento, index) => (
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
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      );
    }
  
    if (modalType === "edit") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Autor</label>
            <input
              type="text"
              value={selectedProcess.author}
              onChange={(e) => setSelectedProcess({ ...selectedProcess, author: e.target.value })}
              className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Réu</label>
            <input
              type="text"
              value={selectedProcess.defendant}
              onChange={(e) => setSelectedProcess({ ...selectedProcess, defendant: e.target.value })}
              className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Processo</label>
            <input
              type="text"
              value={selectedProcess.processName}
              onChange={(e) => setSelectedProcess({ ...selectedProcess, processName: e.target.value })}
              className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número do Processo</label>
            <input
              type="text"
              value={selectedProcess.caseNumber}
              onChange={(e) => setSelectedProcess({ ...selectedProcess, caseNumber: e.target.value })}
              className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tribunal</label>
            <select
              value={selectedProcess.court}
              onChange={(e) => setSelectedProcess({ ...selectedProcess, court: e.target.value })}
              className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">Selecione o tribunal</option>
              {tribunais.map((tribunal) => (
                <option key={tribunal.value} value={tribunal.value}>
                  {tribunal.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedProcess.status}
              onChange={(e) => setSelectedProcess({ ...selectedProcess, status: e.target.value })}
              className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="active">Ativo</option>
              <option value="closed">Concluído</option>
              <option value="pending">Pendente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clientes</label>
            {selectedProcess.clients?.map(client => (
              <p key={client.id} className="text-sm text-gray-600">{client.name}</p>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleEditProcess}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Salvar
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="title">Processos</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            <FaPlus /> Adicionar Processo
          </button>
        </div>

        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar processos..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-4 mb-6">
          {Object.entries(filters).map(([key, value]) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-lg border ${value ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}
              onClick={() => setFilters({ ...filters, [key]: !value })}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Adicionar Novo Processo</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-4">
              <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newProcess.area}
                  onChange={(e) => setNewProcess({ ...newProcess, area: e.target.value })}
                >
                  <option value="">Selecione a area</option>
                  <option value="Processo-Penal">Processo Penal</option>
                  <option value="Processo-Civil">Processo Civil</option>
                </select>
                <input
                  type="text"
                  placeholder="Nome do Autor"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newProcess.author}
                  onChange={(e) => setNewProcess({ ...newProcess, author: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Nome do Réu"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newProcess.defendant}
                  onChange={(e) => setNewProcess({ ...newProcess, defendant: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Nome do Processo"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newProcess.processName}
                  readOnly
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Data do Processo</label>
                <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newProcess.date}
                    onChange={(e) => setNewProcess({ ...newProcess, date: e.target.value })}
                  />
                <select
                  value={newProcess.court}
                  onChange={(e) => setNewProcess({ ...newProcess, court: e.target.value })}
                  className="p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="">Selecione o tribunal</option>
                  {tribunais.map((tribunal) => (
                    <option key={tribunal.value} value={tribunal.value}>
                      {tribunal.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Número do Processo"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newProcess.caseNumber}
                  onChange={(e) => setNewProcess({ ...newProcess, caseNumber: e.target.value })}
                />
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newProcess.status}
                  onChange={(e) => setNewProcess({ ...newProcess, status: e.target.value })}
                >
                  <option value="active">Ativo</option>
                  <option value="closed">Concluído</option>
                  <option value="pending">Pendente</option>
                </select>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => handleClientSelection(e.target.value)}
                >
                  <option value="">Selecione um Cliente</option>
                  {clients?.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowClientForm(true)}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Adicionar Novo Cliente
                </button>
                {newProcess.clients?.map(client => (
                  <p key={client.id} className="text-sm text-gray-600">{client.name}</p>
                ))}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddProcess}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Salvar Processo
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showClientForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Adicionar Novo Cliente</h2>
                <button onClick={() => setShowClientForm(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-4">
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
                {clientType === "fisica" ? (
                  <input
                    type="text"
                    placeholder="CPF"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newClient.cpf}
                    onChange={(e) => setNewClient({ ...newClient, cpf: e.target.value })}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="CNPJ"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newClient.cnpj}
                    onChange={(e) => setNewClient({ ...newClient, cnpj: e.target.value })}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Número de Telefone"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                />
                {clientType === "fisica" && (
                  <input
                    type="date"
                    placeholder="Data de Nascimento"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newClient.birthDate}
                    onChange={(e) => setNewClient({ ...newClient, birthDate: e.target.value })}
                  />
                )}
                <input
                  type="text"
                  placeholder="Endereço"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                />
                <select
                  value={newClient.ProtocoloStatus}
                  onChange={(e) => setNewClient({ ...newClient, ProtocoloStatus: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="AÇÃO PROTOCOLADA/INICIADA">AÇÃO PROTOCOLADA/INICIADA</option>
                  <option value="COM JUIZ(A) PARA ANÁLISE">COM JUIZ(A) PARA ANÁLISE</option>
                  <option value="AGUARDANDO MANIFESTAÇÃO DA PARTE CONTRÁRIA">AGUARDANDO MANIFESTAÇÃO DA PARTE CONTRÁRIA</option>
                  <option value="AGUARDANDO AUDIÊNCIA">AGUARDANDO AUDIÊNCIA</option>
                  <option value="AGUARDANDO JULGAMENTO">AGUARDANDO JULGAMENTO</option>
                  <option value="SENTENÇA PROFERIDA">SENTENÇA PROFERIDA</option>
                  <option value="TRANSITO EM JULGADO/PROCESSO FINALIZADO">TRANSITO EM JULGADO/PROCESSO FINALIZADO</option>
                </select>
                <select
                  value={newClient.priority}
                  onChange={(e) => setNewClient({ ...newClient, priority: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="normal">Normal</option>
                  <option value="baixa">Baixa</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowClientForm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddClient}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredProcesses?.map((process) => (
            <div
              key={process.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
            >
              <div className="flex items-center justify-between mb-2">
                <StatusIcon status={process.status} />
                <span className={`px-2 py-1 rounded-full text-xs ${statusColors[process.status]}`}>
                  {process.status}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setSelectedProcess(selectedProcess === process.id ? null : process.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaEllipsisV />
                  </button>
                  {selectedProcess === process.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => handleViewProcess(process)}
                      >
                        Visualizar Processo
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedProcess(process);
                          setModalType("edit");
                          setShowModal(true);
                        }}
                      >
                        Editar Processo
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-red-700 hover:bg-red-100"
                        onClick={() => handleDeleteProcess(process.id)}
                      >
                        Remover Processo
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{process.processName}</h3>
              <p className="text-sm text-gray-600">{process.caseNumber}</p>
              <p className="text-sm text-gray-600">Clientes:</p>
              {process.clients?.map(client => (
                <p key={client.id} className="text-xs text-gray-500">{client.name}</p>
              ))}
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-6xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{modalType === "view" ? "Visualizar Processo" : "Editar Processo"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
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

export default Processos;
