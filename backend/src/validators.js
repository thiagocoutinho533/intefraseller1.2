import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  cpf: z.string().optional().transform(v => (v ? v.replace(/\D/g, "") : v)),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha mínima 6 caracteres"),
  confirmPassword: z.string().min(6, "Senha mínima 6 caracteres")
}).refine(data => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "As senhas não coincidem"
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const forgotSchema = z.object({
  email: z.string().email()
});

export const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
}).refine(d => d.password === d.confirmPassword, {
  path: ["confirmPassword"],
  message: "As senhas não coincidem"
});
