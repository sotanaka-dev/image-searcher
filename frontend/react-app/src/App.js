import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import MyPage from "./pages/MyPage";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import AllFavorites from "./pages/AllFavorites";
import FolderFavorites from "./pages/FolderFavorites";
import NotFound from "./pages/NotFound";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Header />
          <ToastContainer autoClose={5000} transition={Slide} />

          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/users" element={<SignUp />} />
              <Route path="/users/signin" element={<SignIn />} />
              <Route
                path="/mypage"
                element={
                  <PrivateRoute>
                    <MyPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <PrivateRoute>
                    <Search />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites/all"
                element={
                  <PrivateRoute>
                    <AllFavorites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites/folders/:id"
                element={
                  <PrivateRoute>
                    <FolderFavorites />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
