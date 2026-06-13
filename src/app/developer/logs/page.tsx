"use client";

import { Terminal, AlertCircle } from "lucide-react";

export default function DeveloperLogs() {
    return (
        <div className="space-y-8 font-mono">
            <header>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Terminal className="text-purple-400" />
                    System Trace Logs
                </h1>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Real-time kernel output and application trace stream.</p>
            </header>

            <div className="bg-[#050505] border border-purple-500/20 rounded-xl p-6 h-[500px] overflow-y-auto space-y-2 text-[11px] shadow-2xl">
                <p className="text-gray-600">[2026-01-31 20:53:22] {">"} BOOT_SEQUENCE_COMPLETE</p>
                <p className="text-green-500">[2026-01-31 20:53:23] {">"} PRISMA_VERSION: 6.2.1</p>
                <p className="text-green-500">[2026-01-31 20:53:23] {">"} NEXT_JS_VERSION: 16.1.4</p>
                <p className="text-blue-500">[2026-01-31 20:55:10] {">"} AUTH_SESSION_VALIDATED: devotee@example.com</p>
                <p className="text-purple-500">[2026-01-31 21:02:45] {">"} DEV_PANEL_ACCESS: developer@ayyappa.com</p>
                <p className="text-gray-400 italic">... monitoring live stream ...</p>
                <div className="flex items-center gap-2 text-yellow-500 mt-4">
                    <AlertCircle size={14} />
                    <span>[WARN] Deprecated: middleware file convention is active.</span>
                </div>
            </div>
        </div>
    );
}
