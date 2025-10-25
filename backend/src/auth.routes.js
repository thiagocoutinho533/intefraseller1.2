import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { registerSchema, loginSchema, forgotSchema, resetSchema } from "./validators.js";
import { requireAuth } from "./auth.middleware.js";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();
const router = Router();

// helper pra token de reset
function randomToken(len = 48) {
  return randomBytes(len).toString("hex");
}

/* POST /api/auth/register */
router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    // verifica duplicado
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          ...(data.cpf ? [{ cpf: data.cpf.replace(/\D/g, "") }] : [])
        ]
      },
      select: { id: true }
    });

    if (existing) {
      return res.status(409).json({ message: "E-mail ou CPF já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        cpf: data.cpf ? data.cpf.replace(/\D/g, "") : null,
        phone: data.phone || null,
        email: data.email,
        passwordHash
      },
      select: { id: true, name: true, email: true }
    });

    return res.status(201).json({ user });
  } catch (err) {
    console.error("register error:", err);
    return res.status(400).json({ message: err?.message || "Dados inválidos" });
  }
});

/* POST /api/auth/login -> { token, user } */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      {},
      process.env.JWT_SECRET,
      { subject: user.id, expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(400).json({ message: err?.message || "Dados inválidos" });
  }
});

/* GET /api/auth/me */
router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
      phone: true,
      createdAt: true
    }
  });
  return res.json({ user });
});

/* POST /api/auth/forgot-password */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = forgotSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: "Se existir, enviamos instruções." });
    }

    const token = randomToken(48);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    // futuramente: enviar email com link reset-password?token=...
    return res.json({
      message: "Se existir, enviamos instruções.",
      token // devolvendo pro teste enquanto não tem e-mail
    });
  } catch (err) {
    console.error("forgot-password error:", err);
    return res.status(400).json({ message: err?.message || "Erro" });
  }
});

/* POST /api/auth/reset-password */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = resetSchema.parse(req.body);

    const entry = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!entry || entry.used || entry.expiresAt < new Date()) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true }
    });

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: entry.userId },
      data: { passwordHash }
    });

    return res.json({ message: "Senha alterada com sucesso" });
  } catch (err) {
    console.error("reset-password error:", err);
    return res.status(400).json({ message: err?.message || "Erro" });
  }
});

export default router;
