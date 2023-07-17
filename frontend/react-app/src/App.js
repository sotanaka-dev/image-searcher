import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Breadcrumbs from "./components/Breadcrumbs";
import Footer from "./components/Footer";
import MyPage from "./pages/MyPage";
import Search from "./pages/Search";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Breadcrumbs />

        <Routes>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
