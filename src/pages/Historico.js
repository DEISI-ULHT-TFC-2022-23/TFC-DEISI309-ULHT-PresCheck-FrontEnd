import AulasProf from '../components/AulasProf';
import { useEffect } from "react";

export default function Historico() {


    const Historico = () => {

        useEffect(() => {
            document.title = 'PresCheck - Gestão de Aulas';
        }, []);

    };

    return (
        <>
            <AulasProf />

        </>
    )


}