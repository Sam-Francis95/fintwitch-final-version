import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import { ToastsProvider } from "./context/ToastContext";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{color:'#ff6b6b',padding:'2rem',fontFamily:'monospace',background:'#0a0014',minHeight:'100vh'}}>
          <h2>⚠️ App crashed — check this error:</h2>
          <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-all'}}>{this.state.error?.message}{'\n\n'}{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import { AnimatePresence, motion } from "framer-motion";


// Components
import Shell from "./components/Shell";
import ClickSpark from "./components/ClickSpark";
import GameStoreInitializer from "./components/GameStoreInitializer";

// Pages
import HomePage from "./pages/HomePage";
import GamesArea from "./pages/GamesArea";
import CareerLevelPage from "./pages/CareerLevelPage";
import DreamLifePlanner from "./pages/DreamLifePlanner";
import ToolsArea from "./pages/ToolsArea";
import ArticlesArea from "./pages/ArticlesArea";
import HabitTracker from "./pages/HabitTracker";
import TransactionsArea from "./pages/TransactionsArea";
import BudgetArea from "./pages/BudgetArea";
import PathwayDashboard from "./pages/PathwayDashboard";
import Login from "./pages/Login";
import ModeSelection from "./pages/ModeSelection";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useUser();

  // Only show spinner if we are strictly in a loading state with no user data
  if (isLoading && !user?.username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user?.username) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Wrapper for page transitions
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 1.05 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
    <ToastsProvider>
      <UserProvider>
        <GameStoreInitializer />
        <ClickSpark />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />

            {/* Protected Routes */}
            <Route
              path="/mode-selection"
              element={
                <ProtectedRoute>
                  <PageWrapper><ModeSelection /></PageWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Shell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/mode-selection" replace />} />
              <Route path="games" element={<PageWrapper><GamesArea /></PageWrapper>} />
              <Route path="games/career/:levelId" element={<PageWrapper><CareerLevelPage /></PageWrapper>} />
              <Route path="games/dreamlife" element={<PageWrapper><DreamLifePlanner /></PageWrapper>} />
              <Route path="tools" element={<PageWrapper><ToolsArea /></PageWrapper>} />
              <Route path="articles" element={<PageWrapper><ArticlesArea /></PageWrapper>} />
              <Route path="habit" element={<PageWrapper><HabitTracker /></PageWrapper>} />
              <Route path="transactions" element={<PageWrapper><TransactionsArea /></PageWrapper>} />
              <Route path="budget" element={<PageWrapper><BudgetArea /></PageWrapper>} />
              <Route path="pathway" element={<PageWrapper><PathwayDashboard /></PageWrapper>} />
            </Route>
          </Routes>
        </AnimatePresence>
      </UserProvider>
    </ToastsProvider>
    </ErrorBoundary>
  );
}
