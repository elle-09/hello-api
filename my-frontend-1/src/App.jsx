import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Item from "./Item";
import LoginPage from "./Login";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="item" element={<Item />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  );
}