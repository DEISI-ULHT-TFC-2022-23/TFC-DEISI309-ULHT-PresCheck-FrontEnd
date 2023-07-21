import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { urlApi } from '../config';


const AulasAtivas = () => {

    const [aulas, setAulas] = useState([]);
    const [aulaAtivaConsultar, setAulaAtivaConsultar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pesquisa, setPesquisa] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const aulasPorPagina = 10;
    const indiceUltimaAula = paginaAtual * aulasPorPagina;
    const indicePrimeiraAula = indiceUltimaAula - aulasPorPagina;
    const filtroAulas = aulas.filter(aula =>
        aula.unidade.toLowerCase().includes(pesquisa.toLowerCase())
    ).slice(indicePrimeiraAula, indiceUltimaAula);

    useEffect(() => {
        setLoading(true);
        getAulasAtivas();
    }, []);

    function getAulasAtivas() {
        axios.get(`${urlApi}/admin/aulas/ativas`)
            .then(
                response => {
                    setAulas(response.data.aulas);
                    setLoading(false);
                })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }

    const proximaPagina = () => {
        if (paginaAtual < Math.ceil(aulas.length / aulasPorPagina)) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const paginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    function abrirModal(sala) {
        axios.get(`${urlApi}/admin/aulas/ativas/${sala}`)
            .then(
                response => {
                    setAulaAtivaConsultar(response.data.aula);
                })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
        console.log(aulaAtivaConsultar);

    };

    function clearDadosEdit() {
        setAulaAtivaConsultar(null);
    };

    //FINISH ou CANCEL ou EXPORT Aula
    const controlarAula = async (acao, exportar, event) => {
        if (event) {
            event.preventDefault();
            try {
                await axios.post(`${urlApi}/aula/controlar`, {
                    sala: aulaAtivaConsultar?.sala,
                    acao: acao
                });
                if (exportar) {
                    exportarDados();
                }
                clearDadosEdit();
                getAulasAtivas();
                window.location.reload();
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    };

    function exportarDados() {
        const csvContent = "data:text/csv;charset=utf-8," + aulaAtivaConsultar?.presencas.map(item => {
            const dataHora = item.presenca.split(" ").join(";");
            return item.aluno + ";" + dataHora;
        }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");

        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleDateString();

        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `presenças_${aulaAtivaConsultar?.unidade.nome}_${dataFormatada}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            <div className="content-center">
                <div className="content">
                    <h2 className="display-6 mb-4">Aulas ativas</h2>
                </div>
            </div>
            {
                aulas.length > 0 ? (
                    //caixa de pesquisa
                    <div className="content pesquisa">
                        <label>Pesquisar por unidade curricular:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={pesquisa}
                            placeholder="Ex.: Segurança Informática"
                            onChange={(event) => setPesquisa(event.target.value)}
                        />
                    </div>) : null
            }

            {
                //Tabela com as aulas
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
                                    {aulas.length > 0 ? (
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="align-middle" style={{ width: '30%' }}>Unidade Curricular</th>
                                                    <th className="align-middle text-center" style={{ width: '20%' }}>Sala</th>
                                                    <th className="align-middle text-center" style={{ width: '20%' }}>Início</th>
                                                    <th className="align-middle text-center" style={{ width: '20%' }}>Estado</th>
                                                    <th className="align-middle text-center" style={{ width: '10%' }}>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtroAulas.map((aula, index) => (
                                                    <tr key={index}>
                                                        <td className="align-middle" style={{ width: '30%' }}>{aula.unidade}</td>
                                                        <td className="align-middle text-center" style={{ width: '20%' }}>{aula.sala}</td>
                                                        <td className="align-middle text-center" style={{ width: '20%' }}>{aula.inicio}</td>
                                                        <td className="align-middle text-center" style={{ width: '20%' }}>{aula.estado === 'GO' ? 'A decorrer' : 'Suspensa'}</td>
                                                        <td className="align-middle text-center" style={{ width: '10%' }}>
                                                            <Link className="btn btn-primary btn-sm m-1" onClick={() => abrirModal(aula.sala)} data-bs-toggle="modal" data-bs-target="#consultar-aula-ativa" to="" role="button" aria-pressed="true" alt="Ver detalhes" title="Ver detalhes">
                                                                <span className="bi bi-eye-fill"></span>
                                                            </Link>
                                                            <Link className="btn btn-success btn-sm m-1" onClick={() => abrirModal(aula.sala)} data-bs-toggle="modal" data-bs-target="#encerrar-aula-ativa" to="" role="button" aria-pressed="true" alt="Gravar aula" title="Gravar aula">
                                                                <span className="bi bi-save"></span>
                                                            </Link>
                                                            <Link className="btn btn-danger btn-sm m-1" onClick={() => abrirModal(aula.sala)} data-bs-toggle="modal" data-bs-target="#cancelar-aula-ativa" to="" role="button" aria-pressed="true" alt="Cancelar aula" title="Cancelar aula">
                                                                <span className="bi bi-x-lg"></span>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <p>De momento não existem aulas ativas</p>
                                    }
                                </>
                        }
                    </div>
                </div>
            }

            {/*Botões para alterar páginas*/}
            {aulas.length > 0 ?
                <div className="content-center">
                    <button className="btn btn-primary active m-1" onClick={paginaAnterior} disabled={paginaAtual === 1}>
                        Página Anterior
                    </button>
                    <button className="btn btn-primary active m-1" onClick={proximaPagina} disabled={paginaAtual === Math.ceil(aulas.length / aulasPorPagina)}>
                        Próxima Página
                    </button>
                </div> : null}


            {/* Popup com os dados da aula selecionada */}
            <div className="modal fade" id="consultar-aula-ativa">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">{aulaAtivaConsultar?.unidade?.nome} ({aulaAtivaConsultar?.unidade.codigo}) </h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">
                            <p><b>Professor: </b> {aulaAtivaConsultar?.professor} </p>
                            <p><b>Sala: </b>{aulaAtivaConsultar?.sala}</p>
                            <p><b>Início: </b>{aulaAtivaConsultar?.inicio}</p>
                            <p><b>Total de presenças: </b>{aulaAtivaConsultar?.presencas?.length}</p>
                            <p><b>Presenças </b></p>
                            {
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Aluno</th>
                                            <th>Registo de presença</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            aulaAtivaConsultar?.presencas?.map((presenca, index) => (
                                                <tr key={index}>
                                                    <td>{presenca.aluno}</td>
                                                    <td>{presenca.presenca}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal" >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup com a confirmação para encerrar aula */}
            <div className="modal fade" id="encerrar-aula-ativa">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Encerrar aula</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">
                            <p>Tem a certeza que deseja encerrar a aula de <b>{aulaAtivaConsultar?.unidade.nome} ({aulaAtivaConsultar?.unidade.codigo})</b> a decorrer na sala <b>{aulaAtivaConsultar?.sala}</b>?</p>

                        </div>

                        <div className="modal-footer">

                            <button className="btn btn-success active m-1" onClick={(event) => controlarAula('FINISH', true, event)} data-bs-dismiss="modal">
                                Encerrar e exportar
                            </button>
                            <button className="btn btn-warning active m-1" onClick={(event) => controlarAula('FINISH', false, event)} data-bs-dismiss="modal">
                                Apenas encerrar
                            </button>
                            <button className="btn btn-secondary active m-1" data-bs-dismiss="modal">
                                Não, manter
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Popup com a confirmação para cancelar aula */}
            <div className="modal fade" id="cancelar-aula-ativa">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Cancelar aula</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">
                            <p>Caso cancele a aula, os dados não serão guardados.</p>
                            <p>Tem a certeza que deseja cancelar a aula de <b>{aulaAtivaConsultar?.unidade.nome} ({aulaAtivaConsultar?.unidade.codigo})</b> a decorrer na sala <b>{aulaAtivaConsultar?.sala}</b>?</p>

                        </div>

                        <div className="modal-footer">

                            <button className="btn btn-danger active m-1" onClick={(event) => controlarAula('CANCEL', false, event)} data-bs-dismiss="modal">
                                Sim, cancelar
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

export default AulasAtivas;