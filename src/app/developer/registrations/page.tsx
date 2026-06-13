"use client";

import { useState, useEffect } from "react";
import { Users, Shield, Settings, User as UserIcon, Edit2, X, Check, Trash2, Key, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeveloperRegistrations() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setEditForm({ ...user });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/developer/db/user/${editingUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                setEditingUser(null);
                fetchUsers();
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
        if (!confirm("Delete this user? This will remove all associated sessions and bookings.")) return;

        try {
            const res = await fetch(`/api/developer/db/user/${id}`, { method: 'DELETE' });
            if (res.ok) fetchUsers();
            else alert("Delete failed");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 font-mono">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="text-purple-400" />
                        Identity Node Registry
                    </h1>
                    <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">God-Mode Access: Directly manipulate authenticated identity objects.</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="p-2 border border-white/10 rounded hover:bg-white/5 transition-all text-gray-500 hover:text-white"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </header>

            <div className="bg-black/40 border border-purple-500/20 rounded-xl overflow-hidden shadow-2xl shadow-purple-500/5">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="bg-purple-500/5 border-b border-purple-500/20 text-purple-400">
                            <th className="px-6 py-4 font-bold uppercase tracking-widest">ID Reference</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-widest">Identity Object</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-widest text-center">Auth Role</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && users.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-600 animate-pulse">Scanning clusters...</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-purple-500/[0.05] transition-colors group">
                                    <td className="px-6 py-4 text-purple-900 group-hover:text-purple-700 transition-colors font-mono">{user.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-300 font-bold">{user.name || 'ANON_OBJECT'}</span>
                                            <span className="text-gray-600 italic">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded border text-[10px] inline-flex items-center gap-1",
                                            user.role === 'ADMIN' ? "border-red-500/30 text-red-500" :
                                                user.role === 'DEVELOPER' ? "border-purple-500/30 text-purple-500" :
                                                    "border-gray-500/30 text-gray-500"
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(user)} className="p-1.5 text-gray-400 hover:text-purple-400 transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-purple-500/30 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                        <header className="p-6 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <UserIcon size={20} className="text-purple-400" />
                                    OVERRIDE_IDENTITY
                                </h2>
                                <p className="text-[10px] text-gray-500 font-mono mt-1">NODE_ID: {editingUser.id}</p>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-white/5 rounded-full">
                                <X size={20} />
                            </button>
                        </header>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.name || ""}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:border-purple-500/50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email Reference</label>
                                <input
                                    type="email"
                                    value={editForm.email || ""}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:border-purple-500/50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Security Key (Password)</label>
                                <div className="relative">
                                    <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        type="text"
                                        value={editForm.password || ""}
                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 focus:border-purple-500/50"
                                        placeholder="Enter new password to override..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Auth Privilege Level</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:border-purple-500/50"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="DEVELOPER">DEVELOPER</option>
                                </select>
                            </div>
                        </div>

                        <footer className="p-6 border-t border-white/10 flex justify-end gap-3">
                            <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white text-xs uppercase font-bold">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-2.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-black text-xs font-bold uppercase rounded-lg flex items-center gap-2"
                            >
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                                Commit Node
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
