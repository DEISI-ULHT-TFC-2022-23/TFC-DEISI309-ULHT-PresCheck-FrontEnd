import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { urlApi } from '../config';

const AulasProf = () => {

    const [aulas, setAulas] = useState([]);
    const [aulaConsultar, setAulaConsultar] = useState('');
    const [loading, setLoading] = useState(true);
    const [pesquisa, setPesquisa] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const aulasPorPagina = 10;
    const sessionId = localStorage.getItem('professor_id');
    const indiceUltimaAula = paginaAtual * aulasPorPagina;
    const indicePrimeiraAula = indiceUltimaAula - aulasPorPagina;
    const filtroAulas = aulas.filter(aula =>
        aula.unidade.toLowerCase().includes(pesquisa.toLowerCase())
    ).slice(indicePrimeiraAula, indiceUltimaAula);

    useEffect(() => {
        setLoading(true);
        axios.get(`${urlApi}/historico?professor_id=${sessionId}`)
            .then(
                response => {
                    setAulas(response.data.aulas);
                    setLoading(false);
                })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [sessionId]);

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

    const abrirModal = async(idAula, exportar) => {

        try {
            axios.get(`${urlApi}/historico/aula?professor_id=${sessionId}&aula_id=${idAula}`)
            .then(
                response => {
                    setAulaConsultar(response.data.aula);
                    if (exportar) {
                        exportarDados(response.data.aula);
                    };
                });
        } catch (error) {
            console.error(error);
                setLoading(false);
        }
        
    };

    function clearDadosEdit() {
        setAulaConsultar('');
    };

    function exportarDados(dadosAula) {
        const csvContent = "data:text/csv;charset=utf-8," + dadosAula?.presencas?.map(item => {
            const dataHora = item.presenca.split(" ").join(";");
            return item.aluno + ";" + dataHora;
        }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");

        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleDateString();

        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `presenças_${dadosAula?.unidade?.nome}_${dataFormatada}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }

    useEffect(() => {
        const modalElement = document.getElementById('consultar-aula');
        modalElement.addEventListener('hidden.bs.modal', clearDadosEdit);

        return () => {
            modalElement.removeEventListener('hidden.bs.modal', clearDadosEdit);
        };
    }, []);

    return (
        <>
            <div className="content-center">
                <div className="content">
                    <h2 className="display-6 mb-4">Histórico das aulas</h2>
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
                                                    <th className="align-middle text-center" style={{ width: '30%' }}>Sala</th>
                                                    <th className="align-middle text-center" style={{ width: '30%' }}>Data</th>
                                                    <th className="align-middle text-center" style={{ width: '10%' }}>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtroAulas.map((aula, index) => (
                                                    <tr key={index}>
                                                        <td className="align-middle" style={{ width: '30%' }}>{aula.unidade}</td>
                                                        <td className="align-middle text-center" style={{ width: '30%' }}>{aula.sala}</td>
                                                        <td className="align-middle text-center" style={{ width: '30%' }}>{aula.data}</td>
                                                        <td className="align-middle text-center" style={{ width: '10%' }}>
                                                            <Link className="btn btn-primary btn-sm m-1" onClick={(event) => abrirModal(aula.id, false, event)} data-bs-toggle="modal" data-bs-target="#consultar-aula" to="" role="button" aria-pressed="true" alt="Ver detalhes" title="Ver detalhes">
                                                                <span className="bi bi-eye-fill"></span>
                                                            </Link>
                                                            <Link className="btn btn-secondary btn-sm m-1" onClick={(event) => abrirModal(aula.id, true, event)} role="button" aria-pressed="true" alt="Exportar dados" title="Exportar dados da aula">
                                                                <span className="bi bi-download"></span>
                                                            </Link>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <p>Não existem registos de aulas</p>
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
            <div className="modal" id="consultar-aula">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">{aulaConsultar?.unidade?.nome} ({aulaConsultar?.unidade?.codigo})</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">
                            <p><b>Professor: </b>{aulaConsultar?.professor}</p>
                            <p><b>Sala: </b>{aulaConsultar?.sala}</p>
                            <p><b>Data: </b>{aulaConsultar?.data}</p>
                            <p><b>Total de presenças: </b>{aulaConsultar?.presencas?.length}</p>
                            <p><b>Presenças: </b></p>
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
                                            aulaConsultar?.presencas?.map((presenca, index) => (
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

export default AulasProf;