import { useState, useEffect } from "react"
import axios from 'axios';
import { urlApi } from '../config';
import TabelaAula from "../components/TabelaAula";

export default function RegistarAula() {


    const [turma, setTurma] = useState('')
    const [unidadeId, setUnidadeId] = useState('')
    const [turmaId, setTurmaId] = useState('')
    const [sala, setSala] = useState(null);
    const [estadoSala, setEstadoSala] = useState(null);
    const [unidade_curricular, setUnidadeCurricular] = useState(null);
    const [sala_ativa, setSalaAtiva] = useState(null)
    const sessionId = localStorage.getItem('professor_id');
    const [data, setData] = useState(null);
    const [turmas, setTurmas] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [data_alunos, setDataAlunos] = useState(null);
    const [aluno, setAluno] = useState('');
    const [inputError, setInputError] = useState(false);



    //verifica se o professor tem aulas ativas
    useEffect(() => {
        document.title = 'PresCheck - Aula';
        setLoading(true);
        axios.get(`${urlApi}/aulas?professor_id=${sessionId}`)
            .then(
                response => {
                    setSala(response.data.sala);
                    setSalaAtiva(response.data.sala);
                    setEstadoSala(response.data.estado);
                    setTurma(response.data.turma)
                    setUnidadeCurricular(response.data.unidade);
                    setLoading(false);
                    if (response.data.sala != null) {
                        axios.get(`${urlApi}/presencas?sala=${response.data.sala}`)
                            .then(response => {
                                setDataAlunos(response.data.alunos);
                            })
                            .catch(error => console.error(error));
                    }
                })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });

        //verifica as unidades associadas a um professor
        axios.get(`${urlApi}/unidades?professor_id=${sessionId}`)
            .then(
                response => {
                    setData(response.data.unidades);
                })
            .catch(error => {
                console.error(error);
            });
        //verifica as turmas associadas a um professor
        axios.get(`${urlApi}/turmas?professor_id=${sessionId}`)
            .then(
                response => {
                    setTurmas(response.data.turmas);
                })
            .catch(error => {
                console.error(error);
            });
    }, [sessionId]);

    //Inicia a Aula
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('sessao: ' + sessionId);
        try {
            await axios.post(`${urlApi}/aula/iniciar`, {
                unidade_id: unidadeId,
                professor_id: sessionId,
                sala: sala,
                turma_id: turmaId
            });
            window.location.reload();
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }
    };

    //Suspender a Aula
    const suspenderAula = async (event) => {
        event.preventDefault();

        try {
            await axios.post(`${urlApi}/aula/controlar`, {
                sala: sala,
                acao: 'STOP'
            });
            window.location.reload();
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }
    };

    //Retomar a Aula
    const retomarAula = async (event) => {
        event.preventDefault();

        try {
            await axios.post(`${urlApi}/aula/controlar`, {
                sala: sala,
                acao: 'GO'
            });
            window.location.reload();
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }
    };

    //Encerra a Aula
    function encerrarAula() {
        axios.post(`${urlApi}/aula/controlar`, {
            sala: sala,
            acao: 'FINISH'
        }).then(response => {
            window.location.reload();
        }).catch(error => {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        });
    };

    //Controlar a aula
    function controlarAula(acao) {
        axios.post(`${urlApi}/aula/controlar`, {
            sala: sala,
            acao: acao
        }).then(response => {
            window.location.reload();
        }).catch(error => {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        });
    }

    function verificarCampo() {

        if (aluno.trim() === '') {
            setInputError(true);
            return
        }
        setInputError(false)
    }

    function getAlunos() {
        axios.get(`${urlApi}/presencas?sala=${sala_ativa}`)
            .then(response => {
                setDataAlunos(response.data.alunos);
            })
            .catch(error => console.error(error));
    }

    //Regista a presença do aluno
    const registarPresenca = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`${urlApi}/presencas/marcar`, {
                sala: sala,
                aluno: aluno,
            });
            getAlunos();
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }
    };

    function exportarDados() {
        getAlunos();

        const csvContent = "data:text/csv;charset=utf-8," + data_alunos.map(item => {
            const dataHora = item.timestamp.split(" ").join(";");
            return item.numero + ";" + dataHora;
        }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");

        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleDateString();

        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `presenças_${unidade_curricular}_${dataFormatada}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="content-center">
                <div className="content">
                    {
                        loading ?
                            <div className="center">
                                <div className="spinner-border" role="status">
                                    <div className="visually-hidden">Loading...</div>
                                </div>
                            </div> :
                            //verifica se tem aulas ativas
                            sala_ativa ?
                                <div className="p-4 content-box-form">
                                    <div className="display-6">{unidade_curricular}</div>
                                    <div className="h5">Sala {sala}</div>
                                    <div className="h6">Turma {turma}</div>
                                    <form className="mt-5" onSubmit={handleSubmit}>
                                        <fieldset>
                                            <legend>Registar aluno</legend>
                                            <div className="form-group text-left">
                                                <label htmlFor="nrAluno" className="mt-3 mb-1">Número de aluno:</label>
                                                <div className="input-group mt-3 mb-3">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        id="nr_aluno"
                                                        value={aluno}
                                                        placeholder="Ex.: 22000000"
                                                        onChange={(event) => setAluno(event.target.value)}
                                                    />
                                                    <div className="input-group-append">
                                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#confirmar"
                                                            onClick={verificarCampo} style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}>
                                                            Registar Aluno
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        {error && <p className="text-danger small">*{error}</p>}
                                        <div className="d-flex justify-content-between flex-wrap">
                                            {
                                                estadoSala === 'GO' ?
                                                    <button type="button" className="btn btn-warning mt-3 mx-2" onClick={suspenderAula}>Suspender Registo</button>
                                                    :
                                                    <button type="button" className="btn btn-success mt-3 mx-2" onClick={retomarAula}>Retomar Registo</button>
                                            }
                                            <button type="button" className="btn btn-danger mt-3 mx-2" data-bs-toggle="modal" data-bs-target="#encerrar">Encerrar Aula</button>
                                            <button type="button" className="btn btn-dark mt-3 mx-2" data-bs-toggle="modal" data-bs-target="#cancelar">Cancelar Aula</button>

                                        </div>

                                        {/* Popup para encerrar aula */}
                                        <div className="modal" id="encerrar">
                                            <div className="modal-dialog modal-md">
                                                <div className="modal-content">

                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Encerrar aula</h4>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                                    </div>

                                                    <div className="modal-body">

                                                        <p>Pretende exportar a listagem de presença dos alunos?</p>

                                                    </div>

                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={() => { exportarDados(); encerrarAula() }}>Sim</button>

                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => encerrarAula()}>Não</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        {/* Popup para cancelar aula */}
                                        <div className="modal" id="cancelar">
                                            <div className="modal-dialog modal-md">
                                                <div className="modal-content">

                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Cancelar aula</h4>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                                    </div>

                                                    <div className="modal-body">

                                                        <p>Tem a certeza que pretende cancelar a aula?</p>
                                                        <p className="small text-danger"><b>* Nenhum registo será guardado.</b></p>

                                                    </div>

                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => controlarAula('CANCEL')}>Sim</button>

                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Não</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        {/* Popup para confirmar registo */}
                                        <div className="modal" id="confirmar">
                                            <div className="modal-dialog modal-md">
                                                <div className="modal-content">

                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Registar aluno</h4>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                                    </div>

                                                    <div className="modal-body">

                                                        {
                                                            //verifica se o campo foi preenchido e apresenta informação
                                                            !inputError ?
                                                                <p>Tem a certeza que deseja registar o aluno número <b>{aluno}</b></p>
                                                                : <p>Tem de preencher o número de aluno</p>
                                                        }

                                                    </div>

                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Voltar</button>

                                                        {
                                                            //verifica se o campo foi preenchido e apresenta o botão
                                                            !inputError ?
                                                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" onClick={registarPresenca}>Confirmar</button>
                                                                : <></>
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                :
                                <div className="p-4 content-box-form">
                                    <h1>Registar Aula</h1>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group text-left">
                                            <label htmlFor="turma" className="mt-3 mb-1">Turma:</label>
                                            {turmas ? (
                                                <select
                                                    id="turma"
                                                    name="turma"
                                                    placeholder="Selecione"
                                                    className="form-select"
                                                    onChange={(event) => setTurmaId(event.target.value)}>
                                                    <option value="" disabled hidden selected>Selecione uma turma</option>
                                                    {turmas.map(turma => (
                                                        <option key={turma.id} value={turma.id}>
                                                            {turma.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : <select
                                                id="turma"
                                                name="turma"
                                                placeholder="Selecione"
                                                className="form-select">
                                                <option value="" disabled hidden selected>Selecione uma turma</option>
                                            </select>}

                                            <label htmlFor="unidade_curricular" className="mt-2 mb-1">Unidade Curricular:</label>
                                            {data ? (
                                                <select
                                                    id="unidadeCurricular"
                                                    name="unidadeCurricular"
                                                    placeholder="Selecione"
                                                    className="form-select"
                                                    onChange={(event) => setUnidadeId(event.target.value)}>
                                                    <option value="" disabled hidden selected>Selecione uma UC</option>
                                                    {data.map(item => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : <select
                                                id="unidadeCurricular"
                                                name="unidadeCurricular"
                                                placeholder="Selecione"
                                                className="form-select">
                                                <option value="" disabled hidden selected>Selecione uma UC</option>
                                            </select>}
                                            <label htmlFor="unidade_curricular" className="mt-2 mb-1">Sala:</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="sala"
                                                value={sala}
                                                placeholder="Ex.: F.2.3"
                                                onChange={(event) => setSala(event.target.value)}
                                            />
                                        </div>
                                        {/*<div className="d-flex align-items-center mt-3">
                                            <label htmlFor="tolerancia" className="me-2">Tolerância:</label>
                                            <div className="input-group input-group-sm" style={{ width: "120px" }}>
                                                <input
                                                    type="number"
                                                    id="tolerancia"
                                                    min="1"
                                                    max="60"
                                                    className="form-control"

                                                    value={tolerancia}
                                                    onChange={(event) => setTolerancia(event.target.value)}
                                                />
                                                <span className="input-group-text">{tolerancia == 1 ? 'minuto' : 'minutos'}</span>
                                            </div>

                                                    </div>*/}
                                        <button type="submit" className="btn btn-primary mt-3">Iniciar Aula</button>
                                        {error && <p>{error}</p>}
                                    </form>
                                </div>
                    }
                </div>
            </div>
            {
                sala_ativa ?
                    <TabelaAula sala={sala_ativa} /> : null
            }
        </>

    )

}