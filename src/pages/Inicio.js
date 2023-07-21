import DashboardProfessor from "../components/DashboardProfessor";
import DashboardAdmin from "../components/DashboardAdmin";


export default function Inicio() {
  const sessionProfessor = localStorage.getItem('professor_id') === 'null' ? null : localStorage.getItem('professor_id');
  const sessionAdmin = localStorage.getItem('is_admin');

  return (
    <>
      { sessionAdmin ? <DashboardAdmin /> : null }

      { sessionAdmin && sessionProfessor !== null ? <hr className="mt-5 mb-4"/> : null}

      { sessionProfessor !== null ? <DashboardProfessor /> : null }

    </>
  )



}