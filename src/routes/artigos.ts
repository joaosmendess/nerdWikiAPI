import express, { Request, Response, Router } from "express";
import { db } from "../models/database";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  try {
    const rows = db.prepare("SELECT * FROM Artigos").all();
    res.send(rows);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params; // Captura o id
  try {
    const row = db.prepare("SELECT * FROM Artigos WHERE id = ?").get(id);
    if (!row) {
      res.status(404).send("Artigo não encontrado");
    } else {
      res.send(row);
    }
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

router.post("/", (req: Request, res: Response) => {
  const { titulo, conteudo } = req.body;
  if (!titulo || !conteudo) {
    res.status(400).send("Título e conteúdo são obrigatórios");
  } else {
    try {
      const sql = db.prepare(
        "INSERT INTO Artigos(titulo, conteudo) VALUES (?, ?)"
      );
      const result = sql.run(titulo, conteudo);
      const id = result.lastInsertRowid;
      res.status(201).send({ id, titulo, conteudo });
    } catch (err) {
      console.error((err as Error).message);
      res.status(500).send("Internal server error");
    }
  }
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { titulo, conteudo } = req.body;
  if (!titulo || !conteudo) {
    res.status(400).send("titulo and conteudo are required");
  } else {
    try {
      const sql = db.prepare(
        "UPDATE Artigos SET titulo = ?, conteudo = ? WHERE id = ?"
      );
      const result = sql.run(titulo, conteudo, id);
      if (result.changes) {
        res.status(200).send({ id, titulo, conteudo });
      } else {
        res.status(404).send("Artigo não encontrado");
      }
    } catch (err) {
      console.error((err as Error).message);
      res.status(500).send("Internal server error");
    }
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const sql = db.prepare("DELETE FROM Artigos WHERE id = ?");
    const result = sql.run(id); // Executa a query

    if (result.changes) {
      res
        .status(200)
        .send({ sucess: true, message: "Artigo deletado com sucesso.", id });
    } else {
      res.status(400).send({ sucess: false, message: "Artigo não encontrado" });
    }
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Internal server error");
  }
});

export default router;
