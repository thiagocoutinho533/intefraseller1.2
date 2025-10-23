import api from "./api";

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  // espera { token, user }
  localStorage.setItem("token", data.token);
  return data;
}

export async function registerUser(name, email, password) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data; // pode já logar após cadastro no submit
}

export async function requestPasswordReset(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token, password) {
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
