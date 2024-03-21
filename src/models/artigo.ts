//import db from "./database";

interface Artigo {
  id: number;
  titulo: string;
  conteudo: string;
  dataCriacao: Date; // Ou 'Date', dependendo de como você quer trabalhar com datas
  ultimaAtualizacao: Date; // Mesmo comentário sobre o tipo 'Date'
}

/*INSIRA UM ARTIGO AQUI
const insertArtigo = db.prepare(`
INSERT INTO Artigos (titulo, conteudo)
VALUES (?, ?);
`);

insertArtigo.run(
  "O que é sistema Operacional?",
  "Um sistema operacional é uma camada de software..."
); */
