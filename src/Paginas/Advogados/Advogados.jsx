import React, { useState } from "react";
import { FiSearch, FiFilter, FiUserPlus } from "react-icons/fi";
import { advdados } from "../../constants";

const Advogados = () => {


  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar clientes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <FiUserPlus />
          Adicionar Advogados
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {advdados.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={customer.image}
              alt={customer.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{customer.name}</h3>
              <p className="text-gray-600">{customer.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advogados;
