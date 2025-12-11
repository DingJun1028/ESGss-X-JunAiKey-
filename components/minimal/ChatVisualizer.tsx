
import React from 'react';
import { 
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, Radar, PolarGrid, 
    PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend 
} from 'recharts';
import { marked } from 'marked';
import { Table, FileSpreadsheet, Activity, PieChart as PieIcon, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

interface ChatVisualizerProps {
    content: string; // The raw text content from the AI
}

// Helper to extract JSON from the specific code block
const extractUiJson = (text: string) => {
    const regex = /```json_ui([\s\S]*?)```/;
    const match = text.match(regex);
    if (match && match[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (e) {
            console.error("Failed to parse UI JSON", e);
            return null;
        }
    }
    return null;
};

// Remove the code block from the display text so we don't show raw JSON
const cleanText = (text: string) => {
    return text.replace(/```json_ui[\s\S]*?```/g, '').trim();
};

const COLORS = ['#10b981', '#fbbf24', '#8b5cf6', '#3b82f6', '#ec4899', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-white font-bold text-xs mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-[10px]" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const ChatVisualizer: React.FC<ChatVisualizerProps> = ({ content }) => {
    const uiData = extractUiJson(content);
    const displayText = cleanText(content);

    return (
        <div className="space-y-4 w-full">
            {displayText && (
                <div 
                    className="markdown-content text-gray-200 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: marked.parse(displayText) as string }} 
                />
            )}

            {uiData && (
                <div className="mt-2 w-full animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3 bg-white/5 p-3 rounded-t-xl border border-white/10 border-b-0">
                        {uiData.type === 'chart' ? (
                            uiData.chartType === 'pie' ? <PieIcon className="w-4 h-4 text-celestial-purple" /> :
                            uiData.chartType === 'radar' ? <Activity className="w-4 h-4 text-celestial-gold" /> :
                            <BarChart3 className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                        )}
                        <div>
                            <h4 className="text-sm font-bold text-white leading-tight">{uiData.title}</h4>
                            {uiData.description && <p className="text-[10px] text-gray-400">{uiData.description}</p>}
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-b-xl p-4 overflow-hidden relative min-h-[250px]">
                        
                        {/* CHART RENDERER */}
                        {uiData.type === 'chart' && (
                            <div className="w-full h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    {/* Area / Line / Bar */}
                                    {(uiData.chartType === 'area' || uiData.chartType === 'line' || uiData.chartType === 'bar') && (
                                        React.createElement(
                                            uiData.chartType === 'area' ? AreaChart : uiData.chartType === 'bar' ? BarChart : LineChart,
                                            { data: uiData.data },
                                            [
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" key="grid" />,
                                                <XAxis dataKey={uiData.config?.xKey} stroke="#64748b" fontSize={10} tickLine={false} key="x" />,
                                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} key="y" />,
                                                <Tooltip content={<CustomTooltip />} key="tooltip" />,
                                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} key="legend" />,
                                                ...uiData.config?.dataKeys.map((key: any, i: number) => (
                                                    React.createElement(
                                                        uiData.chartType === 'area' ? Area : uiData.chartType === 'bar' ? Bar : Line,
                                                        {
                                                            key: key.key,
                                                            type: "monotone",
                                                            dataKey: key.key,
                                                            name: key.name,
                                                            stroke: key.color || COLORS[i % COLORS.length],
                                                            fill: key.color || COLORS[i % COLORS.length],
                                                            fillOpacity: uiData.chartType === 'area' ? 0.3 : 1
                                                        }
                                                    )
                                                ))
                                            ]
                                        )
                                    )}

                                    {/* Pie Chart */}
                                    {uiData.chartType === 'pie' && (
                                        <PieChart>
                                            <Pie
                                                data={uiData.data}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {uiData.data.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                                        </PieChart>
                                    )}

                                    {/* Radar Chart */}
                                    {uiData.chartType === 'radar' && (
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={uiData.data}>
                                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                            <PolarAngleAxis dataKey={uiData.config?.xKey} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                            {uiData.config?.dataKeys.map((key: any, i: number) => (
                                                <Radar
                                                    key={key.key}
                                                    name={key.name}
                                                    dataKey={key.key}
                                                    stroke={key.color || COLORS[i % COLORS.length]}
                                                    fill={key.color || COLORS[i % COLORS.length]}
                                                    fillOpacity={0.4}
                                                />
                                            ))}
                                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                                            <Tooltip content={<CustomTooltip />} />
                                        </RadarChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* TABLE RENDERER */}
                        {uiData.type === 'table' && (
                            <div className="overflow-x-auto custom-scrollbar max-h-[250px]">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead className="sticky top-0 bg-slate-900 z-10">
                                        <tr className="border-b border-white/10 text-gray-400">
                                            {uiData.columns.map((col: string, idx: number) => (
                                                <th key={idx} className="p-2 font-bold uppercase tracking-wider">{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-300 divide-y divide-white/5">
                                        {uiData.data.map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                {uiData.columns.map((col: string, idx: number) => (
                                                    <td key={idx} className="p-2 whitespace-nowrap">{row[col]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
