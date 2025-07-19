import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./css/style.css";
//layout
import Layout from "./components/Layout";
//pages
import Home from "./pages/Home";
import About from "./pages/About";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="about" element={<About/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
