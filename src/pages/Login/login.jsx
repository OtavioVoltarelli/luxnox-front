import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logoescritapng from '../../assets/luxnox-logo-escrita.png'


    function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
    e.preventDefault();

    // Simulação de login - Substituir por autenticação real depois
    if (email === "admin@grauecorte.com" && senha === "123456") {
        alert("Login realizado com sucesso!");
        navigate("/"); // Redireciona para a home após login
    } else {
        alert("E-mail ou senha incorretos!");
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
                        <label htmlFor="email"></label>
                        <input
                        type="email"
                        id="email"
                        placeholder="E-MAIL"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="senha"></label>
                        <input
                        type="password"
                        id="senha"
                        placeholder="SENHA"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
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
