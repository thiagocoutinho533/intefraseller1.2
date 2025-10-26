// src/services/api.js

// URL base da API no servidor
// Em produção, sua API está atrás do Nginx em /api
// então a base pública é só "/api"
export const API_URL = "/api";

// helper pra fazer requisições autenticadas
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // opcionalmente já tenta parsear JSON
  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    // se não vier json, data fica null
  }

  // se não deu certo, dispara erro
  if (!res.ok) {
    throw new Error(
      data?.message ||
        `Erro HTTP ${res.status} - ${res.statusText}`
    );
  }

  return data;
}
