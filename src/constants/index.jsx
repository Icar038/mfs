import { CheckSquare, ChartColumn, FileText, MessageCircle, Instagram, Brain, Calendar, Search, Calculator, ChartBar, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { db, auth } from '@/Services/FirebaseConfig.ts';

import ProfileImage from "@/assets/profile-image.jpeg";
import ProductImage from "@/assets/product-image.jpg";

export const navbarLinks = [
    {
        title: "Inicial",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/Dashboard",
            },
        //    {
        //        label: "Analytics",
        //        icon: ChartColumn,
        //        path: "/analytics",
        //    },
        //    {
        //        label: "Reports",
        //        icon: NotepadText,
        //        path: "/reports",
        //    },
        ],
    },
    {
        title: "Meu Escritório",
        links: [
           // {
           //     label: "Advogados",
            //    icon: Users,
            //    path: "/Dashboard/Advogados",
          //  },
           // {
           //     label: "Clientes",
           //     icon: Users,
           //     path: "/Dashboard/Clientes",
           // },
            {
                label: "CRM",
                icon: Users,
                path: "/Dashboard/CRM",
            },
            {
             label: "Processos",
             icon: UserCheck,
             path: "/Dashboard/Processos",
            },
        ],
    },
    {
        title: "Ferramentas",
        links: [
            {
                label: "Modelos Processuais",
                icon: FileText,
                path: "/Dashboard/Modelos-processuais",
            },
            {
                label: "Cálculos",
                icon: Calculator,
                path: "/Dashboard/Calculos",
            },
            {
                label: "Consultas",
                icon: Search,
                path: "/Dashboard/Consultas",
            },
            {
                label: "Agenda",
                icon: Calendar,
                path: "/Dashboard/Agenda",
            },
            {
                label: "Tarefas",
                icon: CheckSquare,
                path: "/Dashboard/Tarefas",            
            },
            {
                label: "Convertor de Imagens",
                icon: CheckSquare,
                path: "/Dashboard/ConvertorImage",
            },
            {
                label: "Ia Peças",
                icon: Brain,
                path: "/Dashboard/Ia-pecas",
            },
            {
                label: "Instagram auto",
                icon: Instagram,
                path: "/Dashboard/Instagram-auto",
            },
            {
                label: "Whatsapp auto",
                icon: MessageCircle,
                path: "/Dashboard/Whatsapp-auto",
            },
        ],
    },
    {
        title: "Configurações",
        links: [
            {
                label: "Configurações",
                icon: Settings,
                path: "/Dashboard/Configuracoes",
            },
        ],
    },
];



export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];



// Inicialmente, `DadosProcess` é um array vazio
export const DadosProcess = [];

// Função para buscar processos
export const fetchProcess = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    // Caminho para a coleção de processos dentro do userId
    const userCollectionRef = collection(getFirestore(), `users/${user.uid}/processes`);
    const q = query(userCollectionRef);
  
    const data = await getDocs(q);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
  
  // Função para adicionar um processo
  export const addProcess = async (newProcess) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    // Adiciona o processo dentro da coleção do usuário
    await addDoc(collection(getFirestore(), `users/${user.uid}/processes`), newProcess);
  };
  
  // Função para atualizar um processo existente
  export const updateProcess = async (id, updatedProcess) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    const docRef = doc(getFirestore(), `users/${user.uid}/processes`, id);
    await setDoc(docRef, updatedProcess, { merge: true });
  };
  
  // Função para excluir um processo
  export const deleteProcess = async (id) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    const docRef = doc(getFirestore(), `users/${user.uid}/processes`, id);
    await deleteDoc(docRef);
  };

// Função para salvar dados da API no banco de dados
export const saveApiDataToDatabase = async (processId, apiData) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    const docRef = doc(getFirestore(), `users/${user.uid}/processes`, processId);
    await setDoc(docRef, { apiData }, { merge: true });
  };

// Função para agregar dados de processos por mês
export const aggregateProcessDataByMonth = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    const userCollectionRef = collection(getFirestore(), `users/${user.uid}/processes`);
    const q = query(userCollectionRef);
  
    const data = await getDocs(q);
    const processes = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    const monthlyData = Array(12).fill(0);
  
    processes.forEach((process) => {
      const date = new Date(process.date);
      const month = date.getMonth();
      monthlyData[month]++;
    });
  
    return monthlyData.map((total, index) => ({
      name: new Date(0, index).toLocaleString('default', { month: 'short' }),
      total,
    }));
  };



// Inicialmente, `Dadosclientes` é um array vazio
export const Dadosclientes = [];

// Função para buscar clients
export const fetchClients = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    // Caminho para a coleção de clients dentro do userId
    const userCollectionRef = collection(getFirestore(), `users/${user.uid}/clients`);
    const q = query(userCollectionRef);
  
    const data = await getDocs(q);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
  
  // Função para adicionar um client
  export const addClient = async (newClient) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    // Adiciona o client dentro da coleção do usuário
    await addDoc(collection(getFirestore(), `users/${user.uid}/clients`), newClient);
  };
  
  // Função para atualizar um client existente
  export const updateClient = async (id, updatedClient) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    const docRef = doc(getFirestore(), `users/${user.uid}/clients`, id);
    await setDoc(docRef, updatedClient, { merge: true });
  };
  
  // Função para excluir um client
  export const deleteClient = async (id) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    const docRef = doc(getFirestore(), `users/${user.uid}/clients`, id);
    await deleteDoc(docRef);
  };


export const advdados = [
    {
        id: '1',
        name: 'Icaro',
        email: 'icaro@gmail.com',
        processName: "Icaro x Ambev",
        caseNumber: '0000000-00.0000.0.00.0000',
        client: {
            photo: "",
            name: 'Icaro',
            cpf: '000.000.000-00',
            rg: '00000000',
            email: 'icaro@gmail.com',
            phone: '(00) 0 0000-0000',
            address: 'Rua dos Bobos, nº 20',
        },
        area: 'Direito Penal',
        protocolStatus: "Protocolado",
        protocolDate: "",
        procuração: "",
        contrato: "",
    },
    {
        id: '1',
        name: 'Icaro',
        email: 'icaro@gmail.com',
        processName: "Icaro x Ambev",
        caseNumber: '0000000-00.0000.0.00.0000',
        client: {
            photo: "",
            name: 'Icaro',
            cpf: '000.000.000-00',
            rg: '00000000',
            email: 'icaro@gmail.com',
            phone: '(00) 0 0000-0000',
            address: 'Rua dos Bobos, nº 20',
        },
        area: 'Direito Penal',
        protocolStatus: "Protocolado",
        protocolDate: "",
        procuração: "",
        contrato: "",
    },
    {
        id: '1',
        name: 'Allice',
        email: 'Allice@gmail.com',
        processName: "Icaro x Ambev",
        caseNumber: '0000000-00.0000.0.00.0000',
        client: {
            photo: "",
            name: 'Allice',
            cpf: '000.000.000-00',
            rg: '00000000',
            email: 'icaro@gmail.com',
            phone: '(00) 0 0000-0000',
            address: 'Rua dos Bobos, nº 20',
        },
        area: 'Direito Penal',
        protocolStatus: "Protocolado",
        protocolDate: "",
        procuração: "",
        contrato: "",
    },
];

export const events = [
 
  ];

 // Função para buscar tasks
export const fetchTasks = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    // Caminho para a coleção de tasks dentro do userId
    const userCollectionRef = collection(getFirestore(), `users/${user.uid}/tasks`);
    const q = query(userCollectionRef);
  
    const data = await getDocs(q);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
  
  // Função para adicionar uma task
  export const addTask = async (newTask) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    // Adiciona a task dentro da coleção do usuário
    await addDoc(collection(getFirestore(), `users/${user.uid}/tasks`), newTask);
  };
  
  // Função para atualizar uma task existente
  export const updateTask = async (id, updatedTask) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    const docRef = doc(getFirestore(), `users/${user.uid}/tasks`, id);
    await setDoc(docRef, updatedTask, { merge: true });
  };
  
  // Função para excluir uma task
  export const deleteTask = async (id) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
  
    const docRef = doc(getFirestore(), `users/${user.uid}/tasks`, id);
    await deleteDoc(docRef);
  };

