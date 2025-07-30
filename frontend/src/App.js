import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./css/style.css";
//utils
import Layout from "./components/Layout";
import RequireAuth from './utils/RequireAuth';
import RequireGuest from './utils/RequireGuest';
//pages
import Home from "./pages/Home";
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
            <Route index element={<Home/>}/>
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
