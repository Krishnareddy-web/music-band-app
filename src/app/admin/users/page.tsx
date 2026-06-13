"use client";

import { useState, useEffect } from "react";
import { Users, Edit2, Trash2, X, Check, Shield, User as UserIcon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    createdAt: string;
}

export default function AdminUsers() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalingOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = currentUser?.id ? "PATCH" : "POST";
        const url = currentUser?.id ? `/api/admin/users/${currentUser.id}` : "/api/admin/users";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentUser),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchUsers();
            }
        } catch (err) {
            console.error("Failed to save user", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (id === session?.user?.id) {
            alert("You cannot delete your own account.");
            return;
        }
        if (!confirm("Are you sure you want to delete this user? All their bookings will be removed.")) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    return (
        <div>
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-light tracking-tight capitalize flex items-center gap-3">
                        <Users className="text-[#d4af37]" />
                        User Database
                    </h1>
                    <p className="text-gray-400 mt-2 font-serif italic text-lg">
                        Managing the registered devotees and roles.
                    </p>
                </div>
            </header>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 uppercase tracking-tighter text-xs">
                            <th className="px-6 py-4 font-bold">Devotee</th>
                            <th className="px-6 py-4 font-bold text-center">Email</th>
                            {session?.user?.role === "DEVELOPER" && (
                                <th className="px-6 py-4 font-bold text-center">Password</th>
                            )}
                            <th className="px-6 py-4 font-bold text-center">Role</th>
                            <th className="px-6 py-4 font-bold text-center">Joined</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                                    <div className="animate-pulse">Consulting the registry...</div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center text-gray-500 font-serif italic text-lg">
                                    No devotees registered.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] group transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="font-medium group-hover:text-[#d4af37] transition-colors">{user.name || 'Anonymous'}</div>
                                        <div className="text-[10px] text-gray-500 font-mono overflow-hidden truncate max-w-[100px]">{user.id}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center text-gray-400">{user.email}</td>
                                    {session?.user?.role === "DEVELOPER" && (
                                        <td className="px-6 py-5 text-center font-mono text-xs text-[#d4af37]">
                                            {user.password || 'N/A'}
                                        </td>
                                    )}
                                    <td className="px-6 py-5 text-center">
                                        <span className={cn(
                                            "px-2 py-1 rounded text-[10px] uppercase font-bold tracking-tighter flex items-center justify-center gap-1 mx-auto w-fit",
                                            user.role === 'ADMIN' ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30" :
                                                user.role === 'DEVELOPER' ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-white/10 text-white"
                                        )}>
                                            {user.role === 'ADMIN' && <Shield size={10} />}
                                            {user.role === 'DEVELOPER' && <Settings size={10} />}
                                            {user.role === 'USER' && <UserIcon size={10} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setCurrentUser(user); setIsModalOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-[#d4af37] transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalingOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-2xl font-light tracking-tight text-[#d4af37]">
                                Edit User
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentUser?.name || ""}
                                        onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Email</label>
                                    <input
                                        type="email"
                                        required
                                        disabled={!!currentUser?.id}
                                        value={currentUser?.email || ""}
                                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Role</label>
                                    <select
                                        value={currentUser?.role || "USER"}
                                        onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="DEVELOPER">DEVELOPER</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Password (Hide from others)</label>
                                    <input
                                        type="text"
                                        value={currentUser?.password || ""}
                                        onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-all"
                                        placeholder="Leave empty to keep current"
                                    />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all text-sm uppercase tracking-widest flex items-center gap-2"
                                >
                                    <Check size={18} />
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
