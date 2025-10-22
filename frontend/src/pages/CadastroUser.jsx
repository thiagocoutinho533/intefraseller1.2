import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CadastroUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: chamar sua API para cadastrar
    // await api.cadastrar(form);
    navigate("/dashboard"); // após sucesso, vai para a Dashboard
  };

  return (
    <div className="container py-5">
      <h3 className="mb-3 text-center">Cadastro</h3>
      <form onSubmit={handleSubmit} className="card p-3 shadow-sm mx-auto" style={{ maxWidth: 480 }}>
        {/* ...inputs de nome/email/senha... */}
        <button className="btn btn-success w-100" type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
