import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Journal from "./pages/Journal";

import Header from "./components/Header";

import Home from "./pages/Home";
import Listen from "./pages/Listen";
import Vent from "./pages/Vent";
import Calm from "./pages/Calm";
import HelpButton from "./components/HelpButton";
import { getSessionAccount } from "./services/mockBackend";

function ProtectedRoute({ account, children }) {
  if (!account || account.role !== "user") {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [account, setAccount] = useState(() => getSessionAccount());

  useEffect(() => {
    const syncAccount = (event) => {
      const nextAccount = event?.detail ?? getSessionAccount();
      setAccount(nextAccount);
    };

    window.addEventListener("mindcare-account-updated", syncAccount);
    window.addEventListener("storage", syncAccount);

    return () => {
      window.removeEventListener("mindcare-account-updated", syncAccount);
      window.removeEventListener("storage", syncAccount);
    };
  }, []);

  return (
    <BrowserRouter>

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/journal"
            element={
              <ProtectedRoute account={account}>
                <Journal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listen"
            element={
              <ProtectedRoute account={account}>
                <Listen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vent"
            element={
              <ProtectedRoute account={account}>
                <Vent />
              </ProtectedRoute>
            }
          />
          <Route path="/calm" element={<Calm />} />
        </Routes>

      <HelpButton />
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Journal from "./pages/Journal";

import Header from "./components/Header";

import Home from "./pages/Home";
import Listen from "./pages/Listen";
import Vent from "./pages/Vent";
import Calm from "./pages/Calm";
import FunFacts from "./pages/FunFacts";

import Grounding from "./pages/Grounding";

function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/listen" element={<Listen />} />
        <Route path="/vent" element={<Vent />} />
        <Route path="/calm" element={<Calm />} />
        <Route path="/fun-facts" element={<FunFacts />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
