import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../Store/authStore";

import AppLayout from "../Layouts/Applayout/Applayout";
import GuestLayout from "../Layouts/GuestLayout/GuestLayout";
import LandingPage from "../Pages/Landing/LandingPage";
import Home from "../Pages/Home/Home";
import ProfilePage from "../Pages/Profile/ProfilePage";
import Library from "../Pages/Library/Library";
import Stories from "../Pages/Story/Stories";
import Stats from "../Pages/Stats/Stats";
import About from "../Pages/About/About";
import MembershipPage from "../Components/Ui/MembershipPage";
import WriteBlogPage from "../Pages/Write/Lexical/WriteBlogPage";
import BlogAuthPage from "../Pages/Auth/BlogAuthPage";
import BlogRead from "../Pages/Blog/BlogRead";
import SearchPage from "../Pages/Search/SearchPage";
import PublicOrAppLayout from "../Layouts/PublicOrAppLayout";

import { ToastProvider } from "../Components/Ui/AlertToast";

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Sirf-guest routes — logged-in hote hi /home pe bhej do */}
            <Route element={!token ? <GuestLayout /> : <Navigate to="/home" />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/auth" element={<BlogAuthPage />} />
            </Route>

            {/* Public-but-adaptive routes — guest bhi dekh sakta hai, login bhi dekh sakta hai, redirect kabhi nahi */}
            <Route element={<PublicOrAppLayout />}>
              <Route path="/search" element={<SearchPage />} />
              <Route path="/blog/:slug" element={<BlogRead />} />{" "}
            </Route>

            {/* Strictly-logged-in routes */}
            <Route
              element={
                token ? (
                  <AppLayout />
                ) : (
                  <Navigate to="/auth?currentAction=login" />
                )
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/yourstory" element={<Stories />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/write" element={<WriteBlogPage />} />
              <Route path="/write/:blogId" element={<WriteBlogPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </>
  );
}

export default App;
