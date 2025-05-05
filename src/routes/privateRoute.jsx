import { Navigate } from "react-router-dom"


function PrivateRoute({ children }) {
    const token = localStorage.getItem('token')

    if (!token) { // se nao tiver token redireciona para o login
        return <Navigate to="/login" replace />;
    }

    // se tiver token redireciona para a rota desejada normalmente
    return children
}

export default PrivateRoute;