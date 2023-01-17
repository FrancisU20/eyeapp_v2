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
            <h1>Admin</h1>
            <br />
            <p>Bienvenido Administrador!</p>
            <br />
            <Link to="/usuarios">Módulo Usuarios</Link>
            <br />
            <div className="flexGrow">
                <button onClick={logout}>Cerrar Sesión</button>
            </div>
        </section>
    )
}

export default Home