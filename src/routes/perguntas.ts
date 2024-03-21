import express, { Request, Response } from "express";
import { db } from "../models/database"; // Verifique se o caminho está correto!

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  try {
    const rows = db.prepare("SELECT * FROM Perguntas").all();
    res.send(rows);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const row = db.prepare("SELECT * FROM Perguntas WHERE id = ?").get(id);
    if (!row) {
      res.status(404).send("Pergunta não encontrada");
    } else {
      res.send(row);
    }
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

router.post("/", (req: Request, res: Response) => {
  const { titulo, descricao } = req.body;
  if (!titulo || !descricao) {
    res.status(400).send("Título e conteúdo são obrigatórios");
  } else {
    try {
      const slq = db.prepare(
        "INSERT INTO Perguntas(titulo, descricao) VALUES (?, ?)"
      );
      const result = slq.run(titulo, descricao);
      const id = result.lastInsertRowid;
      res.status(201).send({ id, titulo, descricao });
    } catch (err) {
      console.error((err as Error).message);
      res.status(500).send("Internal server error");
    }
  }
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { titulo, descricao } = req.body;
  if (!titulo || !descricao) {
    res.status(400).send("titulo and descricao are required");
  } else {
    try {
      const sql = db.prepare(
        "UPDATE Perguntas SET titulo = ?, descricao = ? WHERE id = ?"
      );
      const result = sql.run(titulo, descricao, id);
      if (result.changes) {
        res.status(200).send({ id, titulo, descricao });
      } else {
        res.status(404).send("Pergunta não encontrada");
      }
    } catch (err) {
      console.error((err as Error).message);
      res.status(500).send("Internal server error");
    }
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params; // Captura o id
  try {
    const sql = db.prepare("DELETE FROM Perguntas WHERE id = ?");
    const result = sql.run(id); // Executa a query

    if (result.changes) {
      res
        .status(200)
        .send({ sucess: true, message: "Pergunta deletada com sucesso.", id });
    } else {
      res
        .status(400)
        .send({ sucess: false, message: "Pergunta não encontrada" });
    }
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

export default router;
