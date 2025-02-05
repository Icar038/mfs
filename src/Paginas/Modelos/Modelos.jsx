import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiThumbsUp, FiThumbsDown, FiDownload, FiPlus, FiFilter } from "react-icons/fi";
import { Document, Page } from "react-pdf";
import { debounce } from "lodash";

const Modelos = () => {
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedProcessType, setSelectedProcessType] = useState("");
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    file: null,
    processType: ""
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

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.description || !newDoc.file || !newDoc.processType) {
      alert("Please fill all required fields");
      return;
    }
    if (newDoc.file.type !== "application/pdf") {
      alert("Please upload PDF files only");
      return;
    }
    const newDocument = {
      id: documents.length + 1,
      ...newDoc,
      likes: 0,
      dislikes: 0,
      fileUrl: URL.createObjectURL(newDoc.file)
    };
    setDocuments([...documents, newDocument]);
    setShowAddModal(false);
    setNewDoc({ title: "", description: "", file: null, processType: "" });
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
    <div className="">
      <header className="">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="title">Modelos</h1>
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
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2" /> Add Document
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Document</h2>
            <form onSubmit={handleAddDocument}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Process Type
                  </label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newDoc.processType}
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, processType: e.target.value })
                    }
                  >
                    <option value="">Select Process Type</option>
                    {processTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newDoc.title}
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                    value={newDoc.description}
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, description: e.target.value })
                    }
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    PDF File
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    className="mt-1 block w-full"
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, file: e.target.files[0] })
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default Modelos;
