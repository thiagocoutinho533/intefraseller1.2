import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();
const app = express();


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || "*" // durante dev; em prod passe a URL do frontend
}));
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token not provided" });
  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Token error" });
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: "Token malformatted" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
}

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "E-mail já cadastrado" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    const token = generateToken(user);
    return res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Credenciais inválidas" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Credenciais inválidas" });
    const token = generateToken(user);
    const safeUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno" });
  }
});

app.get("/dashboard", authMiddleware, async (req, res) => {
  return res.json({ message: "Bem-vindo ao dashboard", user: req.user });
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});