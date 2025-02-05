import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/Paginas/layout";
import DashboardPage from "@/Paginas/dashboard/page";
import Login from "./Paginas/Login/Login";
import Registrar from "./Paginas/Registrar/Registrar";
import Advogados from "./Paginas/Advogados/Advogados";
import Calculos from "./Paginas/Calculos/Calculos";
import Clientes from "./Paginas/Clientes/Clientes";
import Agenda from "./Paginas/Agenda/Agenda";
import Processos from "./Paginas/Processos/Processos";
import Consultas from "./Paginas/Consultas/Consultas";
import Configuracoes from "./Paginas/Configuracao/Configuraca";
import Modelos from "./Paginas/Modelos/Modelos";
import Modelosaberto from "./Paginas/Modelosaberto/Modelosaberto";
import Tarefas from "./Paginas/Tarefas/Tarefas";
import CRM from "./Paginas/Clientes/CRM";
import ConvertorImage from "./Paginas/ConvertorImage/ConvertorImage";
import ThankYouPage from "./Paginas/ConvertorImage/Thanks";
import Ladingpage from "./Paginas/Lading-page/LadingPage";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Ladingpage />,
            },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/registrar",
            element: <Registrar />,
        },
        {
            path: "/Modelosprocessuais",
            element: <Modelosaberto />,
        },
        {
            path: "/dashboard",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
               // {
               //     path: "analytics",
               //     element: <h1 className="title">Analytics</h1>,
               // },
               // {
              //      path: "reports",
              //      element: <h1 className="title">Reports</h1>,
              //  },
                //{
                //    path: "Advogados",
                //    element: <Advogados />,
               // },
               // {
               //     path: "Clientes",
               //     element: <Clientes/>,
               // },
                {
                    path: "CRM",
                    element: <CRM/>,
                },
                {
                    path: "Processos",
                    element: <Processos/>,
                },
                {
                    path: "Modelos-processuais",
                    element: <Modelos/>,
                },
                {
                    path: "Calculos",
                    element: <Calculos/>,
                },
                {
                    path: "Consultas",
                    element: <Consultas/>,
                },
                {
                    path: "Agenda",
                    element: <Agenda/>,
                },
                {
                    path: "Tarefas",
                    element: <Tarefas/>,
                },
                {
                    path: "ConvertorImage",
                    element: <ConvertorImage/>,
                    children: [
                        {
                            path: "Thank",
                            element: <ThankYouPage/>,
                        },
                    ],
                },
                {
                    path: "Ia-pecas",
                    element: <h1 className="title">Ia de Criação de Peças Processuais</h1>,
                },
                {
                    path: "Instagram-auto",
                    element: <h1 className="title">Automatize o Instagram</h1>,
                },
                {
                    path: "Whatsapp-auto",
                    element: <h1 className="title">Automatize o Whatsapp</h1>,
                },
                {
                    path: "Configuracoes",
                    element: < Configuracoes/>,
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
