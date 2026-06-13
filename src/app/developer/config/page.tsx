"use client";

import { Settings, Save, ShieldAlert } from "lucide-react";

export default function DeveloperConfig() {
    return (
        <div className="space-y-8 font-mono">
            <header>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Settings className="text-purple-400" />
                    Global Configuration
                </h1>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Low-level environment variables and system flags.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-black/40 border border-purple-500/20 rounded-xl p-8 space-y-6">
                    <h3 className="text-purple-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <ShieldAlert size={14} /> System Flags
                    </h3>
                    <div className="space-y-4">
                        <ConfigItem label="MAINTENANCE_MODE" value="FALSE" />
                        <ConfigItem label="USER_REGISTRATION" value="ENABLED" />
                        <ConfigItem label="DEBUG_OVERLAY" value="TRUE" />
                    </div>
                </div>

                <div className="bg-black/40 border border-purple-500/20 rounded-xl p-8 space-y-6">
                    <h3 className="text-purple-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        Environment Context
                    </h3>
                    <div className="space-y-4">
                        <ConfigItem label="NODE_ENV" value="development" />
                        <ConfigItem label="DB_PROVIDER" value="sqlite" />
                        <ConfigItem label="AUTH_STRATEGY" value="next-auth" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="px-6 py-2 bg-purple-500 text-black font-bold rounded-lg hover:bg-purple-600 transition-all text-xs uppercase tracking-widest flex items-center gap-2">
                    <Save size={16} /> Update System Config
                </button>
            </div>
        </div>
    );
}

function ConfigItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-gray-500 text-[11px]">{label}</span>
            <span className="text-gray-300 text-xs font-bold">{value}</span>
        </div>
    );
}
