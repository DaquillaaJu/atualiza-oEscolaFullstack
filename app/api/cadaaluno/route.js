import db from "../../db/banco";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function validarDados(dados) {
  const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
  const serie = typeof dados.serie === "string" ? dados.serie.trim() : "";
  const ra = typeof dados.ra === "string" ? dados.ra.trim() : "";
  const idade = Number(dados.idade);

  if (!nome || !serie || !ra || !Number.isInteger(idade) || idade < 1 || idade > 120) {
    return null;
  }

  return { nome, idade, serie, ra };
}

function respostaErroBanco(error, acao) {
  if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return NextResponse.json({ error: "Este RA já está cadastrado." }, { status: 409 });
  }

  console.error(`Erro ao ${acao} aluno:`, error);
  return NextResponse.json(
    { error: `Não foi possível ${acao} o cadastro do aluno.` },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const alunos = db.prepare(
      "SELECT id_aluno, nome, idade, serie, ra FROM aluno ORDER BY nome"
    ).all();
    return NextResponse.json({ alunos });
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os alunos." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const dados = await request.json();
    const aluno = validarDados(dados);

    if (!aluno) {
      return NextResponse.json(
        { error: "Preencha nome, idade, série e RA com valores válidos." },
        { status: 400 }
      );
    }

    const resultado = db.prepare(
      "INSERT INTO aluno (nome, idade, serie, ra) VALUES (?, ?, ?, ?)"
    ).run(aluno.nome, aluno.idade, aluno.serie, aluno.ra);

    return NextResponse.json(
      {
        id: Number(resultado.lastInsertRowid),
        mensagem: "Aluno cadastrado com sucesso!",
      },
      { status: 201 }
    );
  } catch (error) {
    return respostaErroBanco(error, "salvar");
  }
}

export async function PUT(request) {
  try {
    const dados = await request.json();
    const idAluno = Number(dados.id_aluno);
    const aluno = validarDados(dados);

    if (!Number.isInteger(idAluno) || idAluno < 1 || !aluno) {
      return NextResponse.json(
        { error: "Informe um ID e dados válidos para o aluno." },
        { status: 400 }
      );
    }

    const resultado = db.prepare(
      "UPDATE aluno SET nome = ?, idade = ?, serie = ?, ra = ? WHERE id_aluno = ?"
    ).run(aluno.nome, aluno.idade, aluno.serie, aluno.ra, idAluno);

    if (resultado.changes === 0) {
      return NextResponse.json({ error: "Aluno não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ mensagem: "Aluno atualizado com sucesso!" });
  } catch (error) {
    return respostaErroBanco(error, "atualizar");
  }
}

export async function DELETE(request) {
  let idAluno = null;

  try {
    const { searchParams } = new URL(request.url);
    const idRecebido = searchParams.get("id");
    idAluno = Number(idRecebido);

    if (!Number.isInteger(idAluno) || idAluno < 1) {
      console.warn("[api/cadaaluno] ID inválido na exclusão.", { id: idRecebido });
      return NextResponse.json({ error: "Informe um ID de aluno válido." }, { status: 400 });
    }

    console.debug("[api/cadaaluno] Excluindo aluno.", { id_aluno: idAluno });
    const resultado = db.prepare("DELETE FROM aluno WHERE id_aluno = ?").run(idAluno);

    if (resultado.changes === 0) {
      console.warn("[api/cadaaluno] Aluno não encontrado para exclusão.", {
        id_aluno: idAluno,
      });
      return NextResponse.json({ error: "Aluno não encontrado." }, { status: 404 });
    }

    console.info("[api/cadaaluno] Aluno excluído.", { id_aluno: idAluno });
    return NextResponse.json({ mensagem: "Aluno excluído com sucesso!" });
  } catch (error) {
    console.error("[api/cadaaluno] Erro durante exclusão do aluno.", {
      id_aluno: idAluno,
      code: error.code,
      erro: error.message,
      error,
    });
    return respostaErroBanco(error, "excluir");
  }
}
