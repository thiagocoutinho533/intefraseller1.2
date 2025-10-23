import api from "./api";

const TOKEN_KEY = "token";

export function getToken() {
  const t = localStorage.getItem(TOKEN_KEY);
  if (!t || t === "undefined" || t === "null") return null;
  return t;
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email, password) {
  // espere que sua API /auth/login retorne { token, user }
  const { data } = await api.post("/auth/login", { email, password });
  if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export async function registerUser(name, email, password) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}

export async function requestPasswordReset(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token, password) {
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data;
}
