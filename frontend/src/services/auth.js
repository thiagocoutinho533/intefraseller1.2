import { API_URL } from "./api";

// salva token + user no localStorage
export function setSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  // considera autenticado se tiver token salvo
  const token = getToken();
  return !!token;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// ===== LOGIN =====
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Erro ao fazer login");
  }

  // backend retorna { token, user }
  setSession(data.token, data.user);

  return data;
}

// ===== REGISTER =====
export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Erro ao cadastrar");
  }

  // se o backend já devolver token/user no cadastro você já loga
  if (data?.token && data?.user) {
    setSession(data.token, data.user);
  }

  return data;
}

// ===== FORGOT PASSWORD =====
export async function requestPasswordReset(email) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Erro ao solicitar redefinição");
  }

  // backend hoje devolve { message, token }
  return data;
}

// ===== RESET PASSWORD =====
export async function resetPassword(token, password, confirmPassword) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      password,
      confirmPassword,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Erro ao trocar senha");
  }

  return data;
}
