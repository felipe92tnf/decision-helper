import express from "express";
import cors from "cors";
import decisionRoutes from "./routes/decision.routes";
import criterionRoutes from "./routes/criterion.routes";
import optionRoutes from "./routes/option.routes";
import scoreRoutes from "./routes/score.routes";

app.use("/api", scoreRoutes);
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

app.use("/api/decisions", decisionRoutes);
app.use("/api", criterionRoutes);
app.use("/api", optionRoutes);

export default app;