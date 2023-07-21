import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import "chart.js/auto";
import {urlApi, arduinoRegisto}  from '../../config';


const GestaoAlunos = () => {

    const [dispositivoId, setDispositivoId] = useState('')
    const [aguardaResposta, setAguardaResposta] = useState(false)
    const [user, setUser] = useState('');
    const [utilizadores, setUtilizadores] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const utilizadoresPorPagina = 10;
    const indiceUltimoUtilizador = paginaAtual * utilizadoresPorPagina;
    const indicePrimeiroUtilizador = indiceUltimoUtilizador - utilizadoresPorPagina;
    const [pesquisa, setPesquisa] = useState('');
    const filtroUtilizadores = utilizadores.filter(utilizador =>
        utilizador.numero.toString().includes(pesquisa.toLowerCase())
    ).slice(indicePrimeiroUtilizador, indiceUltimoUtilizador);

    const [alunoConsultar, setAlunoConsultar] = useState(null);

    const [error, setError] = useState('');
    const [removerText, setRemoverText] = useState('');
    const [showConfirmDelete, setConfirmDelete] = useState(false);
    const [msgDelete, setMsgDelete] = useState('');
    const [showAddDisp, setShowAddDisp] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTermTurma, setSearchTermTurma] = useState('');
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);

    function getAlunos() {
         
        axios.get(`${urlApi}/admin/alunos`)
            .then(
                response => {
                    setUtilizadores(response.data.alunos);
                    console.log(response.data);
                    
                })
            .catch(error => {
                console.error(error);
                
            });
    }

    useEffect(() => {
        document.title = 'PresCheck - Gestão de Alunos';
        getAlunos();
        
        axios.get(`${urlApi}/admin/turmas`)
            .then(
                response => {
                    setTurmas(response.data.turmas);
                    
                    clearDadosEdit();
                })
            .catch(error => {
                console.error(error);
                
            });
    },[]);

    const filteredTurmas = turmas.length > 0 ? turmas.filter(turma =>
        turma.nome.toLowerCase().includes(searchTermTurma.toLowerCase())
    ) : null;

    const showAddDispositivo = () => {
        setShowAddDisp(true);
        setConfirmDelete(false);

    }

    const showRemoverInput = (dispositivoUid) => {
        setConfirmDelete(true);
        setShowAddDisp(false);
        setDispositivoId(dispositivoUid)
    }

    const registarUtilizador = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.put(`${urlApi}/admin/alunos/criar`, {
                numero: user,
                dispositivo: dispositivoId === "" ? null : dispositivoId,
                turma: turmaSelecionada
            });
            setDispositivoId("");
            if (response.status === 200) {
                axios.get(`${urlApi}/admin/alunos`)
                    .then(
                        response => {
                            setUtilizadores(response.data.alunos);
                            console.log(response.data);
                            
                        })
                    .catch(error => {
                        console.error(error);
                        
                    });
                clearDadosEdit();
                setMessage('Aluno registado com sucesso!');
            }
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }

    };

    // Ativa o leitor de dispositivos
    const ativarLeitorDispositivo = async (event) => {
        event.preventDefault();

        setAguardaResposta(true);

        try {
            setMessage('Passe o cartão no leitor...');
            const response = await axios.post(`${urlApi}/admin/alunos/associar`, {
                sala: arduinoRegisto
            });
            setDispositivoId(response.data.uid);

            // Abrir em nova janela
            /*const width = 500; // Largura da janela em pixels
            const height = 300; // Altura da janela em pixels
            const left = (window.innerWidth - width) / 2; // Posição horizontal da janela
            const top = (window.innerHeight - height) / 2; // Posição vertical da janela
            const features = `width=${width},height=${height},left=${left},top=${top},resizable=no,toolbar=no,location=no`;

            const url = `${urlApi}/gestao/alunos`;

            window.open(url, "_blank", features);*/

            setAguardaResposta(false);
        } catch (error) {
            setMessage('');
            setError(error.response.data.error);
            console.log(error.response.data.message);
            setAguardaResposta(false);
        }
        setMessage('');
        console.log(aguardaResposta);
    };

    // Adiciona dispositivo
    const adicionaDispositivo = async (aluno, dispositivoId, event) => {
        event.preventDefault();
        try {
            await axios.put(`${urlApi}/admin/dispositivo/criar`, {
                aluno_id: aluno,
                dispositivo: dispositivoId
            });
            setDispositivoId("");

            getAlunos();

            axios.get(`${urlApi}/admin/alunos/${aluno}`)
                .then(
                    response => {
                        setAlunoConsultar(response.data);
                        console.log(alunoConsultar)
                    })
                .catch(error => {
                    console.error(error);
                    
                });

        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }
    };

    const removeDispositivo = async (aluno_id, event) => {
        event.preventDefault();

        if (removerText === `${aluno_id}`) {
            try {
                await axios.delete(`${urlApi}/admin/dispositivo/eliminar/${aluno_id}/${dispositivoId}`);
                setDispositivoId("");
                setRemoverText('');
                setConfirmDelete(false);
                setMsgDelete("Dispositivo removido com sucesso.");
                
                getAlunos();
                
                axios.get(`${urlApi}/admin/alunos/${aluno_id}`)
                    .then(
                        response => {
                            setAlunoConsultar(response.data);
                            console.log(alunoConsultar)
                        })
                    .catch(error => {
                        console.error(error);
                        
                    });

            } catch (error) {
                setError(error.response.data.error);
                console.log(error.response.data.message);
            }
        } else {
            setRemoverText('');
            setMsgDelete("O texto não coincide.");
        }


    };

    const eliminarAluno = async (event) => {
        event.preventDefault();

        try {
            await axios.delete(`${urlApi}/admin/alunos/eliminar/${alunoConsultar.aluno}`);
            axios.get(`${urlApi}/admin/alunos`)
                .then(
                    response => {
                        setUtilizadores(response.data.alunos);
                        console.log(response.data);
                        
                    })
                .catch(error => {
                    console.error(error);
                    
                });
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }
    };

    const proximaPagina = () => {
        if (paginaAtual < Math.ceil(utilizadores.length / utilizadoresPorPagina)) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const paginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    function abrirModal(aluno) {
        axios.get(`${urlApi}/admin/alunos/${aluno.numero}`)
            .then(
                response => {
                    setAlunoConsultar(response.data);
                })
            .catch(error => {
                console.error(error);
                
            });
    };

    const handleSearchTurmaChange = (event) => {
        setSearchTermTurma(event.target.value);
    };

    const handleRadioTurmaChange = (event) => {
        const opcaoId = Number(event.target.value);
        setTurmaSelecionada(opcaoId);
    };

    function clearDadosEdit() {
        setUser('');
        setDispositivoId('');
        setTurmaSelecionada(null);
        setRemoverText('');
        setMsgDelete('');
        setConfirmDelete(false);
        setShowAddDisp(false);
        setError('');
        setMessage('');
    }

    return (
        <>
            <div className="content-center">
                <div className="content">
                    <div className="p-4 content-box-form">
                        <form >
                            <fieldset>
                                <legend>Registar Aluno</legend>
                                <div className="form-group text-left">
                                    <label htmlFor="user" className="mt-3 mb-1">Número de aluno:</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="user"
                                        value={user}
                                        placeholder="Ex.: 22000000"
                                        onChange={(event) => setUser(event.target.value)}
                                    />

                                    <label htmlFor="turmas" className="mt-3 mb-1">Turmas:</label>
                                    {filteredTurmas !== null ?
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Pesquisar"
                                            value={searchTermTurma}
                                            onChange={handleSearchTurmaChange}
                                        /> : null
                                    }

                                    <div className="option-list-container overflow-auto border" style={{ maxHeight: '100px', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
                                        <ul className="list-group">
                                            {filteredTurmas !== null ?
                                                filteredTurmas.map((turma) => (
                                                    <label key={turma.nome} htmlFor={`opcao-${turma.nome}`} className="form-check-label">
                                                        <li className="list-group-item">
                                                            <input
                                                                className="me-3"
                                                                type="radio"
                                                                id={`opcao-${turma.nome}`}
                                                                value={turma.id}
                                                                checked={turma.id === turmaSelecionada}
                                                                onChange={handleRadioTurmaChange}
                                                            />
                                                            {<span>{turma.nome}</span>}
                                                        </li>
                                                    </label>
                                                )) :
                                                <label>
                                                    <li className="list-group-item">
                                                        <span>Não existem turmas registadas na base de dados</span>
                                                    </li>
                                                </label>}
                                        </ul>
                                    </div>

                                    <div className="input-group mt-3 mb-3">
                                        <input type="text" className="form-control" placeholder="ID do dispositivo" aria-label="" value={dispositivoId} disabled />
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-primary" type="button" onClick={ativarLeitorDispositivo} style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} >Registar dispositivo</button>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            {message && <p>{message}</p>}
                            {error && <p>{error}</p>}
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-success mt-3 mx-2" onClick={registarUtilizador} >Registar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {
                utilizadores.length > 0 ? (
                    //caixa de pesquisa
                    <div className="content pesquisa">
                        <label>Pesquisar aluno:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={pesquisa}
                            placeholder="Ex.: 22000000"
                            onChange={(event) => setPesquisa(event.target.value)}
                        />
                    </div>) : null
            }

            {
                //Tabela com os utilizadores
                <div className="content-center">
                    <div className="content">
                        {utilizadores.length > 0 ? (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th className="align-middle">Número de aluno</th>
                                        <th className="align-middle text-center">Dispositivos associados</th>
                                        <th className="align-middle text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtroUtilizadores.map((user, index) => (
                                        <tr key={index}>
                                            <td className="align-middle">{user.numero}</td>
                                            <td className="align-middle text-center">{user.dispositivos}</td>
                                            <td className="align-middle text-center">
                                                <Link className="btn btn-primary btn-sm m-1" onClick={() => abrirModal(user)} data-bs-toggle="modal" data-bs-target="#consultar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-eye-fill"></span></Link>
                                                <Link className="btn btn-warning btn-sm m-1" onClick={() => abrirModal(user)} data-bs-toggle="modal" data-bs-target="#editar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-pencil-fill"></span></Link>
                                                <Link className="btn btn-danger btn-sm m-1" onClick={() => abrirModal(user)} data-bs-toggle="modal" data-bs-target="#eliminar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-trash-fill"></span></Link>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p>Não existem registos de alunos</p>}
                    </div>
                </div>
            }

            {/*Botões para alterar páginas*/}
            {utilizadores.length > 0 ?
                <div className="content-center">
                    <button className="btn btn-primary active m-1" onClick={paginaAnterior} disabled={paginaAtual === 1}>
                        Página Anterior
                    </button>
                    <button className="btn btn-primary active m-1" onClick={proximaPagina} disabled={paginaAtual === Math.ceil(utilizadores.length / utilizadoresPorPagina)}>
                        Próxima Página
                    </button>
                </div> : null}

            {/* Popup para consultar dados do aluno */}
            <div className="modal" id="consultar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Consultar aluno</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">

                            <p><b>Número de aluno: </b>{alunoConsultar?.aluno}</p>
                            <p><b>Dispositivos: </b></p>

                            {
                                alunoConsultar?.dispositivos.length > 0 ?

                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>UID</th>
                                                <th>Data de associação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                alunoConsultar?.dispositivos.map((dispositivo, index) => (
                                                    <tr key={index}>
                                                        <td className="text-wrap" style={{ wordBreak: 'break-all' }} >{dispositivo.uid}</td>
                                                        <td>{dispositivo.associado_em}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table> :
                                    <p><i>Sem dispositivos</i></p>
                            }
                            <p><b>Últimas presenças: </b></p>

                            {
                                alunoConsultar?.ultimas_presencas.length > 0 ?

                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Unidade Curricular</th>
                                                <th>Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                alunoConsultar?.ultimas_presencas.map((presenca, index) => (
                                                    <tr key={index}>
                                                        <td>{presenca.unidade}</td>
                                                        <td>{presenca.presenca}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table> :
                                    <p><i>Sem presenças</i></p>
                            }

                        </div>
                    </div>
                </div>
            </div>

            {/* Popup com a confirmação para eliminar aluno */}
            <div className="modal" id="eliminar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Eliminar aluno</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">

                            <p>Tem a certeza que deseja eliminar o aluno <b>{alunoConsultar?.aluno}</b> ?</p>

                        </div>

                        <div className="modal-footer">

                            <button className="btn btn-danger active m-1" onClick={eliminarAluno} data-bs-dismiss="modal">
                                Sim, eliminar
                            </button>
                            <button className="btn btn-secondary active m-1" data-bs-dismiss="modal">
                                Não, manter
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Popup com informação a aguardar dispositivo */}
            {aguardaResposta && (
                <div className="modal" id="associarDispositivo" data-bs-backdrop="static">
                    <div className="modal-dialog modal-md modal-dialog-centered" >
                        <div className="modal-content">

                            <div className="modal-header">
                                <h4 className="modal-title">Associar dispositivo</h4>
                            </div>

                            <div className="modal-body">

                                <p>A aguardar leitura do dispositivo...</p>

                            </div>

                            <div className="modal-footer">

                                <button className="btn btn-secondary active m-1" data-bs-dismiss="modal">
                                    Cancelar
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup para editar aluno */}
            <div className="modal fade" id="editar">
                <div className="modal-dialog modal-md modal-dialog-centered" >
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Editar aluno: {alunoConsultar?.aluno}</h4>
                        </div>

                        <div className="modal-body">

                            <p><b>Dispositivos: </b></p>

                            {
                                alunoConsultar?.dispositivos.length > 0 ?

                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>UID</th>
                                                <th>Data de associação</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                alunoConsultar?.dispositivos.map((dispositivo, index) => (
                                                    <tr key={index}>
                                                        <td className="text-wrap" style={{ wordBreak: 'break-all' }} >{dispositivo.uid}</td>
                                                        <td>{dispositivo.associado_em}</td>
                                                        <td>
                                                            <Link className="btn btn-danger btn-sm active m-1" onClick={() => showRemoverInput(dispositivo.uid)} role="button" aria-pressed="true" alt="Ver detalhes">
                                                                <span className="bi bi-trash-fill"></span>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table> :
                                    <p><i>Sem dispositivos</i></p>
                            }

                            {!showAddDisp ?
                                <button className="btn btn-success" type="button" onClick={showAddDispositivo} >Adicionar Dispositivo</button>
                                :
                                <div>
                                    <p>Adicionar dispositivo:</p>
                                    <div className="input-group mt-3 mb-3">
                                        <input type="text" className="form-control" placeholder="ID do dispositivo" aria-label="" value={dispositivoId} disabled />
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-primary buttonInsertDispotivo" type="button" onClick={ativarLeitorDispositivo} style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}>Ativar Leitor</button>
                                        </div>
                                    </div>
                                    {message && <p>{message}</p>}
                                    {error && <p>{error}</p>}
                                </div>
                            }

                            {showConfirmDelete && (
                                <div className="bg-light rounded text-center p-3 m-3 shadow">
                                    <p>Escreva na caixa de texto o número do aluno para confirmar a remoção:</p>
                                    <input type="text" className="form-control" placeholder="" aria-label="" onChange={(event) => setRemoverText(event.target.value)} />
                                </div>
                            )}

                            {msgDelete && (
                                <p>{msgDelete}</p>
                            )}

                        </div>

                        <div className="modal-footer">
                            {!showConfirmDelete ?
                                <button className="btn btn-success" type="button" disabled={dispositivoId === ""} onClick={(event) => adicionaDispositivo(alunoConsultar?.aluno, dispositivoId, event)} >Confirmar</button>
                                :
                                <button className="btn btn-danger" type="button" disabled={removerText === ""} onClick={(event) => removeDispositivo(alunoConsultar?.aluno, event)} >Remover</button>
                            }


                            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearDadosEdit}>
                                Cancelar
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Popup de confirmação de registo */}
            <div className="modal fade" id="confirmacao-registo">
                <div className="modal-dialog modal-md modal-dialog-centered" >
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Aluno registado</h4>
                        </div>

                        <div className="modal-body">
                            {message && <p>{message}</p>}
                            {error && <p>{error}</p>}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearDadosEdit}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )


};

export default GestaoAlunos;