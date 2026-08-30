import './App.css'

import {BrowserRouter , Routes , Route , Navigate } from "react-router-dom"
import useAuthStore from '../Store/authStore'

import AppLayout from '../Layouts/Applayout/Applayout'
import GuestLayout from '../Layouts/GuestLayout/GuestLayout'
import LandingPage from '../Pages/Landing/LandingPage'
import Home from '../Pages/Home/Home'
import Profile from '../Pages/Profile/Profile'
import Library from '../Pages/Library/Library'
import CreateStory from '../Pages/Story/YourStory'
import Stats from '../Pages/Stats/Stats'
import About from '../Pages/About/About'
import MembershipPage from '../Components/Ui/MembershipPage'
// import WriteStory from '../Pages/Write/WriteStory'
// import WriteStory from '../Pages/Write/WriteStory';
// import LexicalEditor from '../Pages/Write/LexicalEditor'
// import BlogWriteForm from '../Pages/Write/Lexical/BlogWriteForm'
import WriteBlogPage from '../Pages/Write/Lexical/WriteBlogPage'
import BlogAuthPage from '../Pages/Auth/BlogAuthPage'

function App() {

  // const { token } = useAuthStore();
  const token = useAuthStore((state) => state.token); 

  return ( 
    <>
    <BrowserRouter>
    <Routes>
      {/* Guest Routes */}

      <Route  element={ !token ? <GuestLayout /> : <Navigate to="/home" /> }>
      <Route path='/' element={<LandingPage />} />
      <Route path='/about' element={<About />} />
      <Route path='/membership' element={<MembershipPage />} />
      <Route path='/auth' element={<BlogAuthPage />} />
      </Route>

      {/* LoggedIn Routes */}

      <Route element={ token ? <AppLayout /> : <Navigate to="/auth?currentAction=login" /> } >
      <Route path='/home' element={<Home />} /> 
      <Route path='/profile' element={<Profile />} />
      <Route path='/library' element={<Library />} />
      <Route path='/yourstory' element={<CreateStory />} />
      <Route path='/stats' element={<Stats />} /> 
      {/* <Route path='/write' element={ <LexicalEditor />} /> */}
      <Route path='/write' element={ <WriteBlogPage />} />
      </Route>

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
