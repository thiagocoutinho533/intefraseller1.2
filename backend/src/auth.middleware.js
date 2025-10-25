import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");
    if (!token) {
      return res.status(401).json({ message: "Token ausente" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}
