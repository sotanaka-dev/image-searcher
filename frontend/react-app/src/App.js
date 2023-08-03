import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Breadcrumbs from "./components/Breadcrumbs";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import MyPage from "./pages/MyPage";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import AllFavorites from "./pages/AllFavorites";
import FolderFavorites from "./pages/FolderFavorites";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Header />
          <Breadcrumbs />

          <main className="container">
            <Routes>
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
              {/* <Route
                path="/favorites/folders/:id"
                element={
                  <PrivateRoute>
                    <FolderFavorites />
                  </PrivateRoute>
                }
              /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
