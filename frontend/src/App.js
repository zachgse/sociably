import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./css/style.css";
//utils
import Layout from "./components/Layout";
import RequireAuth from './utils/RequireAuth';
import RequireGuest from './utils/RequireGuest';
import { ModalProvider } from './utils/ModalContext';
//pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
              <RequireAuth>
                <Layout/>
              </RequireAuth>
            }>
            {/* <ModalProvider> */}
              <Route index element={<Home/>}/>
            {/* </ModalProvider> */}
            <Route path="about" element={<About/>}/>
          </Route>
          {/*  */}
          <Route path="login" element={
            <RequireGuest>
              <Login/>
            </RequireGuest>
          }/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
