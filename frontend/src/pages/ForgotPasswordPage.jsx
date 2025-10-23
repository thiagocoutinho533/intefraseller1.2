import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(""); setErr(""); setLoading(true);
    try {
      const r = await requestPasswordReset(email.trim());
      setMsg(r?.message || "Se o e-mail existir, enviamos instruções de reset.");
    } catch (e) {
      setErr(e?.response?.data?.message || "Não foi possível enviar o e-mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth:420, margin:"60px auto", padding:24}}>
      <h2>Recuperar senha</h2>
      <form onSubmit={handleSubmit}>
        <label>E-mail</label>
        <input type="email" className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        {msg && <p style={{color:"green"}}>{msg}</p>}
        {err && <p style={{color:"crimson"}}>{err}</p>}
        <button disabled={loading} type="submit">{loading?"Enviando...":"Enviar instruções"}</button>
      </form>
      <div style={{marginTop:12}}><Link to="/login">Voltar ao login</Link></div>
      <style>{`.input{width:100%;margin:6px 0 12px;padding:10px;border:1px solid #ddd;border-radius:8px}
      button{width:100%;padding:10px;border:0;background:#6c757d;color:#fff;border-radius:8px;cursor:pointer}`}</style>
    </div>
  );
}
