import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import LeftNav from "./LeftNav";
import StockTicker from "./StockTicker";
import SchemesPanel from "./SchemesPanel";
import { useUser } from "../context/UserContext";

// ---------- Shell (Cosmic Layout) ----------
export default function Shell() {
    const location = useLocation();

    // Pages where the Right Sidebar (Schemes) should be hidden
    // /articles = Data Logs
    // /transactions = Treasury
    const hideRightPanel = ['/articles', '/transactions'].some(path => location.pathname.startsWith(path));

    return (
        <div className="relative min-h-screen text-slate-200 selection:bg-purple-500/30">

            {/* Header & Ticker */}
            <div className="relative z-20">
                <Header />
                <div className="pt-[80px]">
                    <StockTicker />
                </div>
            </div>

            {/* Main Layout Grid */}
            {/* REMOVED 'overflow-hidden' from here to fix sticky scroll issues */}
            <div className="relative z-10 flex w-full max-w-[1700px] mx-auto px-4 md:px-6 gap-6 pt-6">

                {/* LEFT SIDEBAR - 3D Floating Panel */}
                <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[100px] h-[calc(100vh-120px)] perspective-1000">
                    <div className="h-full">
                        <LeftNav />
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 w-full min-w-0 pb-10">
                    <Outlet />
                </main>

                {/* RIGHT SIDEBAR - 3D Glass Panel */}
                {/* Conditionally rendered based on current route */}
                {!hideRightPanel && (
                    <aside className="hidden xl:block w-[320px] shrink-0 sticky top-[100px] h-[calc(100vh-120px)] perspective-1000">
                        <div className="h-full card-glass overflow-hidden flex flex-col">
                            <SchemesPanel />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
