import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { urlApi } from '../config';
import logo from '../assets/presscheck406x192.png';

export default function ResetPassword() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [campoVisivel, setCampoVisivel] = useState(false);
    //const [buttonName, setButtonName] = useState('Enviar Email');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        document.title = 'PresCheck - Reset Password';
      }, []);

    function handleSubmit(option) {
        return async (event) => {
            event.preventDefault();
            if (option === 1) {
                try {

                    await axios.post(`${urlApi}/recuperar`, {
                        username: username,
                    });

                    setCampoVisivel(true);
                    //changeButtonName();
                } catch (error) {
                    setError(error.response.data.error);
                    console.log(error.response.data.message);
                }
            } else if (option === 2) {
                console.log("testERRO")
                if (password === passwordConfirm) {
                    console.log("Entra")
                    try {

                        await axios.post(`${urlApi}/recuperar/alterar`, {
                            username: username,
                            password: password,
                            token: token
                        });

                        window.location.href = '/Login';

                    } catch (error) {
                        setError(error.response.data.error);
                        console.log(error.response.data.message);
                    }
                } else {

                    setErrorMessage('ERRO: As passwords são diferentes');
                }
            }

        }
    };

    /*const changeButtonName = () => {

        if (campoVisivel === false) {
            setButtonName('Reset Password');
        }
    };*/


    // Token
    const [token, setToken] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const handleInputChange = (event, index) => {
        const { value } = event.target;

        if (/^\d*$/.test(value)) {
            const newToken = [...token];
            newToken[index] = value;
            setToken(newToken);
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasteData = event.clipboardData.getData("text/plain");
        const pasteValues = pasteData.split("");
    
        const newToken = [...token];
        pasteValues.forEach((value, index) => {
          if (index < newToken.length) {
            newToken[index] = value;
          }
        });
    
        setToken(newToken);
      };


    return (
        <>
            <div className="container-login">
                <div className="p-4">
                    <div className="logo">
                        <img src={logo} alt="PressCheck ULHT" />
                    </div>
                    <form >
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
                        {campoVisivel &&
                            <div className="form-group text-left">
                                {/*<label htmlFor="usernameToken" className="mt-2 mb-1">User Token:</label>
                                <input
                                    className="form-control"
                                    type="usernameToken"
                                    id="usernameToken"
                                    placeholder="Digite o codigo que recebeu no seu email"
                                    value={usernameToken}
                                    onChange={(event) => setUsernameToken(event.target.value)}
                        />*/}
                                <label htmlFor="usernameToken" className="mt-2 mb-1">Inserir token:</label>
                                <div className="d-flex justify-content-between">
                                    {token.map((value, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={1}
                                            value={value}
                                            className="me-2 form-control"
                                            style={{ width: '50px', height: '50px', textAlign: 'center', fontSize: '22px' }}
                                            onChange={(event) => handleInputChange(event, index)}
                                            onPaste={handlePaste}
                                            ref={(ref) => (inputRefs.current[index] = ref)}
                                        />
                                    ))}
                                </div>
                                <span className="small d-block">* Confirme o token recebido no seu email</span>
                                <label htmlFor="password" className="mt-2 mb-1">Nova Senha:</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    id="password"
                                    placeholder="Digite a sua nova senha"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                <label htmlFor="passwordConfirm" className="mt-2 mb-1">Confirmar Senha:</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    id="passwordConfirm"
                                    placeholder="Confirme a nova senha"
                                    value={passwordConfirm}
                                    onChange={(event) => setPasswordConfirm(event.target.value)}
                                />
                                <button type='submit' onClick={handleSubmit(2)} className="btn btn-primary mt-3">Reset Password</button>
                                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                            </div>

                        }
                        { !campoVisivel ?
                        <button type='submit' onClick={handleSubmit(1)} className="btn btn-primary mt-3">Enviar Email</button>
                        : null
                        }
                        {error && <p>{error}</p>}

                    </form>

                </div>
            </div>

        </>


    )


}