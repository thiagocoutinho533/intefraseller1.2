import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth:420, margin:"60px auto", padding:24}}>
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit}>
        <label>E-mail</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="input" />
        <label>Senha</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="input" />
        {err && <p style={{color:"crimson"}}>{err}</p>}
        <button disabled={loading} type="submit">{loading?"Entrando...":"Entrar"}</button>
      </form>
      <div style={{marginTop:12, display:"flex", gap:12}}>
        <Link to="/register">Criar conta</Link>
        <Link to="/forgot-password">Esqueci minha senha</Link>
      </div>
      <style>{`.input{width:100%;margin:6px 0 12px;padding:10px;border:1px solid #ddd;border-radius:8px}
      button{width:100%;padding:10px;border:0;background:#0d6efd;color:#fff;border-radius:8px;cursor:pointer}`}</style>
    </div>
  );
}
