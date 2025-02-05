import React, { useState, useCallback, useEffect, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiSearch, FiX, FiPlus, FiMoreVertical, FiEye, FiEdit, FiTrash2, FiCheck, FiLayout, FiArrowRight } from "react-icons/fi";
import { fetchClients, addClient, deleteClient, updateClient } from '../../constants/index';

const CRM = () => {
  const [Clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProtocoloStatus, setSelectedProtocoloStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showAction, setShowAction] = useState(null);
  const [viewClient, setViewClient] = useState(null);
  const [editClient, setEditClient] = useState(null);
  const [isKanbanView, setIsKanbanView] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Negociação");
  const [newClient, setNewClient] = useState({
    name: "",
    cpf: "",
    cnpj: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    ProtocoloStatus: "Análise do Caso",
    priority: "normal",
    datetime: "",
    description: "",
    typeclient: ""
  });

  const sections = useMemo(() => [
    {
      name: "Negociação",
      statuses: [
        "Análise do Caso",
        "Aguardando Documentos",
        "Apresentação de Proposta",
        "Agendar Consulta",
        "Cobrança Inicial",
        "Definição de Interesses",
        "Elaboração de Parecer Jurídico",
        "Fechamento",
        "Planejamento",
      ],
      color: "bg-gray-100 text-gray-800",
    },
    {
      name: "Consultoria",
      statuses: [
        "Elaboração de contrato",
        "Elaboração de Parecer",
        "Enviada Notificação Extrajudicial",
        "Elaboração de Termo de Acordo",
        "Agendada a Reunião de Composição de Acordo",
      ],
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Administrativo",
      statuses: [
        "AGENDADO ATENDIMENTO NO ÓRGÃO",
        "REQUERIMENTO PROTOCOLADO",
        "ATENDENDO EXIGÊNCIAS",
        "AGUARDANDO DECISÃO DO ÓRGÃO",
        "DECISÃO PROFERIDA",
        "RECURSO ADMINISTRATIVO PROTOCOLADO",
        "AGUARDANDO DECISÃO DO RECURSO",
        "DECISÃO DO RECURSO PROFERIDA",
        "AGUARDANDO CÓPIA DO PROCESSO ADMINISTRATIVO",
        "DESENVOLVENDO INICIAL DE AÇÃO JUDICIAL",
      ],
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Judicial",
      statuses: [
        "AÇÃO PROTOCOLADA/INICIADA",
        "COM JUIZ(A) PARA ANÁLISE",
        "AGUARDANDO MANIFESTAÇÃO DA PARTE CONTRÁRIA",
        "AGUARDANDO AUDIÊNCIA",
        "AGUARDANDO JULGAMENTO",
        "SENTENÇA PROFERIDA",
        "TRANSITO EM JULGADO/PROCESSO FINALIZADO",
        "DESENVOLVENDO RECURSO",
      ],
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Recursal",
      statuses: [
        "RECURSO PROTOCOLADO/INICIADO",
        "APRESENTADA A RESPOSTA A RECURSO DA PARTE CONTRÁRIA (CONTRARRAZÕES)",
        "AGUARDANDO JULGAMENTO DO RECURSO",
        "RECURSO JULGADO",
        "TRANSITO EM JULGADO/NÃO CABE MAIS RECURSO",
        "DESENVOLVENDO RECURSO AOS TRIBUNAIS SUPERIORES",
      ],
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "Execução",
      statuses: [
        "ELABORAÇÃO DE CÁLCULO",
        "CITAÇÃO DO DEVEDOR PARA PAGAMENTO",
        "AGUARDANDO PENHORA",
        "AGUARDANDO JULGAMENTO DA EXECUÇÃO",
        "EXECUÇÃO JULGADA",
        "APRESENTADO RECURSO",
        "RESPOSTA A RECURSO",
        "AGUARDANDO SENTENÇA DE LIQUIDAÇÃO",
        "AGUARDANDO DECISÃO DO TRIBUNAL",
        "RPV EMITIDO",
        "AGUARDANDO PAGAMENTO DE CONDENAÇÃO",
      ],
      color: "bg-pink-100 text-pink-800",
    },
    {
      name: "Financeiro",
      statuses: ["PROCESSO RH PENDENTE"],
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      name: "Arquivamento",
      statuses: [
        "ANALISADO E NÃO DISTRIBUIDO",
        "ARQUIVADO POR INTERESSE DO CLIENTE",
        "ARQUIVADO POR DETERMINAÇÃO JUDICIAL",
        "ARQUIVADO/ENCERRADO",
      ],
      color: "bg-red-100 text-red-800",
    },
  ], []);

  const getSectionColor = useCallback((ProtocoloStatus) => {
    const section = sections.find((section) =>
      section.statuses.includes(ProtocoloStatus)
    );
    return section ? section.color : "bg-gray-100 text-gray-800";
  }, [sections]);

  const getPriorityColor = useCallback((priority) => {
    const colors = {
      baixa: "bg-green-50 text-green-700",
      normal: "bg-blue-50 text-blue-700",
      alta: "bg-orange-50 text-orange-700",
      urgente: "bg-red-50 text-red-700",
    };
    return colors[priority];
  }, []);

  const filteredClients = useMemo(() =>
    Clients
      .filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedProtocoloStatus ? client.ProtocoloStatus === selectedProtocoloStatus : true) &&
        (selectedPriority ? client.priority === selectedPriority : true)
      )
      .sort((a, b) => {
        const dateA = new Date(a.datetime);
        const dateB = new Date(b.datetime);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }), [Clients, searchQuery, selectedProtocoloStatus, selectedPriority, sortOrder]);

  const moveClient = useCallback(async (clientId, newStatus) => {
    const updatedClient = Clients.find(client => client.id === clientId);
    if (updatedClient) {
      updatedClient.ProtocoloStatus = newStatus;
      await updateClient(updatedClient.id, updatedClient);
      setClients(await fetchClients());
    }
  }, [Clients]);

  const ClientCard = ({ client }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "CLIENT",
      item: { id: client.id },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    });

    return (
      <div
        ref={drag}
        className={`p-4 bg-white rounded-lg shadow-md ${isDragging ? "opacity-50" : ""}`}
      >
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800">{client.name}</h3>
          <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === client.id ? null : client.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiMoreVertical />
                          </button>
                          {showActionMenu === client.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1" role="menu">
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleViewClient(client)}
                                >
                                  <FiEye className="mr-3" /> Ver
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => {
                                    setEditClient(client);
                                    setShowEditModal(true);
                                  }}
                                >
                                  <FiEdit className="mr-3" /> Editar
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleDeleteClient(client.id)}
                                >
                                  <FiTrash2 className="mr-3" /> Remover
                                </button>
                              </div>
                            </div>
                          )}
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(client.priority)}`}>
            {client.priority}
          </span>
          <p className="text-sm text-gray-600">{client.datetime}</p>
        </div>
      </div>
    );
  };

  const Column = ({ status, clients }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "CLIENT",
      drop: (item) => moveClient(item.id, status),
      collect: monitor => ({
        isOver: monitor.isOver()
      })
    });

    return (
      <div
        ref={drop}
        className={`p-4 bg-gray-100 rounded-lg ${isOver ? "bg-gray-200" : ""}`}
      >
        <h2 className="font-bold mb-4 text-gray-700">{status}</h2>
        <div className="space-y-4">
          {clients.filter(client => client.ProtocoloStatus === status).map(client => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      </div>
    );
  };

  const KanbanBoard = () => {
    const selectedSectionData = sections.find((section) => section.name === selectedSection);

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex space-x-4 mb-6">
          {sections.map((section) => (
            <button
              key={section.name}
              onClick={() => setSelectedSection(section.name)}
              className={`px-4 py-2 rounded-lg ${
                selectedSection === section.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4">
          {selectedSectionData.statuses.map((ProtocoloStatus) => (
            <Column key={ProtocoloStatus} status={ProtocoloStatus} clients={filteredClients} />
          ))}
        </div>
      </div>
    );
  };

  const handleAddClient = async () => {
    await addClient(newClient);
    setClients(await fetchClients());
    setShowAddModal(false);
    setNewClient({
      name: "",
      cpf: "",
      cnpj: "",
      email: "",
      phone: "",
      birthDate: "",
      address: "",
      ProtocoloStatus: "Análise do Caso",
      priority: "normal",
      datetime: "",
      description: "",
      typeclient: ""
    });
  };

  const handleEditClient = async () => {
    await updateClient(editClient.id, editClient);
    setClients(await fetchClients());
    setShowEditModal(false);
  };

  const handleViewClient = (client) => {
    setViewClient(client);
    setShowViewModal(true);
  };

  const handleDeleteClient = async (id) => {
    await deleteClient(id);
    setClients(await fetchClients());
  };

  useEffect(() => {
    const loadClients = async () => {
      const Clients = await fetchClients();
      setClients(Clients);
    };
    loadClients();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Buscar Clientes..."
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>
            <select
              value={selectedProtocoloStatus}
              onChange={(e) => setSelectedProtocoloStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os Status</option>
              {sections.flatMap((section) =>
                section.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))
              )}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as Prioridades</option>
              <option value="baixa">Baixa</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Mais recentes primeiro</option>
              <option value="asc">Mais antigas primeiro</option>
            </select>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setIsKanbanView(!isKanbanView)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
            >
              <FiLayout className="mr-2" /> {isKanbanView ? "Visualização em Lista" : "Visualização Kanban"}
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FiPlus className="mr-2" /> Adicionar Cliente
            </button>
          </div>

          {isKanbanView && <KanbanBoard />}

          {!isKanbanView && (
            <div className="">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSectionColor(client.ProtocoloStatus)}`}>
                          {client.ProtocoloStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(client.priority)}`}>
                          {client.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === client.id ? null : client.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiMoreVertical />
                          </button>
                          {showActionMenu === client.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1" role="menu">
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleViewClient(client)}
                                >
                                  <FiEye className="mr-3" /> Ver
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => {
                                    setEditClient(client);
                                    setShowEditModal(true);
                                  }}
                                >
                                  <FiEdit className="mr-3" /> Editar
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleDeleteClient(client.id)}
                                >
                                  <FiTrash2 className="mr-3" /> Remover
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Adicionar Cliente</h2>
      <div className="space-y-4">
        <select
          value={newClient.typeclient}
          onChange={(e) => setNewClient({ ...newClient, typeclient: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione o tipo de cliente</option>
          <option value="fisica">Pessoa Física</option>
          <option value="juridica">Pessoa Jurídica</option>
        </select>
        {newClient.typeclient !== "" && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            />
            {newClient.typeclient === "fisica" ? (
              <input
                type="text"
                placeholder="CPF"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                value={newClient.cpf}
                onChange={(e) => setNewClient({ ...newClient, cpf: e.target.value })}
              />
            ) : (
              <input
                type="text"
                placeholder="CNPJ"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                value={newClient.cnpj}
                onChange={(e) => setNewClient({ ...newClient, cnpj: e.target.value })}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Número de Telefone"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            />
            {newClient.typeclient === "fisica" && (
              <input
                type="date"
                placeholder="Data de Nascimento"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                value={newClient.birthDate}
                onChange={(e) => setNewClient({ ...newClient, birthDate: e.target.value })}
              />
            )}
            <input
              type="text"
              placeholder="Endereço"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              value={newClient.address}
              onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
            />
            <select
              value={newClient.ProtocoloStatus}
              onChange={(e) => setNewClient({ ...newClient, ProtocoloStatus: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
            >
              {sections.flatMap((section) =>
                section.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))
              )}
            </select>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowAddModal(false)}
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

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
              <div className="space-y-4">
                <select
                  value={editClient.typeclient}
                  onChange={(e) => setEditClient({ ...editClient, typeclient: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione o tipo de cliente</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  value={editClient.name}
                  onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
                />
                {editClient.typeclient === "fisica" ? (
                  <input
                    type="text"
                    placeholder="CPF"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    value={editClient.cpf}
                    onChange={(e) => setEditClient({ ...editClient, cpf: e.target.value })}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="CNPJ"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    value={editClient.cnpj}
                    onChange={(e) => setEditClient({ ...editClient, cnpj: e.target.value })}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  value={editClient.email}
                  onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Número de Telefone"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  value={editClient.phone}
                  onChange={(e) => setEditClient({ ...editClient, phone: e.target.value })}
                />
                {editClient.typeclient === "fisica" && (
                  <input
                    type="date"
                    placeholder="Data de Nascimento"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    value={editClient.birthDate}
                    onChange={(e) => setEditClient({ ...editClient, birthDate: e.target.value })}
                  />
                )}
                <input
                  type="text"
                  placeholder="Endereço"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                  value={editClient.address}
                  onChange={(e) => setEditClient({ ...editClient, address: e.target.value })}
                />
                <select
                  value={editClient.ProtocoloStatus}
                  onChange={(e) => setEditClient({ ...editClient, ProtocoloStatus: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                >
                  {sections.flatMap((section) =>
                    section.statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))
                  )}
                </select>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEditClient}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showViewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Visualizar Cliente</h2>
              <div className="space-y-4">
                <p><strong>Tipo de Pessoa:</strong> {viewClient.typeclient}</p>
                <p><strong>Nome:</strong> {viewClient.name}</p>
                {viewClient.cpf && <p><strong>CPF:</strong> {viewClient.cpf}</p>}
                {viewClient.cnpj && <p><strong>CNPJ:</strong> {viewClient.cnpj}</p>}
                <p><strong>Email:</strong> {viewClient.email}</p>
                <p><strong>Telefone:</strong> {viewClient.phone}</p>
                {viewClient.birthDate && <p><strong>Data de Nascimento:</strong> {viewClient.birthDate}</p>}
                <p><strong>Endereço:</strong> {viewClient.address}</p>
                <p><strong>Status:</strong> {viewClient.ProtocoloStatus}</p>
                <p><strong>Prioridade:</strong> {viewClient.priority}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default CRM;