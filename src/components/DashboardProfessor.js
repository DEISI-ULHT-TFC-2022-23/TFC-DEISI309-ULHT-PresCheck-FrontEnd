import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { urlApi } from '../config';
import '../dashboard.css';
import GraficoBarrasAgrupadas from "./GraficoBarrasAgrupadas";


const DashboardProfessor = () => {
    const [dadosUnidade, setDadosUnidade] = useState({ labels: [], dataMedia: [], dataMediana: [] });
    const profId = localStorage.getItem('professor_id');
    const [alunos, setAlunos] = useState([]);
    const [aluno, setAluno] = useState('');
    const [dadosAulasAluno, setDadosAulasAluno] = useState('');
    const [unidadeId, setUnidadeId] = useState('');
    const [unidadesProfessor, setUnidadesProfessor] = useState([]);

    useEffect(() => {
        //verifica as unidades associadas a um professor
        axios.get(`${urlApi}/unidades?professor_id=${profId}`)
            .then(
                response => {
                    setUnidadesProfessor(response.data.unidades);
                })
            .catch(error => {
                console.error(error);
            });
    }, [profId]);

    function statsUnidade(unidadeId, event) {
        if (event) {
            clearOrdenacoes();
            axios.get(`${urlApi}/stats/presencas?unidade_id=${unidadeId}&professor_id=${profId}`)
                .then(response => {
                    setAlunos(response.data.results);
                    setUnidadeId(unidadeId);

                })
                .catch(error => console.error(error));

            axios.get(`${urlApi}/stats/unidades?tipo=prof&professor_id=${profId}&unidades=${unidadeId}`)
                .then(
                    response => {
                        const labels = response.data.results.map(result => result.unidade);
                        const valuesMedia = response.data.results.map(result => result.media);
                        const valuesMediana = response.data.results.map(result => result.mediana);

                        setDadosUnidade({ labels, dataMedia: valuesMedia, dataMediana: valuesMediana });
                    })
                .catch(error => {
                    console.error(error);
                });
        }

    }

    /* Ordenar por presenca*/
    const [ordemPresenca, setOrdemPresenca] = useState("");

    const ordenarPorPresenca = () => {
        const listaOrdenada = [...alunos].sort((a, b) => a.presencas - b.presencas);
        setAlunos(listaOrdenada);
        setOrdemPresenca("crescente");

    };

    const ordenarPorPresencaDecrescente = () => {
        const listaOrdenada = [...alunos].sort((a, b) => b.presencas - a.presencas);
        setAlunos(listaOrdenada);
        setOrdemPresenca("decrescente");
    };

    const handleOrdenarPorPresenca = () => {
        if (alunos.length > 0) {
            if (ordemPresenca === "decrescente") {
                clearOrdenacoes();
                ordenarPorPresenca();
            } else {
                clearOrdenacoes();
                ordenarPorPresencaDecrescente();
            }
        }
    };
    /* Fim Ordenar por presenca*/

    /* Ordenar por numero de aluno*/
    const [ordemAluno, setOrdemAluno] = useState("");

    const ordenarPorNumero = () => {
        const listaOrdenada = [...alunos].sort((a, b) => a.numero - b.numero);
        setAlunos(listaOrdenada);
        setOrdemAluno("crescente");

    };

    const ordenarPorNumeroDecrescente = () => {
        const listaOrdenada = [...alunos].sort((a, b) => b.numero - a.numero);
        setAlunos(listaOrdenada);
        setOrdemAluno("decrescente");
    };

    const handleOrdenarPorNumero = () => {

        if (alunos.length > 0) {
            if (ordemAluno === "decrescente") {
                clearOrdenacoes();
                ordenarPorNumero();
            } else {
                clearOrdenacoes();
                ordenarPorNumeroDecrescente();
            }
        }
    };
    /* Fim Ordenar por numero de aluno*/

    function clearOrdenacoes() {
        setOrdemAluno('');
        setOrdemPresenca('');
    }

    function abrirModal(numero, unidadeId) {

        axios.get(`${urlApi}/stats/alunos?tipo=historico&aluno_id=${numero}&professor_id=${profId}&unidade_id=${unidadeId}`)
            .then(response => {
                setAluno(numero);
                setDadosAulasAluno(response.data.results);
            })
            .catch(error => console.error(error));
        
    };



    return (
        <>
            <div className="content-center">
                <div className="content d-flex flex-column text-center">
                    <h2 className="display-6 mb-4">Dashboard Pessoal</h2>
                    <div className="d-flex justify-content-center flex-wrap">
                        {
                            //Tabela com os utilizadores
                            <div className="content-center">
                                <div className="content border rounded p-3 shadow-sm" >
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th className="align-middle">
                                                    <Link className="text-decoration-none text-dark" onClick={() => handleOrdenarPorNumero()}>
                                                        <span className="me-1">Número de aluno</span>
                                                        <span className={ordemAluno === "decrescente" ? "text-decoration-none text-primary small" : "small"}  >
                                                            &#9660;
                                                        </span>
                                                        <span className={ordemAluno === "crescente" ? "text-decoration-none text-primary small" : "small"}>
                                                            &#9650;
                                                        </span>
                                                    </Link>
                                                </th>
                                                <th className="align-middle text-center">
                                                    <Link className="text-decoration-none text-dark" onClick={() => handleOrdenarPorPresenca()}>
                                                        <span className="me-1">Total de presenças</span>
                                                        <span className={ordemPresenca === "decrescente" ? "text-decoration-none text-primary small" : "small"}>
                                                            &#9660;
                                                        </span>
                                                        <span className={ordemPresenca === "crescente" ? "text-decoration-none text-primary small" : "small"}>
                                                            &#9650;
                                                        </span>
                                                    </Link>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alunos.map((aluno, index) => (
                                                <tr key={index}>
                                                    <td className="align-middle">{aluno.numero}</td>
                                                    <td className="align-middle text-center">{aluno.presencas}</td>
                                                    <td className="align-middle text-center">
                                                        <Link className="btn btn-primary btn-sm m-1" onClick={() => abrirModal(aluno.numero, unidadeId)} data-bs-toggle="modal" data-bs-target="#consultar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-eye-fill"></span></Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="border rounded p-3 ms-5 shadow-sm" style={{ maxWidth: '250px' }} >
                                        <p><b>Unidades Curriculares</b></p>
                                        <hr />
                                        <div className="border p-2" style={{ maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden' }}>
                                            {unidadesProfessor.map(unidade => (
                                                <Link className="btn btn-dark btn-sm m-1" role="button" onClick={(event) => statsUnidade(unidade.id, event)} aria-pressed="true" style={{ width: '100%' }} key={unidade.id}>{unidade.nome}</Link>

                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {dadosUnidade !== null ? (
                            <div className="content-center d-flex justify-content-center">
                                <div className="grafico shadow-sm border m-5">
                                    <GraficoBarrasAgrupadas
                                        labels={dadosUnidade.labels}
                                        valorPrimeiro={dadosUnidade.dataMedia}
                                        valorSegundo={dadosUnidade.dataMediana}
                                        labelPrimeiro={'Média'}
                                        labelSegundo={'Mediana'}
                                        labelY={'Presenças'}
                                    />
                                </div>
                            </div>
                        ) : null}

                        {/* Popup para consultar dados do aluno */}
                        <div className="modal" id="consultar">
                            <div className="modal-dialog modal-md modal-dialog-centered">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h4 className="modal-title">Consultar presenças do aluno</h4>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                                    </div>

                                    <div className="modal-body text-start">

                                        <p><b>Número de aluno: </b>{aluno}</p>
                                        <p><b>Lista de presenças: </b></p>
                                        {
                                            dadosAulasAluno.length > 0 ?
                                                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>Turno</th>
                                                                <th>Data e hora</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                dadosAulasAluno?.map((dado, index) => (
                                                                    <tr key={index}>
                                                                        <td>{dado.turma}</td>
                                                                        <td>{dado.presenca}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div> :
                                                null
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    )


};

export default DashboardProfessor;