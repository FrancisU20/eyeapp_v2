import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        setAuth({});
        navigate('/login');
    }

    return (
        <section>
            <h1>Empleado</h1>
            <br />
            <p>Bienvenido Empleado!</p>
            <br />
            <Link to="/pacientes">Módulo Pacientes</Link>
            <br />
            <Link to="/diagnosticos">Modulo de Diagnostico</Link>
            <div className="flexGrow">
                <button onClick={logout}>Cerrar Sesión</button>
            </div>
        </section>
    )
}

export default Home