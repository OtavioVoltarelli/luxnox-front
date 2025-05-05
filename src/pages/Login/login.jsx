import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logoescritapng from '../../assets/luxnox-logo-escrita.png'
import axios from "axios";
import CONFIG from "../../config";


    function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
        try {
            const response = await axios.post(`https://api.luxnox.com.br/auth/login`, {login, password} );
            const token = response.data.token;
            localStorage.setItem('token', token) //salva o token no localstorage
            navigate('/')
        } catch (error) {
            alert('Credenciais inválidas')
            console.error(error)
        }
    };

    
    return (
    <main className="login-container">
        <section className="login-box">
            <article className="logo">
                <img src={logoescritapng} alt="Logo da marca LuxNox" />
            </article>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <fieldset>

                    <div className="input-group">
                        <label htmlFor="login"></label>
                        <input
                        type="login"
                        id="login"
                        placeholder="LOGIN"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password"></label>
                        <input
                        type="password"
                        id="password"
                        placeholder="SENHA"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>

                    <div className="link-group">
                        <p>Esqueceu a senha?</p>
                    </div>
            
                    <button className="login-button" type="submit">Entrar</button>
                </fieldset>
            </form>
            </section>
    </main>
    );
    }

export default Login;
