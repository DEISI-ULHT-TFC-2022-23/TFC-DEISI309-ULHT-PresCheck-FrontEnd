import { useEffect } from "react";
import AulasTotal from '../../components/AulasTotal';
import AulasAtivas from '../../components/AulasAtivas';


const GestaoAulas = () => {

    useEffect(() => {
        document.title = 'PresCheck - Gestão de Aulas';
    }, []);

    return (
        <>
            <AulasTotal />
            <hr className="mt-5 mb-4"/>
            <AulasAtivas />
        </>
    )


};

export default GestaoAulas;