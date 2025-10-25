import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./auth.routes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// rotas de autenticação / registro / login
app.use("/api/auth", authRoutes);

// porta
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API up on :${PORT}`);
});
