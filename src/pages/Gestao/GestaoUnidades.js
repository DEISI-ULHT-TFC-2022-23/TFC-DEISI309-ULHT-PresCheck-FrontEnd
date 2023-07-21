import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { urlApi } from '../../config';


const GestaoUnidades = () => {
    const [unidades, setUnidades] = useState([]);
    const [codigoUnidade, setCodigoUnidade] = useState('');
    const [nomeUnidade, setNomeUnidade] = useState('');
    const [unidadeConsultar, setUnidadeConsultar] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [pesquisa, setPesquisa] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const unidadesPorPagina = 10;
    const indiceUltimaUnidade = paginaAtual * unidadesPorPagina;
    const indicePrimeiraUnidade = indiceUltimaUnidade - unidadesPorPagina;
    const filtroUnidades = unidades.filter(unidade =>
        unidade.nome.toLowerCase().includes(pesquisa.toLowerCase())
    ).slice(indicePrimeiraUnidade, indiceUltimaUnidade);
    
    useEffect(() => {
        document.title = 'PresCheck - Gestão de Unidades Curriculares';
        setLoading(true);
        axios.get(`${urlApi}/admin/unidades`)
            .then(
                response => {
                    setUnidades(response.data.unidades);
                    setLoading(false);
                })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const criarUnidade = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`${urlApi}/admin/unidades/criar`, {
                codigo: codigoUnidade,
                nome: nomeUnidade
            });
            if (response.status === 200) {
                axios.get(`${urlApi}/admin/unidades`)
                .then(
                    response => {
                        setUnidades(response.data.unidades);
                        console.log(response.data);
                        setLoading(false);
                    })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
                clearDadosEdit();
                setMessage('Unidade criada com sucesso!');
            }
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }

    };

    function clearDadosEdit() {
        setCodigoUnidade('');
        setNomeUnidade('');
        setError('');
        setMessage('');
    }

    function abrirModal(codigoUnidade) {
        axios.get(`${urlApi}/admin/unidades/${codigoUnidade}`)
            .then(
                response => {
                    setUnidadeConsultar(response.data);
                    console.log(unidadeConsultar)
                })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    const proximaPagina = () => {
        if (paginaAtual < Math.ceil(unidades.length / unidadesPorPagina)) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const paginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    const eliminarUnidade = async (event) => {
        event.preventDefault();

        try {
            await axios.delete(`${urlApi}/admin/unidades/eliminar/${unidadeConsultar.id}`);
            axios.get(`${urlApi}/admin/unidades`)
                .then(
                    response => {
                        setUnidades(response.data.unidades);
                        setLoading(false);
                    })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }
    };

    return (
        <>
            <div className="content-center">
                <div className="content">
                    <div className="p-4 content-box-form">
                        <form >
                            <fieldset>
                                <legend>Criar Unidade Curricular</legend>
                                <div className="form-group text-left">
                                    <div className="mb-3">
                                        <label htmlFor="codigoUnidade" className="mt-3 mb-1 me-3">Código:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="codigoUnidade"
                                            value={codigoUnidade}
                                            placeholder="Ex.: ULHT260-5140"
                                            onChange={(event) => setCodigoUnidade(event.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="nomeUnidade" className="mt-3 mb-1">Nome:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="nomeUnidade"
                                            value={nomeUnidade}
                                            placeholder="Ex.: Trabalho Final de Curso"
                                            onChange={(event) => setNomeUnidade(event.target.value)}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                            {message && <p>{message}</p>}
                            {error && <p>{error}</p>}
                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-success mt-3 mx-2" onClick={criarUnidade} >Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {
                unidades.length > 0 ? (
                    //caixa de pesquisa
                    <div className="content pesquisa">
                        <label>Pesquisar unidade curricular:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={pesquisa}
                            placeholder="Ex.: Trabalho Final de Curso"
                            onChange={(event) => setPesquisa(event.target.value)}
                        />
                    </div>) : null
            }

            {
                //Tabela com as unidades
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
                        {unidades.length > 0 ? (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nome</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtroUnidades.map((unidade, index) => (
                                        <tr key={index}>
                                            <td>{unidade.codigo}</td>
                                            <td>{unidade.nome}</td>
                                            <td>
                                                <Link className="btn btn-primary btn-sm m-1" onClick={() => abrirModal(unidade.codigo)} data-bs-toggle="modal" data-bs-target="#consultar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-eye-fill"></span></Link>
                                                <Link className="btn btn-danger btn-sm m-1" onClick={() => abrirModal(unidade.codigo)} data-bs-toggle="modal" data-bs-target="#eliminar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-trash-fill"></span></Link>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p>Não existem registos de unidades curriculares</p>
                        }
                        </>
                    
                }
                    </div>
                </div>
            }

            {/*Botões para alterar páginas*/}
            {unidades.length > 0 ?
                <div className="content-center">
                    <button className="btn btn-primary active m-1" onClick={paginaAnterior} disabled={paginaAtual === 1}>
                        Página Anterior
                    </button>
                    <button className="btn btn-primary active m-1" onClick={proximaPagina} disabled={paginaAtual === Math.ceil(unidades.length / unidadesPorPagina)}>
                        Próxima Página
                    </button>
                </div> : null}

            {/* Popup para consultar dados da unidade curricular */}
            <div className="modal" id="consultar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">{unidadeConsultar?.nome}</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">

                            <p><b>Código: </b>{unidadeConsultar?.codigo}</p>

                            {
                                unidadeConsultar?.professores?.length > 0 ?
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Professores associados</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                unidadeConsultar?.professores.map((professor, index) => (
                                                    <tr key={index}>
                                                        <td>{professor}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    :
                                    <p><i>Sem professores associados</i></p>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup com a confirmação para eliminar unidade curricular */}
            <div className="modal" id="eliminar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Eliminar Unidade Curricular</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">

                            <p>Tem a certeza que deseja eliminar a unidade curricular <b>{unidadeConsultar?.nome}</b> com o código <b>{unidadeConsultar?.codigo}</b> ?</p>

                        </div>

                        <div className="modal-footer">

                            <button className="btn btn-danger active m-1" onClick={eliminarUnidade} data-bs-dismiss="modal">
                                Sim, eliminar
                            </button>
                            <button className="btn btn-secondary active m-1" data-bs-dismiss="modal">
                                Não, manter
                            </button>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )


};

export default GestaoUnidades;