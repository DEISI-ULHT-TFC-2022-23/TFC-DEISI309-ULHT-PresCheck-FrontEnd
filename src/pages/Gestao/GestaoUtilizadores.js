import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { urlApi } from '../../config';

const GestaoUtilizadores = () => {
    const [turmas, setTurmas] = useState([]);
    const [user, setUser] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProf, setIsProf] = useState(false);
    const [searchTermUnidade, setSearchTermUnidade] = useState('');
    const [searchTermTurma, setSearchTermTurma] = useState('');
    const [utilizadores, setUtilizadores] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const utilizadoresPorPagina = 10;
    const indiceUltimoUtilizador = paginaAtual * utilizadoresPorPagina;
    const indicePrimeiroUtilizador = indiceUltimoUtilizador - utilizadoresPorPagina;
    const [pesquisa, setPesquisa] = useState('');
    const [error, setError] = useState('');
    const [errorModal, setErrorModal] = useState('');
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
    const [turmasSelecionadas, setTurmasSelecionadas] = useState([]);
    const [showConfirmDelete, setConfirmDelete] = useState(false);
    const [removerText, setRemoverText] = useState('');
    const [message, setMessage] = useState('');
    const [messageModal, setMessageModal] = useState('');
    const [utilizadorConsultar, setUtilizadorConsultar] = useState('');
    const [unidadeId, setUnidadeId] = useState('');
    const [turmaId, setTurmaId] = useState('');
    const [adminAlterar, setAdminAlterar] = useState(false);
    const [activeAlterar, setActiveAlterar] = useState(false);
    const [options, setOptions] = useState([]);
    const [removerTurma, setRemoverTurma] = useState(false);
    const [removerUnidade, setRemoverUnidade] = useState(false);

    const filtroUtilizadores = utilizadores.length > 0 ? utilizadores.filter(utilizador =>
        utilizador.username.includes(pesquisa.toLowerCase())
    ).slice(indicePrimeiroUtilizador, indiceUltimoUtilizador) : null;

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

    function getUtilizadores() {
        axios.get(`${urlApi}/admin/utilizadores`)
            .then(
                response => {
                    setUtilizadores(response.data.utilizadores)
                })
            .catch(error => {
                console.error(error);
            });
    }

    function getUnidades() {
        axios.get(`${urlApi}/admin/unidades`)
            .then(
                response => {
                    setOptions(response.data.unidades)
                })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        document.title = 'PresCheck - Gestão de utilizadores';
        getUtilizadores();
        getUnidades();
        axios.get(`${urlApi}/admin/turmas`)
            .then(
                response => {
                    setTurmas(response.data.turmas);
                    setRemoverText('');
                    setConfirmDelete(false);
                    clearMessages();
                    setActiveAlterar(false);
                    setAdminAlterar(false);
                })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const filteredUnidades = options.length > 0 ? options.filter(option =>
        option.nome.toLowerCase().includes(searchTermUnidade.toLowerCase())
    ) : null;

    const filteredTurmas = turmas.length > 0 ? turmas.filter(turma =>
        turma.nome.toLowerCase().includes(searchTermTurma.toLowerCase())
    ) : null;

    const handleCheckboxChange = (event) => {
        const opcaoId = Number(event.target.value);
        const isChecked = event.target.checked;

        if (isChecked) {
            setOpcoesSelecionadas([...opcoesSelecionadas, opcaoId]);
        } else {
            setOpcoesSelecionadas(opcoesSelecionadas.filter((id) => id !== opcaoId));
        }
    };

    const handleCheckboxTurmaChange = (event) => {
        const opcaoId = Number(event.target.value);
        const isChecked = event.target.checked;

        if (isChecked) {
            setTurmasSelecionadas([...turmasSelecionadas, opcaoId]);
        } else {
            setTurmasSelecionadas(turmasSelecionadas.filter((id) => id !== opcaoId));
        }
    };

    //const unidadesOrdenadas = options.sort((a, b) => a.nome.localeCompare(b.nome));

    const registarUtilizador = async (event) => {
        event.preventDefault();
        clearMessages();
        console.groupCollapsed('Requisição PUT');
        try {
            const response = await axios.put(`${urlApi}/admin/utilizadores/criar`, {
                username: user,
                admin: isAdmin,
                professor: isProf,
                unidades: opcoesSelecionadas,
                turmas: turmasSelecionadas
            });
            if (response.status === 200) {
                axios.get(`${urlApi}/admin/utilizadores`)
                    .then(
                        response => {
                            setUtilizadores(response.data.utilizadores)
                        })
                    .catch(error => {
                        console.error(error);
                    });
                clearDadosEdit();
                setMessage('Utilizador registado com sucesso');
            }
        } catch (error) {
            setError(error.response.data.error);
        }
        console.groupEnd();
    };

    const handleSearchChange = (event) => {
        setSearchTermUnidade(event.target.value);
    };

    const handleSearchTurmaChange = (event) => {
        setSearchTermTurma(event.target.value);
    };

    const isAdminCheck = () => {
        setIsAdmin(!isAdmin);
    };

    const isProfCheck = () => {
        setIsProf(!isProf);
    };

    function clearDadosEdit() {
        setRemoverText('');
        setConfirmDelete(false);
        clearMessages();
        setActiveAlterar(false);
        setAdminAlterar(false);
    };

    function clearMessages() {
        setError('');
        setErrorModal('');
        setMessage('');
        setMessageModal('');
    };

    function abrirModal(username) {
        setConfirmDelete(false);
        axios.get(`${urlApi}/admin/utilizadores/${username}`)
            .then(
                response => {
                    setUtilizadorConsultar(response.data);
                    setActiveAlterar(response.data.is_active);
                    setAdminAlterar(response.data.is_admin);
                })
            .catch(error => {
                console.error(error);
            });
    };

    const showRemoverUnidade = (unidadeId) => {
        setConfirmDelete(true);
        setRemoverUnidade(true);
        setUnidadeId(unidadeId)
    };

    const showRemoverTurma = (turmaId) => {
        setConfirmDelete(true);
        setRemoverTurma(true);
        setTurmaId(turmaId)
    };

    const adicionarUnidade = async (username, unidadeId, event) => {
        clearMessages();
        try {
            await axios.post(`${urlApi}/admin/utilizadores/${username}/unidades/associar`, {
                unidades: [unidadeId]
            });
            setUnidadeId('');
            setRemoverText('');
            setConfirmDelete(false);
            setRemoverUnidade(false);
            setMessageModal("Unidade associada com sucesso.");

            axios.get(`${urlApi}/admin/utilizadores/${username}`)
                .then(
                    response => {
                        setUtilizadorConsultar(response.data);
                    })
                .catch(error => {
                    console.error(error);
                });

        } catch (error) {
            setErrorModal(error.response.data.error);
            console.log(error.response.data.message);
        }

    };

    const adicionarTurma = async (username, turmaId, event) => {
        clearMessages();
        try {
            await axios.post(`${urlApi}/admin/utilizadores/${username}/turmas/associar`, {
                turmas: [turmaId]
            });
            setTurmaId('');
            setRemoverText('');
            setConfirmDelete(false);
            setRemoverTurma(false);
            setMessageModal("Turma associada com sucesso.");

            axios.get(`${urlApi}/admin/utilizadores/${username}`)
                .then(
                    response => {
                        setUtilizadorConsultar(response.data);
                    })
                .catch(error => {
                    console.error(error);
                });

        } catch (error) {
            setErrorModal(error.response.data.error);
            console.log(error.response.data.message);
        }

    };

    const removeUnidade = async (username, unidadeId, event) => {
        event.preventDefault();
        clearMessages();
        if (removerText === `Eliminar`) {
            try {
                await axios.delete(`${urlApi}/admin/utilizadores/${username}/unidades/eliminar/${unidadeId}`);
                setUnidadeId('');
                setRemoverText('');
                setConfirmDelete(false);
                setRemoverUnidade(false);
                setMessageModal("Unidade removida com sucesso.");

                axios.get(`${urlApi}/admin/utilizadores/${username}`)
                    .then(
                        response => {
                            setUtilizadorConsultar(response.data);
                        })
                    .catch(error => {
                        console.error(error);
                    });

            } catch (error) {
                setErrorModal(error.response.data.error);
                console.log(error.response.data.message);
            }
        } else {
            setRemoverText('');
            setErrorModal("O texto não coincide.");
        }

    };

    const removeTurma = async (username, turmaId, event) => {
        event.preventDefault();
        clearMessages();
        if (removerText === `Eliminar`) {
            try {
                await axios.delete(`${urlApi}/admin/utilizadores/${username}/turmas/eliminar/${turmaId}`);
                setTurmaId('');
                setRemoverText('');
                setConfirmDelete(false);
                setRemoverTurma(false);
                setMessageModal("Turma removida com sucesso.");

                axios.get(`${urlApi}/admin/utilizadores/${username}`)
                    .then(
                        response => {
                            setUtilizadorConsultar(response.data);
                        })
                    .catch(error => {
                        console.error(error);
                    });

            } catch (error) {
                setErrorModal(error.response.data.error);
                console.log(error.response.data.message);
            }
        } else {
            setRemoverText('');
            setErrorModal("O texto não coincide.");
        }

    };

    const alterarEstado = async (username, isAdmin, isActive, event) => {
        event.preventDefault();
        clearMessages();
        try {
            const response = await axios.put(`${urlApi}/admin/utilizadores/editar/${username}`, {
                username: username,
                admin: isAdmin,
                active: isActive
            });
            if (response.status === 200) {
                axios.get(`${urlApi}/admin/utilizadores`)
                    .then(
                        response => {
                            setUtilizadores(response.data.utilizadores)
                        })
                    .catch(error => {
                        console.error(error);
                    });
                clearDadosEdit();
            }
        } catch (error) {
            setErrorModal(error.response.data.error);
        }
    };

    const handleCheckboxChangeAdmin = (event) => {
        setAdminAlterar(event.target.checked);
    };

    const handleCheckboxChangeActive = (event) => {
        setActiveAlterar(event.target.checked);
    };

    return (
        <>

            <div className="content-center">
                <div className="content">
                    <div className="p-4 content-box-form">
                        <form >
                            <fieldset>
                                <legend>Registar Professor</legend>
                                <div className="form-group text-left">
                                    <label htmlFor="user" className="mt-3 mb-1">Username:</label>
                                    <input
                                        pattern='[a-zA-Z]'
                                        className="form-control"
                                        type="text"
                                        id="user"
                                        value={user}
                                        placeholder="Ex.: p1234"
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
                                                                type="checkbox"
                                                                id={`opcao-${turma.nome}`}
                                                                value={turma.id}
                                                                checked={turmasSelecionadas.includes(turma.id)}
                                                                onChange={handleCheckboxTurmaChange}
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

                                    <label htmlFor="unidades" className="mt-3 mb-1">Unidades Curriculares:</label>
                                    {filteredUnidades !== null ?
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Pesquisar"
                                            value={searchTermUnidade}
                                            onChange={handleSearchChange}
                                        /> : null
                                    }

                                    <div className="option-list-container overflow-auto border" style={{ maxHeight: '100px', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
                                        <ul className="list-group">
                                            {filteredUnidades !== null ?
                                                filteredUnidades.map((opcao) => (
                                                    <label key={opcao.nome} htmlFor={`opcao-${opcao.nome}`} className="form-check-label">
                                                        <li className="list-group-item">
                                                            <input
                                                                className="me-3"
                                                                type="checkbox"
                                                                id={`opcao-${opcao.nome}`}
                                                                value={opcao.id}
                                                                checked={opcoesSelecionadas.includes(opcao.id)}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            {<span>{opcao.codigo} | {opcao.nome}</span>}
                                                        </li>
                                                    </label>
                                                )) : <label>
                                                    <li className="list-group-item">
                                                        <span>Não existem unidades curriculares registadas na base de dados</span>
                                                    </li>
                                                </label>}
                                        </ul>
                                    </div>
                                    {/*<p>Unidades Selecionadas : {opcoesSelecionadas.join(", ")}</p>*/}

                                    <div>
                                        <label htmlFor="isProf" className="mt-3 mb-1 me-2">Este utilizador é professor?</label>
                                        <input
                                            type="checkbox"
                                            id="isProf"
                                            value={isProf}
                                            checked={isProf}
                                            onChange={isProfCheck}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="isAdmin" className="mt-3 mb-1 me-2">Este utilizador tem previlégios de administrador?</label>
                                        <input
                                            type="checkbox"
                                            id="isAdmin"
                                            value={isAdmin}
                                            checked={isAdmin}
                                            onChange={isAdminCheck}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                            <div className="d-flex justify-content-between flex-column mt-3">
                                {error && <p style={{ fontSize: "0.9rem", color: "red" }}>{error}</p>}
                                <button type="submit" className="btn btn-success mx-2" onClick={registarUtilizador} data-bs-toggle="modal" data-bs-target="#confirmacao-registo">Registar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {
                utilizadores.length > 0 ? (
                    //caixa de pesquisa
                    <div className="content pesquisa">
                        <label>Pesquisar utilizador:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={pesquisa}
                            placeholder="Ex.: 1234"
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
                                        <th className="align-middle">Utilizador</th>
                                        <th className="align-middle text-center">Professor</th>
                                        <th className="align-middle text-center">Admin</th>
                                        <th className="align-middle text-center">Ativo</th>
                                        <th className="align-middle text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtroUtilizadores !== null ? filtroUtilizadores.map((user, index) => (
                                        <tr key={index}>
                                            <td className="align-middle">{user.username}</td>
                                            <td className="align-middle text-center">{user.is_professor ? <span className="bi bi-check-square-fill" style={{ color: "green", fontSize: "1.2rem" }}></span> : <span className="bi bi-x-square-fill" style={{ color: "red", fontSize: "1.2rem" }}></span>}</td>
                                            <td className="align-middle text-center">{user.is_admin ? <span className="bi bi-check-square-fill" style={{ color: "green", fontSize: "1.2rem" }}></span> : <span className="bi bi-x-square-fill" style={{ color: "red", fontSize: "1.2rem" }}></span>}</td>
                                            <td className="align-middle text-center">{user.is_active ? <span className="bi bi-check-square-fill" style={{ color: "green", fontSize: "1.2rem" }}></span> : <span className="bi bi-x-square-fill" style={{ color: "red", fontSize: "1.2rem" }}></span>}</td>
                                            <td className="align-middle text-center">
                                                <Link className="btn btn-primary btn-sm active m-1" onClick={() => abrirModal(user.username)} data-bs-toggle="modal" data-bs-target="#consultar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-eye-fill"></span></Link>
                                                <Link className="btn btn-warning btn-sm active m-1" onClick={() => abrirModal(user.username)} data-bs-toggle="modal" data-bs-target="#editar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-pencil-fill"></span></Link>
                                            </td>
                                        </tr>
                                    )) : null}
                                </tbody>
                            </table>
                        ) : <p>Não existem registos de utilizadores</p>}
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

            {/* Popup com os dados para consultar utilizador */}
            <div className="modal" id="consultar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Consultar utilizador</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">

                            <p><b>Nome de utilizador: </b>{utilizadorConsultar?.username}</p>
                            <p><b>Estado: </b>{utilizadorConsultar?.is_active ? <>Ativo</> : <>Inativo</>}</p>
                            <p><b>Permissões: </b>{utilizadorConsultar?.is_professor ? <>Professor</> : null} {utilizadorConsultar?.is_admin ? <>Administrador</> : null}</p>
                            {utilizadorConsultar?.is_professor ?
                                <>
                                    <p><b>Turmas: </b></p>
                                    {
                                        utilizadorConsultar?.turmas.length > 0 ?
                                            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '60%' }}>Turma</th>
                                                            <th style={{ width: '40%' }}>Número de alunos</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            utilizadorConsultar?.turmas.map((turma, index) => (
                                                                <tr key={index}>
                                                                    <td style={{ width: '60%' }}>{turma.nome}</td>
                                                                    <td style={{ width: '40%' }}>{turma.alunos.length}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div> :
                                            <p><i>Sem turmas associadas</i></p>
                                    }

                                    <p><b>Unidades Curriculares: </b></p>
                                    {
                                        utilizadorConsultar?.unidades.length > 0 ?
                                            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                <table className="table table-striped" style={{ maxHeight: '100px', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '60%' }}>Código</th>
                                                            <th style={{ width: '40%' }}>Unidade Curricular</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            utilizadorConsultar?.unidades.map((unidade, index) => (
                                                                <tr key={index}>
                                                                    <td style={{ width: '60%' }}>{unidade.codigo}</td>
                                                                    <td style={{ width: '40%' }}>{unidade.nome}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div> :
                                            <p><i>Sem unidades associadas</i></p>
                                    }
                                </>
                                : null}

                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearDadosEdit}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup para editar utilizador */}
            <div className="modal fade" id="editar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content" style={{ overflowY: 'auto' }}>

                        <div className="modal-header">
                            <h4 className="modal-title">Editar utilizador: { }</h4>
                        </div>

                        <div className="modal-body">

                            <p><b>Nome de utilizador: </b>{utilizadorConsultar?.username}</p>

                            <div>
                                <label>
                                    <input
                                        className="me-2"
                                        type="checkbox"
                                        checked={adminAlterar}
                                        onChange={handleCheckboxChangeAdmin}
                                    />
                                    Administrador
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        className="me-2"
                                        type="checkbox"
                                        checked={activeAlterar}
                                        onChange={handleCheckboxChangeActive}
                                    />
                                    Utilizador ativo
                                </label>
                            </div>

                            <label htmlFor="turmas" className="mt-3 mb-1">Adicionar Turmas:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar"
                                value={searchTermTurma}
                                onChange={handleSearchTurmaChange}
                            />

                            <div className="option-list-container overflow-auto border" style={{ maxHeight: '100px', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
                                <ul className="list-group">
                                    {filteredTurmas !== null ?
                                        filteredTurmas.map((opcao) => (
                                            <li key={opcao.id} className="list-group-item">
                                                <span>
                                                    <Link className="btn btn-success btn-sm active me-2" onClick={() => adicionarTurma(utilizadorConsultar.username, opcao.id)} role="button" aria-pressed="true" alt="Ver detalhes">
                                                        <span className="bi bi-plus"></span>
                                                    </Link>
                                                    {opcao.nome}
                                                </span>
                                            </li>

                                        )) : null}
                                </ul>
                            </div>


                            <div className="pt-3"><b>Turmas associadas: </b></div>

                            {
                                utilizadorConsultar.turmas?.length > 0 ?
                                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '80%' }}>Turma</th>
                                                    <th style={{ width: '20%' }}>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    utilizadorConsultar.turmas.map((turma, index) => (
                                                        <tr key={index}>
                                                            <td className="text-wrap align-middle" style={{ wordBreak: 'break-all', width: '80%' }} >{turma.nome}</td>
                                                            <td className="align-middle" style={{ width: '20%' }}>
                                                                <Link className="btn btn-danger btn-sm active m-1" onClick={() => showRemoverTurma(turma.id)} role="button" aria-pressed="true" alt="Ver detalhes">
                                                                    <span className="bi bi-trash-fill"></span>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div> :
                                    <p><i>Sem turmas associadas</i></p>
                            }

                            <label htmlFor="unidades" className="mt-3 mb-1">Adicionar Unidades Curriculares:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar"
                                value={searchTermUnidade}
                                onChange={handleSearchChange}
                            />

                            <div className="option-list-container overflow-auto border" style={{ maxHeight: '100px', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
                                <ul className="list-group">
                                    {filteredUnidades !== null ?
                                        filteredUnidades.map((opcao) => (
                                            <li key={opcao.id} className="list-group-item">
                                                <span>
                                                    <Link className="btn btn-success btn-sm active me-2" onClick={() => adicionarUnidade(utilizadorConsultar.username, opcao.id)} role="button" aria-pressed="true" alt="Ver detalhes">
                                                        <span className="bi bi-plus"></span>
                                                    </Link>
                                                    {opcao.codigo} | {opcao.nome}
                                                </span>
                                            </li>

                                        )) : null}
                                </ul>
                            </div>


                            <div className="pt-3"><b>Unidades Curriculares associadas: </b></div>

                            {
                                utilizadorConsultar.unidades?.length > 0 ?
                                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '80%' }}>Unidade</th>
                                                    <th style={{ width: '20%' }}>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    utilizadorConsultar.unidades.map((unidade, index) => (
                                                        <tr key={index}>
                                                            <td className="text-wrap align-middle" style={{ wordBreak: 'break-all', width: '80%' }} >{unidade.nome}</td>
                                                            <td className="align-middle" style={{ width: '20%' }}>
                                                                <Link className="btn btn-danger btn-sm active m-1" onClick={() => showRemoverUnidade(unidade.id)} role="button" aria-pressed="true" alt="Ver detalhes">
                                                                    <span className="bi bi-trash-fill"></span>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div> :
                                    <p><i>Sem unidades associadas</i></p>
                            }

                            {showConfirmDelete && (
                                <div className="bg-light rounded text-center p-3 m-3 shadow">
                                    <p>Escreva na caixa de texto "Eliminar" para confirmar a remoção:</p>
                                    <input type="text" className="form-control" placeholder="" aria-label="" onChange={(event) => setRemoverText(event.target.value)} />
                                </div>
                            )}

                            {messageModal && (
                                <p className="small">* {messageModal}</p>
                            )}
                            {errorModal && (
                                <p className="small text-danger">* {errorModal}</p>
                            )}

                        </div>

                        <div className="modal-footer">

                            {!showConfirmDelete ?
                                <button className="btn btn-success" type="button" data-bs-dismiss="modal" disabled={adminAlterar === utilizadorConsultar?.is_admin && activeAlterar === utilizadorConsultar?.is_active} onClick={(event) => alterarEstado(utilizadorConsultar?.username, adminAlterar, activeAlterar, event)} >Confirmar alterações</button>
                                :
                                removerUnidade ?
                                    <button className="btn btn-danger" type="button" disabled={removerText === ""} onClick={(event) => removeUnidade(utilizadorConsultar?.username, unidadeId, event)} >Remover</button>
                                    :
                                    removerTurma ?
                                        <button className="btn btn-danger" type="button" disabled={removerText === ""} onClick={(event) => removeTurma(utilizadorConsultar?.username, turmaId, event)} >Remover</button>
                                        : null
                            }


                            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearDadosEdit}>
                                Fechar
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
                            <h4 className="modal-title">Registar utilizador</h4>
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

export default GestaoUtilizadores;