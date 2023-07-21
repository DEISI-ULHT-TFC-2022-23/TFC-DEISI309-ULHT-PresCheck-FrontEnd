import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function PaginaErro() {

  useEffect(() => {
    document.title = 'PresCheck - Página não encontrada';
  }, []);

  return (
    <><div className="content-center">
      <div className="content">
        <div className=" p-4">
          <h1>404 - Página não encontrada!</h1>
          <p>Clique em voltar para regressar à página principal.</p>
          <Link className="btn btn-dark mt-3 mx-2" to="/">Voltar</Link>
        </div>
      </div>
    </div>
    </>
  )
}