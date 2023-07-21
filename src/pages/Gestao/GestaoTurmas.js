import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { urlApi } from '../../config';

const GestaoTurmas = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [turmas, setTurmas] = useState([]);
    const [turma, setTurma] = useState('');
    const [turmaConsultar, setTurmaConsultar] = useState('');
    const [turmaNomeAlterado, setTurmaNomeAlterado] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const turmasPorPagina = 10;
    const indiceUltimaTurma = paginaAtual * turmasPorPagina;
    const indicePrimeiraTurma = indiceUltimaTurma - turmasPorPagina;
    const filtroTurmas = turmas.filter(turma =>
        turma.nome.toLowerCase().includes(pesquisa.toLowerCase())
    ).slice(indicePrimeiraTurma, indiceUltimaTurma);


    function getTurmas() {
        setLoading(true);
        axios.get(`${urlApi}/admin/turmas`)
            .then(
                response => {
                    setTurmas(response.data.turmas);
                    setLoading(false);
                })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }

    function getTurmaById(id) {
        axios.get(`${urlApi}/admin/turmas/${id}`)
            .then(
                response => {
                    setTurmaConsultar(response.data);
                    setTurmaNomeAlterado(response.data.nome)
                })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }

    useEffect(() => {
        document.title = 'PresCheck - Gestão de Turmas';
        getTurmas();
    }, []);

    const criarTurma = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${urlApi}/admin/turmas/criar`, {
                nome: turma
            });
            if (response.status === 200) {
                getTurmas();
                clearDadosEdit();
            }
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }

    };

    const eliminarTurma = async (event) => {
        event.preventDefault();

        try {
            await axios.delete(`${urlApi}/admin/turmas/eliminar/${turmaConsultar.id}`);
            getTurmas();
            clearDadosEdit();
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }
    };

    const proximaPagina = () => {
        if (paginaAtual < Math.ceil(turmas.length / turmasPorPagina)) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const paginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    function abrirModal(turma) {
        getTurmaById(turma.id);
    };

    const alterarNome = async (id, event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`${urlApi}/admin/turmas/editar/${id}`, {
                nome: turmaNomeAlterado
            });
            if (response.status === 200) {
                getTurmas();
                getTurmaById(id);
                setMessage("Nome de turma alterado com sucesso.");
            }
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    function clearDadosEdit() {
        setTurma('');
        setTurmaConsultar('');
        setTurmaNomeAlterado('');
        setError('');
        setMessage('');
    };

    return (
        <>
            <div className="content-center">
                <div className="content">
                    <div className="p-4 content-box-form">
                        <form >
                            <fieldset>
                                <legend>Criar Turma</legend>
                                <div className="form-group text-left">
                                    <div className="mb-3">
                                        <label htmlFor="turma" className="mt-3 mb-1 me-3">Turma:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="sala"
                                            value={turma}
                                            placeholder="Ex.: LD01ENF01"
                                            onChange={(event) => setTurma(event.target.value)}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                            {message && <p>{message}</p>}
                            {error && <p>{error}</p>}
                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-success mt-3 mx-2" onClick={criarTurma} >Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {
                turmas.length > 0 ? (
                    //caixa de pesquisa
                    <div className="content pesquisa">
                        <label>Pesquisar turma:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={pesquisa}
                            placeholder="Ex.: LD01ENF01"
                            onChange={(event) => setPesquisa(event.target.value)}
                        />
                    </div>) : null
            }

            {
                //Tabela com as turmas
                <div className="content-center">
                    <div className="content">
                        {
                            loading ?
                                <div className="center">
                                    <div className="spinner-border" role="status">
                                        <div className="visually-hidden">Loading...</div>
                                    </div>
                                </div>
                                :
                                <>
                                    {turmas.length > 0 ? (
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '80%' }} className="align-middle">Turma</th>
                                                    <th style={{ width: '20%' }} className="text-center align-middle">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtroTurmas.map((turma, index) => (
                                                    <tr key={index}>
                                                        <td style={{ width: '80%' }} className="align-middle">{turma.nome}</td>
                                                        <td style={{ width: '20%' }} className="text-center align-middle">
                                                            <Link className="btn btn-primary btn-sm m-1" onClick={() => abrirModal(turma)} data-bs-toggle="modal" data-bs-target="#consultar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-eye-fill"></span></Link>
                                                            <Link className="btn btn-warning btn-sm m-1" onClick={() => abrirModal(turma)} data-bs-toggle="modal" data-bs-target="#editar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-pencil-fill"></span></Link>
                                                            <Link className="btn btn-danger btn-sm m-1" onClick={() => abrirModal(turma)} data-bs-toggle="modal" data-bs-target="#eliminar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-trash-fill"></span></Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <p>Não existem registos de turmas</p>
                                    }
                                </>

                        }
                    </div>
                </div>
            }

            {/*Botões para alterar páginas*/}
            {turmas.length > 0 ?
                <div className="content-center">
                    <button className="btn btn-primary active m-1" onClick={paginaAnterior} disabled={paginaAtual === 1}>
                        Página Anterior
                    </button>
                    <button className="btn btn-primary active m-1" onClick={proximaPagina} disabled={paginaAtual === Math.ceil(turmas.length / turmasPorPagina)}>
                        Próxima Página
                    </button>
                </div> : null}

            {/* Popup para consultar dados da turma */}
            <div className="modal" id="consultar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">{turmaConsultar?.nome}</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">

                            <p><b>Lista de professores: </b></p>
                            {
                                turmaConsultar?.professores?.length > 0 ?
                                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                        <table className="table table-striped">
                                            <tbody>
                                                {
                                                    turmaConsultar?.professores?.map((professor, index) => (
                                                        <tr key={index}>
                                                            <td>{professor}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div> :
                                    <p><i>Sem professores associados</i></p>
                            }
                            <hr />
                            <p><b>Lista de alunos: </b></p>
                            {
                                turmaConsultar?.alunos?.length > 0 ?
                                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                        <table className="table table-striped">
                                            <tbody>
                                                {
                                                    turmaConsultar?.alunos?.map((aluno, index) => (
                                                        <tr key={index}>
                                                            <td>{aluno}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div> :
                                    <p><i>Sem professores associados</i></p>

                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup para editar turma */}
            <div className="modal fade" id="editar">
                <div className="modal-dialog modal-md modal-dialog-centered" >
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Editar turma</h4>
                        </div>

                        <div className="modal-body">

                            <p><b>Nome:</b></p>

                            <input
                                className="form-control"
                                type="text"
                                id="nome-turma"
                                value={turmaNomeAlterado}
                                onChange={(event) => setTurmaNomeAlterado(event.target.value)}
                            />

                            {message && <p className="small">* {message}</p>}

                        </div>

                        <div className="modal-footer">

                            <button
                                className="btn btn-success"
                                type="button"
                                disabled={turmaNomeAlterado === turmaConsultar.nome}
                                onClick={(event) => alterarNome(turmaConsultar.id, event)} >
                                Confirmar alterações
                            </button>

                            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearDadosEdit}>
                                Fechar
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Popup com a confirmação para eliminar turma */}
            <div className="modal" id="eliminar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Eliminar Turma</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">

                            <p>Tem a certeza que deseja eliminar a turma <b>{turmaConsultar?.nome}</b>?</p>

                        </div>

                        <div className="modal-footer">

                            <button className="btn btn-danger m-1" onClick={eliminarTurma} data-bs-dismiss="modal">
                                Sim, eliminar
                            </button>
                            <button className="btn btn-secondary m-1" data-bs-dismiss="modal">
                                Não, manter
                            </button>

                        </div>
                    </div>
                </div>
            </div>

        </>

    )


};

export default GestaoTurmas;