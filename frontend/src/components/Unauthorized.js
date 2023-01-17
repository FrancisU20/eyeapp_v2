import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate("/login");

    return (
        <section>
            <h1>Sin autorización</h1>
            <br />
            <p>Usted no tiene acceso a esta página.</p>
            <div className="flexGrow">
                <button onClick={goBack}>Regresar</button>
            </div>
        </section>
    )
}

export default Unauthorized