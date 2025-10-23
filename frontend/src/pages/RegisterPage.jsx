import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, login } from "../services/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await registerUser(name.trim(), email.trim(), password);
      // opcional: já fazer login em seguida
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth:480, margin:"60px auto", padding:24}}>
      <h2>Criar conta</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome</label>
        <input value={name} onChange={e=>setName(e.target.value)} required className="input" />
        <label>E-mail</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="input" />
        <label>Senha</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} className="input" />
        {err && <p style={{color:"crimson"}}>{err}</p>}
        <button disabled={loading} type="submit">{loading?"Criando...":"Criar conta"}</button>
      </form>
      <div style={{marginTop:12}}><Link to="/login">Já tenho conta</Link></div>
      <style>{`.input{width:100%;margin:6px 0 12px;padding:10px;border:1px solid #ddd;border-radius:8px}
      button{width:100%;padding:10px;border:0;background:#198754;color:#fff;border-radius:8px;cursor:pointer}`}</style>
    </div>
  );
}
