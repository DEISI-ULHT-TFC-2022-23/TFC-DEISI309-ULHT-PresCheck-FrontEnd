import React from 'react';
import { Link } from "react-router-dom";
import logo from './assets/presscheck406x192.png';

function Navbar() {


  const sessionUsername = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('is_admin') === 'true' ? true : false;
  const profId = localStorage.getItem('professor_id') === 'null' ? null : localStorage.getItem('professor_id');

  function handleLogout() {
    localStorage.clear();
    Link.push('/'); // redireciona para a página de login
  }

  return (


    <nav className="navbar navbar-expand-lg p-0">
      <div className="container-fluid p-2">
        <Link className="navbar-brand d-none d-lg-block" to="/">

          <img key={Date.now()}
            className="navbar-brand"
            src={logo}
            alt="Logo"
            height="60px"
          />
          {/*<img className="navbar-brand" src="presscheck_406x192.png" alt="Logo" height="60" />*/}
        </Link>
        <div className="d-none d-lg-block">Olá <b>{sessionUsername}</b> </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <CustomLink className="nav-link" to="/" data-bs-dismiss="collapse">Início</CustomLink>
            {profId !== null ?
              <>
                <CustomLink className="nav-link" to="/aula" data-bs-dismiss="collapse">Aula</CustomLink>
                <CustomLink className="nav-link" to="/historico" data-bs-dismiss="collapse">Histórico</CustomLink>
              </>
              : null
            }

            {isAdmin ?
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  id="submenuDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Gestão
                </Link>
                <ul className="dropdown-menu" aria-labelledby="submenuDropdown">
                  <CustomLink className="dropdown-item" to="/gestao/utilizadores" data-bs-dismiss="collapse">
                    Utilizadores
                  </CustomLink>
                  <CustomLink className="dropdown-item" to="/gestao/alunos" data-bs-dismiss="collapse">
                    Alunos
                  </CustomLink>
                  <CustomLink className="dropdown-item" to="/gestao/turmas" data-bs-dismiss="collapse">
                    Turmas
                  </CustomLink>
                  <CustomLink className="dropdown-item" to="/gestao/unidades-curriculares" data-bs-dismiss="collapse">
                    Unidades curriculares
                  </CustomLink>
                  <CustomLink className="dropdown-item" to="/gestao/salas-aula" data-bs-dismiss="collapse">
                    Salas de aula
                  </CustomLink>
                  <CustomLink className="dropdown-item" to="/gestao/aulas" data-bs-dismiss="collapse">
                    Aulas
                  </CustomLink>
                </ul>
              </li>
              //<CustomLink className="nav-link" to="/Gestao" data-bs-dismiss="collapse">Gestão</CustomLink>
              : null}
            <Link to="/" className="nav-link logout d-lg-none" onClick={handleLogout}>Logout</Link>
          </ul>
        </div>
        <div className="d-flex">
          <Link to="/perfil" className="nav-link d-none d-lg-block me-2 text-decoration-underline">Ver perfil</Link>
          <Link to="/" className="nav-link logout d-none d-lg-block" onClick={handleLogout}>Logout</Link>
          <div className="d-flex">
            <Link to="/perfil" className="nav-link d-block d-lg-none me-2 text-decoration-underline">Ver perfil</Link>
            <div className="d-block d-lg-none" id="navbarNav" >Olá <b>{sessionUsername}</b> </div>
          </div>
        </div>
      </div>
    </nav>
  )
} export default Navbar;

function CustomLink({ to, children, ...props }) {

  return (
    <li>
      <Link to={to} {...props}>{children}</Link>
    </li>
  )

}

