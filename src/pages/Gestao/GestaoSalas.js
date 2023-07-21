import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { urlApi } from '../../config';


const GestaoSalas = () => {

    const [salas, setSalas] = useState([]);
    const [sala, setSala] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [salaConsultar, setSalaConsultar] = useState('');
    const [arduino, setArduino] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [pesquisa, setPesquisa] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const salasPorPagina = 10;
    const indiceUltimaSala = paginaAtual * salasPorPagina;
    const indicePrimeiraSala = indiceUltimaSala - salasPorPagina;
    const filtroSalas = salas.filter(sala =>
        sala.nome.toLowerCase().includes(pesquisa.toLowerCase())
    ).slice(indicePrimeiraSala, indiceUltimaSala);

    useEffect(() => {
        document.title = 'PresCheck - Gestão de Salas de aula';
        setLoading(true);
        axios.get(`${urlApi}/admin/salas`)
            .then(
                response => {
                    setSalas(response.data.salas);
                    setLoading(false);
                })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const definirNomeArduino = (event) => {
        const input = event.target.value;
        setSala(input);
        const salaFormatada = input.replace(/\./g, '');
        setArduino("ULHT-A-" + salaFormatada);
    };

    const criarSala = async (event) => {
        event.preventDefault();
        clearMessages();
        try {
            const response = await axios.post(`${urlApi}/admin/salas/criar`, {
                nome: sala,
                arduino: arduino,
                ip_address: ipAddress
            });
            if (response.status === 200) {
                axios.get(`${urlApi}/admin/salas`)
                    .then(
                        response => {
                            setSalas(response.data.salas);
                            setLoading(false);
                        })
                    .catch(error => {
                        console.error(error);
                        setLoading(false);
                    });
                clearDadosEdit();
                setMessage('Sala criada com sucesso!');
            }
        } catch (error) {
            setError(error.response.data.error);
            console.log(error.response.data.message);
        }

    };

    const eliminarSala = async (event) => {
        event.preventDefault();

        try {
            await axios.delete(`${urlApi}/admin/salas/eliminar/${salaConsultar.id}`);
            axios.get(`${urlApi}/admin/salas`)
                .then(
                    response => {
                        setSalas(response.data.salas);
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

    const proximaPagina = () => {
        if (paginaAtual < Math.ceil(salas.length / salasPorPagina)) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const paginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    function clearDadosEdit() {
        setSala('');
        setArduino('');
        clearMessages();
    }

    function clearMessages() {
        setError('');
        setMessage('');
    }

    function abrirModal(sala) {
        setSalaConsultar(sala);
    };

    return (
        <>
            <div className="content-center">
                <div className="content">
                    <div className="p-4 content-box-form">
                        <form >
                            <fieldset>
                                <legend>Criar Sala de Aula</legend>
                                <div className="form-group text-left">
                                    <div className="mb-3">
                                        <label htmlFor="sala" className="mt-3 mb-1 me-3">Sala:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="sala"
                                            value={sala}
                                            placeholder="Ex.: F.1.3"
                                            onChange={definirNomeArduino}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="ip-adress" className="mt-3 mb-1 me-3">Endereço IP do dispositivo:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="ip-adress"
                                            value={ipAddress}
                                            placeholder=""
                                            onChange={(event) => setIpAddress(event.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="input-group mt-3 mb-3">
                                        <label htmlFor="arduino" className="mt-3 mb-1 me-3">ID do Arduino:</label>
                                        <input type="text" id="arduino" className="form-control" placeholder="ID do Arduino" aria-label="" aria-describedby="ulht-arduino" value={arduino} disabled />
                                    </div>
                                </div>
                            </fieldset>
                            {message && <p className="small">{message}</p>}
                            {error && <p className="small text-danger">{error}</p>}
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-success mt-3 mx-2" onClick={criarSala} >Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {
                salas.length > 0 ? (
                    //caixa de pesquisa
                    <div className="content pesquisa">
                        <label>Pesquisar sala de aula:</label>
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
                //Tabela com as salas
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
                                    {salas.length > 0 ? (
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="align-middle" style={{ width: '30%'}}>Sala</th>
                                                    <th className="align-middle" style={{ width: '50%'}}>ID do Arduino</th>
                                                    <th className="align-middle text-center" style={{ width: '20%'}}>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtroSalas.map((sala, index) => (
                                                    <tr key={index}>
                                                        <td className="align-middle" style={{ width: '30%'}}>{sala.nome}</td>
                                                        <td className="align-middle" style={{ width: '50%'}}>{sala.arduino}</td>
                                                        <td className="align-middle text-center" style={{ width: '20%'}}>
                                                            <Link className="btn btn-danger btn-sm m-1" onClick={() => abrirModal(sala)} data-bs-toggle="modal" data-bs-target="#eliminar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-trash-fill"></span></Link>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <p>Não existem registos de salas de aula</p>
                                    }
                                </>

                        }
                    </div>
                </div>
            }

            {/*Botões para alterar páginas*/}
            {salas.length > 0 ?
                <div className="content-center">
                    <button className="btn btn-primary active m-1" onClick={paginaAnterior} disabled={paginaAtual === 1}>
                        Página Anterior
                    </button>
                    <button className="btn btn-primary active m-1" onClick={proximaPagina} disabled={paginaAtual === Math.ceil(salas.length / salasPorPagina)}>
                        Próxima Página
                    </button>
                </div> : null}

            {/* Popup com a confirmação para eliminar sala */}
            <div className="modal" id="eliminar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Eliminar Sala de Aula</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">

                            <p>Tem a certeza que deseja eliminar a sala <b>{salaConsultar?.nome}</b> com o Arduino associado com o id: <b>{salaConsultar?.arduino}</b> ?</p>

                        </div>

                        <div className="modal-footer">

                            <button className="btn btn-danger m-1" onClick={eliminarSala} data-bs-dismiss="modal">
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

export default GestaoSalas;