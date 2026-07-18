import { BrowserRouter, Routes, Route } from "react-router-dom";
import Journal from "./pages/Journal";

import Header from "./components/Header";

import Home from "./pages/Home";
import Listen from "./pages/Listen";
import Vent from "./pages/Vent";
import Calm from "./pages/Calm";
import FunFacts from "./pages/FunFacts";

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