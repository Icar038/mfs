import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiThumbsUp, FiThumbsDown, FiDownload, FiPlus, FiFilter, FiMail, FiLock } from "react-icons/fi";
import { Document, Page } from "react-pdf";
import { debounce } from "lodash";

const Modelosaberto = () => {
  const processTypes = [
    "Criminal Process",
    "Labor Process",
    "Civil Process",
    "Administrative Process"
  ];

  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Annual Report 2023",
      description: "Comprehensive financial report for fiscal year 2023",
      likes: 45,
      dislikes: 2,
      fileUrl: "sample.pdf",
      processType: "Labor Process"
    },
    {
      id: 2,
      title: "Project Proposal",
      description: "New initiative for Q4 development phase",
      likes: 32,
      dislikes: 5,
      fileUrl: "proposal.pdf",
      processType: "Criminal Process"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocs, setFilteredDocs] = useState(documents);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedProcessType, setSelectedProcessType] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const itemsPerPage = 15;

  const debouncedSearch = useCallback(
    debounce((query, processType) => {
      let filtered = documents;
      
      if (query) {
        filtered = filtered.filter(
          (doc) =>
            doc.title.toLowerCase().includes(query.toLowerCase()) ||
            doc.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      if (processType) {
        filtered = filtered.filter(doc => doc.processType === processType);
      }
      
      setFilteredDocs(filtered);
    }, 300),
    [documents]
  );

  useEffect(() => {
    debouncedSearch(searchQuery, selectedProcessType);
  }, [searchQuery, selectedProcessType, debouncedSearch]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log("Login attempted with:", loginData);
    setShowLoginModal(false);
  };

  const handleLike = (docId, isLike) => {
    setDocuments(
      documents.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            likes: isLike ? doc.likes + 1 : doc.likes,
            dislikes: !isLike ? doc.dislikes + 1 : doc.dislikes
          };
        }
        return doc;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Document Manager</h1>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedProcessType}
                  onChange={(e) => setSelectedProcessType(e.target.value)}
                  className="w-48 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Process Types</option>
                  {processTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-64 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
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
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="mr-2" /> Add Document
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setShowViewModal(true);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {doc.title}
                    </h3>
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {doc.processType}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {doc.description}
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(doc.id, true)}
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <FiThumbsUp className="mr-1" /> {doc.likes}
                    </button>
                    <button
                      onClick={() => handleLike(doc.id, false)}
                      className="flex items-center text-gray-600 hover:text-red-600"
                    >
                      <FiThumbsDown className="mr-1" /> {doc.dislikes}
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-gray-800">
                    <FiDownload />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Sidebar for Ads */}
      <div className="w-64 bg-white shadow-lg p-4 hidden lg:block">
        <h2 className="text-lg font-semibold mb-4">Advertisements</h2>
        <div className="space-y-4">
          {/* Ad placeholders */}
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Ad Space 1
          </div>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Ad Space 2
          </div>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Ad Space 3
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Login to Add Document</h2>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedDoc.title}</h2>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {selectedDoc.processType}
                </span>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{selectedDoc.description}</p>
            <div className="h-[600px] border rounded-lg">
              <Document file={selectedDoc.fileUrl}>
                <Page pageNumber={1} />
              </Document>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modelosaberto;
