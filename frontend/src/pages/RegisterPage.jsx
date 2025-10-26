import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    // validações simples no front:
    if (!nome.trim()) return setErro("Informe seu nome");
    if (!email.trim()) return setErro("Informe seu e-mail");
    if (!senha.trim() || !confirmarSenha.trim())
      return setErro("Informe e confirme a senha");
    if (senha !== confirmarSenha)
      return setErro("As senhas não coincidem");

    try {
      setCarregando(true);

      // chama nossa função register do services/auth.js
      // OBS: backend atual espera { name, email, password }
      await register(nome, email, senha);

      // se deu certo, já salvou token/localStorage dentro do register()
      // agora manda o usuário pro dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErro(err.message || "Erro ao criar conta");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "4rem auto" }}>
      <h1>Criar conta</h1>

      <form onSubmit={handleSubmit}>
        {/* Nome */}
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Nome completo
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>

        {/* CPF */}
        <label style={{ display: "block", marginBottom: "1rem" }}>
          CPF (opcional)
          <input
            type="text"
            className="form-control"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
          />
        </label>

        {/* Telefone */}
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Telefone (opcional)
          <input
            type="tel"
            className="form-control"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(11) 90000-0000"
          />
        </label>

        {/* Email */}
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

        {/* Senha */}
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Senha
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {/* Confirmar senha */}
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Confirmar senha
          <input
            type="password"
            className="form-control"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {/* erro */}
        {erro && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {erro}
          </div>
        )}

        {/* botão */}
        <button
          type="submit"
          disabled={carregando}
          style={{
            backgroundColor: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            width: "100%",
            fontSize: "1rem",
            cursor: "pointer",
            opacity: carregando ? 0.6 : 1,
          }}
        >
          {carregando ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        Já tem conta?{" "}
        <Link to="/login">Entrar</Link>
      </div>
    </div>
  );
}
