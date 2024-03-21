import express, { Request, Response } from "express";
import { db } from "../models/database";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  try {
    const rows = db.prepare("SELECT * FROM Respostas").all();
    res.send(rows);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

//  resposta específica por ID
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const row = db.prepare("SELECT * FROM Respostas WHERE id = ?").get(id);
    if (!row) {
      res.status(404).send("Resposta não encontrada");
    } else {
      res.send(row);
    }
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

router.post("/", (req: Request, res: Response) => {
  const { perguntaId, conteudo } = req.body;
  if (!perguntaId || !conteudo) {
    return res.status(400).send("Pergunta ID e conteúdo são obrigatórios");
  }
  try {
    const sql = db.prepare(
      "INSERT INTO Respostas(perguntaId, conteudo) VALUES (?, ?)"
    );
    const result = sql.run(perguntaId, conteudo);
    const id = result.lastInsertRowid;
    res.status(201).send({ id, perguntaId, conteudo });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { conteudo } = req.body;
  if (!conteudo) {
    return res.status(400).send("Conteúdo é obrigatório");
  }
  try {
    const updateResposta = db.prepare(`
        UPDATE Respostas
        SET conteudo = ?
        WHERE id = ?;
      `);
    const result = updateResposta.run(conteudo, id);
    if (result.changes > 0) {
      res.status(200).send({ id, conteudo });
    } else {
      res.status(404).send("Resposta não encontrada");
    }
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleteResposta = db.prepare(`
        DELETE FROM Respostas
        WHERE id = ?;
      `);
    const result = deleteResposta.run(id);
    if (result.changes > 0) {
      res
        .status(200)
        .send({ success: true, message: "Resposta deletada com sucesso", id });
    } else {
      res.status(404).send("Resposta não encontrada");
    }
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

export default router;
