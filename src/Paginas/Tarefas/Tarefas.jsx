import React, { useState, useCallback, useEffect, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiSearch, FiX, FiPlus, FiMoreVertical, FiEye, FiEdit, FiTrash2, FiCheck, FiLayout, FiArrowLeft } from "react-icons/fi";
import { addTask, updateTask, deleteTask, fetchTasks } from '../../constants/index';
import { useNavigate } from 'react-router-dom';

const Tarefas = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    status: "não iniciada",
    priority: "normal",
    datetime: "",
    description: ""
  });
  const [isKanbanView, setIsKanbanView] = useState(false);

  const handleAddTask = useCallback(async (e) => {
    e.preventDefault();
    await addTask(newTask);
    setTasks(await fetchTasks());
    setShowAddModal(false);
    setNewTask({
      name: "",
      status: "não iniciada",
      priority: "normal",
      datetime: "",
      description: ""
    });
  }, [newTask]);

  const handleDeleteTask = useCallback(async (taskId) => {
    await deleteTask(taskId);
    setTasks(await fetchTasks());
    setShowActionMenu(null);
  }, []);

  const handleCompleteTask = useCallback(async (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    await updateTask(taskId, { ...task, completed: true, status: "concluida" });
    setTasks(await fetchTasks());
    setShowActionMenu(null);
  }, [tasks]);

  const handleUpdateTask = useCallback(async (e) => {
    e.preventDefault();
    await updateTask(editTask.id, editTask);
    setTasks(await fetchTasks());
    setShowEditModal(false);
  }, [editTask]);

  const handleViewTask = useCallback((task) => {
    setViewTask(task);
    setShowViewModal(true);
    setShowActionMenu(null);
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditTask(task);
    setShowEditModal(true);
    setShowActionMenu(null);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedStatus ? task.status === selectedStatus : true) &&
        (selectedPriority ? task.priority === selectedPriority : true)
      )
      .sort((a, b) => {
        const dateA = new Date(a.datetime);
        const dateB = new Date(b.datetime);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [tasks, searchQuery, selectedStatus, selectedPriority, sortOrder]);

  const getStatusColor = (status) => {
    const colors = {
      "não iniciada": "bg-gray-100 text-gray-800",
      "iniciada": "bg-blue-100 text-blue-800",
      "adiada": "bg-yellow-100 text-yellow-800",
      "concluida": "bg-green-100 text-green-800"
    };
    return colors[status];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      "baixa": "bg-green-50 text-green-700",
      "normal": "bg-blue-50 text-blue-700",
      "alta": "bg-orange-50 text-orange-700",
      "urgente": "bg-red-50 text-red-700"
    };
    return colors[priority];
  };

  const statuses = ["não iniciada", "iniciada", "adiada", "concluida"];

  useEffect(() => {
    const loadTasks = async () => {
      const tasks = await fetchTasks();
      console.log(tasks); // Verifique os dados
      setTasks(tasks);
    };
    loadTasks();
  }, [setTasks]); // Adicione essa dependência

  console.log(tasks); // Verifique o estado

  const moveTask = useCallback(async (taskId, newStatus) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    if (updatedTask) {
      updatedTask.status = newStatus;
      await updateTask(updatedTask.id, updatedTask);
      setTasks(await fetchTasks());
    }
  }, [tasks]);

  const TaskCard = ({ task }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "TASK",
      item: { id: task.id },
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
          <h3 className="font-semibold text-gray-800">{task.name}</h3>
          <div className="relative">
  <button
    onClick={() => setShowActionMenu(showActionMenu === task.id ? null : task.id)}
    className="text-gray-400 hover:text-gray-600"
  >
    <FiMoreVertical />
  </button>
  {showActionMenu === task.id && (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
      <div className="py-1" role="menu">
                <button onClick={() => handleViewTask(task)} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  <FiEye className="inline mr-2" /> Ver
                </button>
                <button onClick={() => { setEditTask(task); setShowEditModal(true); }} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  <FiEdit className="inline mr-2" /> Editar
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                  <FiTrash2 className="inline mr-2" /> Remover
                </button>
              </div>
            </div>
             )}
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <p className="text-sm text-gray-600">{task.datetime}</p>
        </div>
      </div>
    );
  };

  const Column = ({ status, tasks }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "TASK",
      drop: (item) => moveTask(item.id, status),
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
          {tasks.filter(task => task.status === status).map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    );
  };

  const KanbanBoard = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statuses.map((status) => (
          <Column key={status} status={status} tasks={filteredTasks} />
        ))}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="title">Gerenciamento de Tarefas</h1>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                onClick={() => setIsKanbanView(!isKanbanView)}
              >
                <FiLayout className="mr-2" /> {isKanbanView ? "Visualização em Lista" : "Visualização em Kanban"}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FiPlus className="mr-2" /> Adicionar Tarefa
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
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

            {isKanbanView ? (
              <KanbanBoard />
            ) : (
              <div className="">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefa</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data e Hora</th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.datetime}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => setShowActionMenu(showActionMenu === task.id ? null : task.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <FiMoreVertical />
                            </button>
                            {showActionMenu === task.id && (
                              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu">
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    onClick={() => handleViewTask(task)}
                                  >
                                    <FiEye className="mr-3" /> Ver
                                  </button>
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    onClick={() => handleEditTask(task)}
                                  >
                                    <FiEdit className="mr-3" /> Editar
                                  </button>
                                  {!task.completed && (
                                    <button
                                      className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => handleCompleteTask(task.id)}
                                    >
                                      <FiCheck className="mr-3" /> Concluir
                                    </button>
                                  )}
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                                    onClick={() => handleDeleteTask(task.id)}
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

          {/* All your modal components remain unchanged */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Adicionar Nova Tarefa</h2>
                <form onSubmit={handleAddTask}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome da Tarefa</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newTask.name}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descrição</label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      >
                        <option value="baixa">Baixa</option>
                        <option value="normal">Normal</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data e Hora</label>
                      <input
                        type="datetime-local"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newTask.datetime}
                        onChange={(e) => setNewTask({ ...newTask, datetime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Adicionar Tarefa
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* View Modal */}
          {showViewModal && viewTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Detalhes da Tarefa</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Nome</h3>
                    <p>{viewTask.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Descrição</h3>
                    <p>{viewTask.description}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Status</h3>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(viewTask.status)}`}>
                      {viewTask.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Prioridade</h3>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(viewTask.priority)}`}>
                      {viewTask.priority}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Data e Hora</h3>
                    <p>{viewTask.datetime}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && editTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Editar Tarefa</h2>
                <form onSubmit={handleUpdateTask}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome da Tarefa</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editTask.name}
                        onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descrição</label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editTask.description}
                        onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editTask.status}
                        onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editTask.priority}
                        onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                      >
                        <option value="baixa">Baixa</option>
                        <option value="normal">Normal</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data e Hora</label>
                      <input
                        type="datetime-local"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editTask.datetime}
                        onChange={(e) => setEditTask({ ...editTask, datetime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Tarefas;