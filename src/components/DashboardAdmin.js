import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { urlApi } from '../config';
import "chart.js/auto";
import GraficoBarrasAgrupadas from "./GraficoBarrasAgrupadas";


const DashboardAdmin = () => {
    const [dadosUnidades, setDadosUnidades] = useState({ labels: [], dataMedia: [], dataMediana: [] });
    const [searchTermUnidade, setSearchTermUnidade] = useState('');
    const [unidadesLista, setUnidadesLista] = useState([]);
    const [unidadesSelecionadas, setUnidadesSelecionadas] = useState([]);
    const filteredUnidades = unidadesLista.length > 0 ? unidadesLista.filter(unidade =>
        unidade.nome.toLowerCase().includes(searchTermUnidade.toLowerCase())
    ) : null;

    useEffect(() => {
        axios.get(`${urlApi}/admin/unidades`)
            .then(
                response => {
                    setUnidadesLista(response.data.unidades);
                })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleSearchChange = (event) => {
        setSearchTermUnidade(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        const opcaoId = Number(event.target.value);
        const isChecked = event.target.checked;

        if (isChecked) {
            setUnidadesSelecionadas([...unidadesSelecionadas, opcaoId]);
        } else {
            setUnidadesSelecionadas(unidadesSelecionadas.filter((id) => id !== opcaoId));
        }
    };

    const handleSelectAll = (event) => {

        const isChecked = event.target.checked;

        if (isChecked) {
            const todosIds = unidadesLista.map(unidade => unidade.id);
            setUnidadesSelecionadas(todosIds);
        } else {
            setUnidadesSelecionadas([]);
        }
    };

    function statsUnidades() {
        axios.get(`${urlApi}/stats/unidades?tipo=total&unidades=${unidadesSelecionadas.join(",")}`)
            .then(
                response => {
                    const labels = response.data.results.map(result => result.unidade);
                    const valuesMedia = response.data.results.map(result => result.media);
                    const valuesMediana = response.data.results.map(result => result.mediana);

                    setDadosUnidades({ labels, dataMedia: valuesMedia, dataMediana: valuesMediana });
                })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <>
            <div className="content-center">
                <div className="content d-flex flex-column text-center">
                    <h2 className="display-6 mb-4">Dashboard Geral</h2>
                    {dadosUnidades !== null ? (
                        <div className="content-center d-flex justify-content-center flex-wrap">


                            <div className="border rounded p-3 shadow-sm" style={{ textAlign: 'left', maxWidth: '400px' }} >
                                <p style={{ textAlign: 'center' }}><b>Unidades Curriculares</b></p>
                                <hr />
                                <label>
                                    <input
                                        type="checkbox"
                                        className="m-3"
                                        onChange={handleSelectAll}
                                    />
                                    Selecionar todas
                                </label>
                                {filteredUnidades !== null ?
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Pesquisar"
                                        value={searchTermUnidade}
                                        onChange={handleSearchChange}
                                    /> : null
                                }

                                <div className="option-list-container overflow-auto border" style={{ textAlign: 'left', maxHeight: '200px', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}}>
                                    <ul className="list-group">
                                        {filteredUnidades !== null ?
                                            <>
                                                {filteredUnidades.map((opcao) => (
                                                    <label key={opcao.nome} htmlFor={`opcao-${opcao.nome}`} className="form-check-label">
                                                        <li className="list-group-item">
                                                            <input
                                                                className="me-3"
                                                                type="checkbox"
                                                                id={`opcao-${opcao.nome}`}
                                                                value={opcao.id}
                                                                checked={unidadesSelecionadas.includes(opcao.id)}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            {<span>{opcao.codigo} | {opcao.nome}</span>}
                                                        </li>
                                                    </label>
                                                ))}
                                            </> : <label>
                                                <li className="list-group-item">
                                                    <span>Não existem unidades curriculares registadas na base de dados</span>
                                                </li>
                                            </label>}
                                    </ul>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Link className="btn btn-primary btn-sm mt-3 px-3"
                                        onClick={() => statsUnidades()}>
                                        Filtrar
                                    </Link>
                                </div>


                            </div>
                            <div className="content-center d-flex justify-content-center">
                                <div className="grafico shadow-sm border m-5">
                                    <GraficoBarrasAgrupadas
                                        labels={dadosUnidades.labels}
                                        valorPrimeiro={dadosUnidades.dataMedia}
                                        valorSegundo={dadosUnidades.dataMediana}
                                        labelPrimeiro={'Média'}
                                        labelSegundo={'Mediana'}
                                        labelY={'Presenças'}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )


};

export default DashboardAdmin;