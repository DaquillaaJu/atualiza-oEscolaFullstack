import db from "../../db/banco";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SELECT_NOTAS = `
  SELECT notas.id_nota AS id,
         notas.trabalho1 AS t1,
         notas.trabalho2 AS t2,
         notas.trabalho3 AS t3,
         notas.nota1 AS n1,
         notas.nota2 AS n2,
         notas.nota3 AS n3,
         notas.aluno_id AS id_aluno,
         aluno.nome,
         aluno.ra
  FROM notas
  INNER JOIN aluno ON notas.aluno_id = aluno.id_aluno
  ORDER BY aluno.nome
`;

function validarDadosNota(dados) {
  const idAluno = Number(dados.id_aluno);
  const chaves = ["t1", "t2", "t3", "n1", "n2", "n3"];
  const valores = chaves.map((chave) => dados[chave]);

  if (
    !Number.isInteger(idAluno) ||
    idAluno < 1 ||
    valores.some((valor) => valor === "" || valor === null || !Number.isFinite(Number(valor)))
  ) {
    return null;
  }

  return { idAluno, valores: valores.map(Number) };
}

function alunoExiste(idAluno) {
  return Boolean(
    db.prepare("SELECT 1 FROM aluno WHERE id_aluno = ?").get(idAluno)
  );
}

// LISTAR NOTAS (GET /api/alunos)
export async function GET() {
  try {
    const notas = db.prepare(SELECT_NOTAS).all();
    return NextResponse.json({ notas });
  } catch (error) {
    console.error("Erro ao listar notas:", error);
    return NextResponse.json({ error: "Não foi possível listar as notas." }, { status: 500 });
  }
}

// CADASTRAR NOTA (POST /api/alunos)
export async function POST(request) {
  try {
    const dados = await request.json();
    const nota = validarDadosNota(dados);

    if (!nota) {
      return NextResponse.json(
        { error: "Informe um aluno e valores válidos para T1, T2, T3, N1, N2 e N3." },
        { status: 400 }
      );
    }

    if (!alunoExiste(nota.idAluno)) {
      return NextResponse.json({ error: "Aluno não encontrado." }, { status: 404 });
    }

    const resultado = db.prepare(
      `INSERT INTO notas (aluno_id, trabalho1, trabalho2, trabalho3, nota1, nota2, nota3)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(nota.idAluno, ...nota.valores);

    return NextResponse.json(
      { id: Number(resultado.lastInsertRowid), mensagem: "Nota cadastrada com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar nota:", error);
    return NextResponse.json({ error: "Não foi possível cadastrar a nota." }, { status: 500 });
  }
}

// ATUALIZAR NOTA (PUT /api/alunos?id=5)
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dados = await request.json();
    const id = Number(searchParams.get("id") ?? dados.id);
    const nota = validarDadosNota(dados);

    if (!Number.isInteger(id) || id < 1 || !nota) {
      return NextResponse.json(
        { error: "Informe um ID e valores válidos para a nota." },
        { status: 400 }
      );
    }

    if (!alunoExiste(nota.idAluno)) {
      return NextResponse.json({ error: "Aluno não encontrado." }, { status: 404 });
    }

    const resultado = db.prepare(
      `UPDATE notas
       SET aluno_id = ?, trabalho1 = ?, trabalho2 = ?, trabalho3 = ?,
           nota1 = ?, nota2 = ?, nota3 = ?
       WHERE id_nota = ?`
    ).run(nota.idAluno, ...nota.valores, id);

    if (resultado.changes === 0) {
      return NextResponse.json({ error: "Nota não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ mensagem: "Nota atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar nota:", error);
    return NextResponse.json({ error: "Não foi possível atualizar a nota." }, { status: 500 });
  }
}

// EXCLUIR NOTA (DELETE /api/alunos?id=5)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!Number.isInteger(id) || id < 1) {
      return NextResponse.json({ error: "Informe um ID de nota válido." }, { status: 400 });
    }

    const resultado = db.prepare("DELETE FROM notas WHERE id_nota = ?").run(id);

    if (resultado.changes === 0) {
      return NextResponse.json({ error: "Nota não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ mensagem: "Nota excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir nota:", error);
    return NextResponse.json({ error: "Não foi possível excluir a nota." }, { status: 500 });
  }
}
