import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: chame sua API de login aqui
    // const ok = await api.login({ email, senha });
    const ok = true; // MOCK

    if (ok) {
      navigate("/dashboard"); // vai para o Dashboard
    } else {
      alert("Credenciais inválidas");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <h3 className="mb-3 text-center">Entrar</h3>

          <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>

            <div className="text-center mt-3">
              <small>
                Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
