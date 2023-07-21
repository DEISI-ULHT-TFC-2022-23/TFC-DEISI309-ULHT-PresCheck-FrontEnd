import { useState, useEffect } from "react"
import axios from 'axios';
import { urlApi } from '../config';
import { Link } from "react-router-dom";

const TabelaAula = ({ sala }) => {

    const [data_alunos, setDataAlunos] = useState(null);
    const [alunoConsultar, setAlunoConsultar] = useState(null);

    useEffect(() => {
        function getDados() {
            axios.get(`${urlApi}/presencas?sala=${sala}`)
            .then(response => {
                setDataAlunos(response.data.alunos);
            })
            .catch(error => console.error(error));
        }
        
        const interval = setInterval(getDados, 5000);

        return () => {
            clearInterval(interval);
        }


    }, [sala]);

    function abrirModal(aluno) {
        setAlunoConsultar(aluno.numero);
    };

    const eliminarPresenca = async (event) => {
        event.preventDefault();

        try {
            await axios.post(`${urlApi}/presencas/eliminar`, {
                sala: sala,
                aluno: alunoConsultar
            });

            axios.get(`${urlApi}/presencas?sala=${sala}`)
                .then(response => {
                    setDataAlunos(response.data.alunos);
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error.response.data.message);
        }
    };

    return (
        <>
            <div className="content-center">
                <div className="content" id="alunos">
                    {data_alunos !== null ? (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th className="align-middle" style={{ width: '10%' }}>Aluno</th>
                                    <th className="align-middle text-center" style={{ width: '60%' }}>Hora de entrada</th>
                                    <th className="align-middle text-center" style={{ width: '10%' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data_alunos.map(item => (
                                    <tr key={item.numero}>
                                        <td className="align-middle" style={{ width: '10%' }}>{item.numero}</td>
                                        <td className="align-middle text-center" style={{ width: '60%' }}>{item.timestamp}</td>
                                        <td className="align-middle text-center" style={{ width: '10%' }}>
                                            <Link className="btn btn-danger btn-sm m-1" onClick={() => abrirModal(item)} data-bs-toggle="modal" data-bs-target="#eliminar" to="" role="button" aria-pressed="true" alt="Ver detalhes"><span className="bi bi-trash-fill"></span></Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : null}
                </div>
            </div>

            {/* Popup com a confirmação para eliminar presença */}
            <div className="modal" id="eliminar">
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Eliminar presença</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>

                        <div className="modal-body">

                            <p>Tem a certeza que deseja eliminar a presença do aluno <b>{alunoConsultar}</b> ?</p>

                        </div>

                        <div className="modal-footer">

                            <button className="btn btn-danger active m-1" onClick={eliminarPresenca} data-bs-dismiss="modal">
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
export default TabelaAula;