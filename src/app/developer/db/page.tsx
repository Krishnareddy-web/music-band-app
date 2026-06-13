"use client";

import { useState, useEffect } from "react";
import { Database, Search, ChevronRight, Download, RefreshCw, AlertCircle, Edit2, X, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MODELS = ["User", "Event", "Booking", "Purchase", "Account", "Session"];

export default function DatabaseExplorer() {
    const [selectedModel, setSelectedModel] = useState("User");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/developer/db?model=${selectedModel}`);
            const json = await res.json();
            setData(Array.isArray(json) ? json : []);
        } catch (err) {
            console.error(err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedModel]);

    const filteredData = data.filter(item =>
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getKeys = (items: any[]) => {
        if (!items.length) return [];
        return Object.keys(items[0]);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setEditForm({ ...item });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/developer/db/${selectedModel}/${editingItem.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                setEditingItem(null);
                fetchData();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/developer/db/${selectedModel}/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchData();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete record.");
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Database className="text-purple-400" />
                        God-Mode Explorer
                    </h1>
                    <p className="text-gray-500 font-mono text-xs mt-1 uppercase tracking-tighter">Direct record manipulation level: ROOT</p>
                </div>
                <div className="flex gap-2">
                    {MODELS.map(m => (
                        <button
                            key={m}
                            onClick={() => setSelectedModel(m)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all border",
                                selectedModel === m
                                    ? "bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                            )}
                        >
                            {m}s
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder={`Search in ${selectedModel} records...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:border-purple-500/50 transition-all font-mono text-sm"
                    />
                </div>
                <button
                    onClick={fetchData}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-400 transition-all"
                    title="Refresh Data"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono text-xs">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-4 py-4 font-bold text-gray-600">ACTIONS</th>
                                {getKeys(data).map(key => (
                                    <th key={key} className="px-6 py-4 font-bold text-purple-400 border-r border-white/5 last:border-0 uppercase tracking-widest truncate max-w-[150px]">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={20} className="px-6 py-20 text-center text-gray-600 italic animate-pulse">
                                        Accessing core memory registers...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={20} className="px-6 py-20 text-center text-gray-700 flex flex-col items-center gap-2">
                                        <AlertCircle size={24} />
                                        Zero-byte result set returned.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-purple-500/[0.05] group transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-500 hover:text-purple-400 transition-colors">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        {getKeys(data).map(key => (
                                            <td key={key} className="px-6 py-4 border-r border-white/5 last:border-0 truncate max-w-[200px]" title={String(item[key])}>
                                                <span className={cn(
                                                    item[key] === null ? "text-red-900" :
                                                        typeof item[key] === 'boolean' ? "text-blue-400" :
                                                            "text-gray-300"
                                                )}>
                                                    {item[key] === null ? "null" : String(item[key])}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-purple-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                        <header className="p-6 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
                                    <Edit2 size={20} className="text-purple-400" />
                                    MANIPULATE_RECORD
                                </h2>
                                <p className="text-xs text-gray-500 font-mono mt-1">UUID: {editingItem.id}</p>
                            </div>
                            <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono">
                            {Object.keys(editingItem).map(key => {
                                if (key === 'id' || key === 'createdAt' || key === 'updatedAt') return null;
                                return (
                                    <div key={key} className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{key}</label>
                                        <input
                                            type="text"
                                            value={editForm[key] === null ? "" : editForm[key]}
                                            onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                                            placeholder={`Set ${key}...`}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <footer className="p-6 border-t border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => setEditingItem(null)}
                                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-2.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2"
                            >
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                                Commit Changes
                            </button>
                        </footer>
                    </div>
                </div>
            )}

            <footer className="flex justify-between items-center text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                <p>Status: Local Sync Active</p>
                <p>Showing {filteredData.length} of {data.length} records</p>
            </footer>
        </div>
    );
}
