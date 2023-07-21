import Navbar from "./Navbar";
import Footer from "./Footer";
import Aula from "./pages/Aula";
import Historico from "./pages/Historico";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import PaginaErro from "./pages/PaginaErro";
import GestaoAlunos from "./pages/Gestao/GestaoAlunos";
import GestaoUtilizadores from "./pages/Gestao/GestaoUtilizadores";
import GestaoUnidades from "./pages/Gestao/GestaoUnidades";
import GestaoSalas from "./pages/Gestao/GestaoSalas";
import GestaoAulas from "./pages/Gestao/GestaoAulas";
import GestaoTurmas from "./pages/Gestao/GestaoTurmas";
import Inicio from "./pages/Inicio";
import Perfil from "./pages/Perfil";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Route, Routes } from "react-router-dom"

function App() {

  const isAuthenticated = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('is_admin') === 'true' ? true : false;
  const profId = localStorage.getItem('professor_id') === 'null' ? null : localStorage.getItem('professor_id');

  return (
    <>
      <div className="container-principal">
        {isAuthenticated ? <Navbar /> : null}
        <div className="background-principal main-content">
          <div className="background-container">
            <Routes>
              <Route
                path="/"
                element={isAuthenticated ? <Inicio /> : <Login />}
              />

              <Route
                path="/login"
                element={isAuthenticated ? <Inicio /> : <Login />}
              />

              <Route
                path="/aula"
                element={isAuthenticated ? (profId !== null ? <Aula /> : <Inicio />) : <Login />}
              />

              <Route
                path="/historico"
                element={isAuthenticated ? <Historico /> : <Login />}
              />

              <Route
                path="/reset-password"
                element={<ResetPassword />}
              />

              <Route
                path="/gestao/utilizadores"
                element={isAuthenticated ? (isAdmin ? <GestaoUtilizadores /> : <Inicio />) : <Login />}
              />

              <Route
                path="/gestao/alunos"
                element={isAuthenticated ? (isAdmin ? <GestaoAlunos /> : <Inicio />) : <Login />}
              />

              <Route
                path="/gestao/turmas"
                element={isAuthenticated ? (isAdmin ? <GestaoTurmas /> : <Inicio />) : <Login />}
              />


              <Route
                path="/gestao/unidades-curriculares"
                element={isAuthenticated ? (isAdmin ? <GestaoUnidades /> : <Inicio />) : <Login />}
              />

              <Route
                path="/gestao/salas-aula"
                element={isAuthenticated ? (isAdmin ? <GestaoSalas /> : <Inicio />) : <Login />}
              />

              <Route
                path="/gestao/aulas"
                element={isAuthenticated ? (isAdmin ? <GestaoAulas /> : <Inicio />) : <Login />}
              />

              <Route
                path="/perfil"
                element={isAuthenticated ? <Perfil /> : <Login />}
              />

              <Route path="*" element={<PaginaErro />} />

            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );

}

export default App;
