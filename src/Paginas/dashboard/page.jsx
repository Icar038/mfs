import React, { useState, useEffect } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { aggregateProcessDataByMonth, events, fetchClients, fetchProcess, fetchTasks } from "@/constants";
import { Footer } from "@/layouts/footer";
import { Package, DollarSign, Users, TrendingUp, CheckSquare } from "lucide-react";
import { BsCalendarEvent } from "react-icons/bs";

import "react-calendar/dist/Calendar.css";

const DashboardPage = () => {
    const { theme } = useTheme();
    const [totalClientes, setTotalClientes] = useState(0);
    const [processes, setProcesses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [overviewData, setOverviewData] = useState([]);

    useEffect(() => {
        const loadClients = async () => {
            try {
                const clientsData = await fetchClients();
                setTotalClientes(clientsData.length);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        };

        const loadProcesses = async () => {
            try {
                const processesData = await fetchProcess();
                setProcesses(processesData);
            } catch (error) {
                console.error("Erro ao buscar processos:", error);
            }
        };

        const loadTasks = async () => {
            try {
                const tasksData = await fetchTasks();
                setTasks(tasksData);
            } catch (error) {
                console.error("Erro ao buscar Tarefas:", error);
            }
        };

        const loadOverviewData = async () => {
            try {
                const data = await aggregateProcessDataByMonth();
                setOverviewData(data);
            } catch (error) {
                console.error("Erro ao buscar dados de visão geral:", error);
            }
        };

        loadClients();
        loadProcesses();
        loadTasks();
        loadOverviewData();
    }, []);

    // Sort events by date
    const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Users size={26} />
                        </div>
                        <p className="card-title">Clientes</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{totalClientes}</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            15%
                        </span>
                    </div>
                </div>
              {/*   <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Total Paid Orders</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">$16,000</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            12%
                        </span>
                    </div>
                </div> */}
               {/*  <div className="card"> 
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <BsCalendarEvent size={26} />
                        </div>
                        <p className="card-title">Movimentações</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 max-h-48 overflow-y-auto">
                        <div className="space-y-2">
                            {sortedEvents.map((event, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-slate-100 rounded-lg transition-colors dark:bg-slate-950">
                                    <span className="text-sm font-medium dark:text-slate-50">{event.date}</span>
                                    <span className="text-sm dark:text-slate-50">{event.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <CheckSquare size={26} />
                        </div>
                        <p className="card-title">Tarefas</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 max-h-48 overflow-y-auto">
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-2 bg-slate-100 rounded-lg transition-colors dark:bg-slate-950">
                                    <span className="text-sm font-medium dark:text-slate-50">{task.datetime}</span>
                                    <span className="text-sm dark:text-slate-50">{task.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Overview</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <AreaChart
                                data={overviewData}
                                margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorTotal"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#2563eb"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => `${value} processos`}
                                />

                                <XAxis
                                    dataKey="name"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <YAxis
                                    dataKey="total"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickFormatter={(value) => `${value} processos`}
                                    tickMargin={6}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Processos</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        {processes.map((process) => (
                            <div
                                key={process.id}
                                className="p-4 bg-blue-50 rounded-lg mb-2"
                            >
                                <div className="flex items-center justify-between gap-x-4 py-2 pr-2">
                                    <div className="flex items-center gap-x-4">
                                        <div className="flex flex-col gap-y-2">
                                            <p className="font-medium text-slate-900 dark:text-slate-50">{process.processName}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{process.caseNumber}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-slate-900 dark:text-slate-50">{process.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;
