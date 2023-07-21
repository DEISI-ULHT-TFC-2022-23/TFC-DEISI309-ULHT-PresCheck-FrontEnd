import { useEffect, useState } from "react"
import axios from 'axios';
import { urlApi } from '../config';


export default function Perfil() {

  const sessionUsername = localStorage.getItem('username');
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showAlterarPassword, setShowAlterarPassword] = useState(false);
  const [passwordAtual, setPasswordAtual] = useState('');
  const [passwordNova, setPasswordNova] = useState('');
  const [passwordNovaConfirm, setPasswordNovaConfirm] = useState('');

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
  });

  useEffect(() => {
    document.title = 'PresCheck - Perfil';
    axios.get(`${urlApi}/admin/utilizadores/${sessionUsername}`)
      .then(
        response => {
          setUser(response.data);
        })
      .catch(error => {
        console.error(error);
      });
  },[sessionUsername]);


  const showPasswordForm = async (event) => {
    clearDadosEdit();
    if(!showAlterarPassword) {
      setMessage('');
    }
    setShowAlterarPassword(!showAlterarPassword);
  }

  const handleAlterarPassword = async (event) => {
    event.preventDefault();



    if (passwordNova !== passwordNovaConfirm) {
      setError("A nova password não coincide.");
    } else {
      try {
        const response = await axios.post(`${urlApi}/conta/alterar-senha`, {
          username: sessionUsername,
          password: passwordAtual,
          new_password: passwordNova
        });
        setShowAlterarPassword(!showAlterarPassword);
        clearDadosEdit();
        setMessage(response.data.message);
      } catch (error) {
        setError(error.response.data.error);
        console.log(error.response.data.message);
      }
    }
  }

  function clearDadosEdit() {
    setPasswordAtual('');
    setPasswordNova('');
    setPasswordNovaConfirm('');
    setError('')
  }

  return (
    <>
      <div className="content-center">
        <div className="content">
          <div className="p-4 content-box-form">
            <div className="content-center">
              <div className="content d-flex flex-column">
                <h2 className="mb-5">Dados de utilizador</h2>
                <p><b>As tuas Unidades Curriculares Associadas: </b></p>
                {
                  user?.unidades?.length > 0 ?
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Unidade Curricular</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          user?.unidades.map((unidade, index) => (
                            <tr key={index}>
                              <td>{unidade.codigo}</td>
                              <td>{unidade.nome}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table> :
                    <p><i>Sem unidades associadas</i></p>
                }
              </div>
            </div>
            {
              !showAlterarPassword ?
                <button type="button" className="btn btn-primary mt-3 mx-2" onClick={showPasswordForm} >Alterar Password</button>
                :
                <form >
                  <fieldset>
                    <legend>Alterar Password:</legend>
                    <div className="form-group text-left">
                      <label htmlFor="user" className="mt-3 mb-1">Password atual:</label>
                      <input
                        className="form-control"
                        type="password"
                        id="password-atual"
                        value={passwordAtual}
                        placeholder=""
                        onChange={(event) => setPasswordAtual(event.target.value)}
                      />
                    </div>
                    <div className="form-group text-left">
                      <label htmlFor="user" className="mt-3 mb-1">Nova Password:</label>
                      <input
                        className="form-control"
                        type="password"
                        id="password-nova"
                        value={passwordNova}
                        placeholder=""
                        onChange={(event) => setPasswordNova(event.target.value)}
                      />
                    </div>
                    <div className="form-group text-left">
                      <label htmlFor="user" className="mt-3 mb-1">Confirmar Nova Password:</label>
                      <input
                        className="form-control"
                        type="password"
                        id="password-nova-confirm"
                        value={passwordNovaConfirm}
                        placeholder=""
                        onChange={(event) => setPasswordNovaConfirm(event.target.value)}
                      />
                    </div>
                  </fieldset>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-success mt-3 mx-2" onClick={handleAlterarPassword} >Confirmar</button>
                    <button type="button" className="btn btn-danger mt-3 mx-2" onClick={showPasswordForm} >Cancelar</button>
                  </div>
                </form>
            }
            <div className="content d-flex flex-column">
              {message && <p>{message}</p>}
              {error && <p>{error}</p>}
            </div>
          </div>
        </div>
      </div>


    </>


  )



}