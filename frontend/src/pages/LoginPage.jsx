import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      await login(email, senha); // chama API e já salva no localStorage
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErro(err.message || "Erro ao entrar");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "4rem auto" }}>
      <h1>Entrar</h1>

      <form onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label style={{ marginTop: "1rem", display: "block" }}>
          Senha
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>

        {erro && (
          <div style={{ color: "red", marginTop: "0.5rem" }}>{erro}</div>
        )}

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            backgroundColor: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          Entrar
        </button>
      </form>

      <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        <Link to="/register" style={{ marginRight: "1rem" }}>
          Criar conta
        </Link>
        <Link to="/forgot-password">Esqueci minha senha</Link>
      </div>
    </div>
  );
}
