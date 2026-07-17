import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Listen from "./pages/Listen";
import Vent from "./pages/Vent";
import Calm from "./pages/Calm";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/listen" element={<Listen />} />
        <Route path="/vent" element={<Vent />} />
        <Route path="/calm" element={<Calm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;