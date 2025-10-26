import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenGerado, setTokenGerado] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMsg("");
    setTokenGerado("");

    if (!email.trim()) {
      setErro("Informe seu e-mail");
      return;
    }

    try {
      setLoading(true);
      const resp = await requestPasswordReset(email);
      // resp esperado: { message: "...", token: "..." }
      setMsg(resp.message || "Se existir conta, enviamos instruções.");
      if (resp.token) {
        setTokenGerado(resp.token);
      }
    } catch (err) {
      setErro(err.message || "Erro ao solicitar redefinição");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "4rem auto" }}>
      <h1>Esqueci minha senha</h1>
      <p style={{ color: "#555", fontSize: "0.95rem" }}>
        Digite seu e-mail e nós vamos gerar um link/token de recuperação.
      </p>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "1rem" }}>
          E-mail
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {erro && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {erro}
          </div>
        )}

        {msg && (
          <div style={{ color: "green", marginBottom: "1rem" }}>
            {msg}
          </div>
        )}

        {tokenGerado && (
          <div
            style={{
              background: "#f8f9fa",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "0.8rem",
              padding: "0.5rem",
              wordBreak: "break-all",
              marginBottom: "1rem",
            }}
          >
            Token de teste (copie isso para resetar senha): <br />
            <strong>{tokenGerado}</strong>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            width: "100%",
            fontSize: "1rem",
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Enviando..." : "Enviar instruções"}
        </button>
      </form>

      <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        <Link to="/login">Voltar para login</Link>
      </div>
    </div>
  );
}
