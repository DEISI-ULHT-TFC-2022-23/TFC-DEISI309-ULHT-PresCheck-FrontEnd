import { useEffect, useState } from "react"
import axios from 'axios';
import { urlApi } from '../config';
import logo from '../assets/presscheck406x192.png';


export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'PresCheck - Login';
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${urlApi}/login`, {
        username: username,
        password: password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('professor_id', response.data.professor_id);
      localStorage.setItem('is_admin', response.data.is_admin);
      localStorage.setItem('username', username);
      window.location.href = '/';
    } catch (error) {
      setError(error.response.data.error);
      console.log(error.response.data.message);
    }
  };

  return (
    <>

      <div className="container-login d-flex flex-column">
        <div className="p-4">
          <div className="logo">
            <img
              className="navbar-brand"
              src={logo}
              alt="PressCheck ULHT"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group text-left">
              <label htmlFor="username" className="mt-3 mb-1">Nome do Utilizador:</label>
              <input
                className="form-control"
                type="text"
                id="username"
                value={username}
                placeholder="Número de professor"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="form-group text-left">
              <label htmlFor="password" className="mt-2 mb-1">Senha:</label>
              <input
                className="form-control"
                type="password"
                id="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <a htmlFor="password" href="./reset-password" className="mt-2 mb-1">Recuperar password</a>
            <button type="submit" className="btn btn-primary mt-3">Entrar</button>
          </form>
          
        </div>
        <div className="small text-danger" style={{maxWidth:'400px'}}>{error && <p>{error}</p>}</div>
      </div>

    </>


  )



}