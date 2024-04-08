import express, { NextFunction, Request, Response } from "express";
import artigosRouter from "./routes/artigos";
import perguntasRouter from "./routes/perguntas";
import respostasRouter from "./routes/respostas";
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware para fazer o parsing do corpo das requisições como JSON
app.use(express.json());
app.use(cors());
// Rotas relacionadas aos artigos
app.use("/artigos", artigosRouter);
app.use("/perguntas", perguntasRouter);
app.use("/respostas", respostasRouter);

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).send("Endpoint not found");
});

// Middleware para tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
