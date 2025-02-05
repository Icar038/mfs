import React, { useState, useEffect } from "react";
import { FaUserCog, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useUpdatePassword } from 'react-firebase-hooks/auth';
import { auth, getFirestore, doc, getDoc, updateDoc } from '../../Services/FirebaseConfig'; 

const Configuracoes = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePassword, updating, error] = useUpdatePassword(auth);
  const [userData, setUserData] = useState({
    name: '',
    cpf: '',
    oab: '',
    phone: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(getFirestore(), "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('As novas senhas não coincidem.');
      return;
    }
    const success = await updatePassword(newPassword);
    if (success) {
      alert('Senha atualizada com sucesso.');
    }
  };

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(getFirestore(), "users", user.uid);
      await updateDoc(userDocRef, userData);
      alert('Perfil atualizado com sucesso.');
      setIsEditing(false);
    }
  };

  const configSections = [
    { id: "general", icon: FaUserCog, title: "Configurações Gerais" },
    { id: "security", icon: FaLock, title: "Segurança" },
  ];

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const renderConfigContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Perfil do Usuário</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nome"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                  <input
                    type="text"
                    placeholder="CPF"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={userData.cpf}
                    onChange={(e) => setUserData({ ...userData, cpf: e.target.value })}
                    disabled={!isEditing}
                  />
                  <input
                    type="text"
                    placeholder="OAB"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={userData.oab}
                    onChange={(e) => setUserData({ ...userData, oab: e.target.value })}
                    disabled={!isEditing}
                  />
                  <input
                    type="text"
                    placeholder="Telefone"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
                {isEditing && (
                  <button
                    className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    onClick={handleUpdateProfile}
                  >
                    Salvar
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Alterar Senha</h3>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    placeholder="Senha Atual"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    placeholder="Nova Senha"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    placeholder="Repetir Nova Senha"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {error && <p className="text-red-500">Error: {error.message}</p>}
                {updating && <p>Updating...</p>}
                <button
                  onClick={handleUpdatePassword}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Atualizar Senha
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="title">Configurações</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="p-4 rounded-xl shadow-sm bg-white">
              <nav className="space-y-2">
                {configSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-all ${activeTab === section.id
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"}`}
                  >
                    <section.icon />
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="p-6 rounded-xl shadow-sm bg-white">
              {renderConfigContent()}
            </div>
          </div>
        </div>

        {isModalOpen && selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 rounded-xl shadow-xl bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">{selectedCard.title}</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4">
                {selectedCard.fields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <label
                      htmlFor={`field-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field}
                    </label>
                    <input
                      type="number"
                      id={`field-${index}`}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder={`Digite o ${field.toLowerCase()}`}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Calcular
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracoes;