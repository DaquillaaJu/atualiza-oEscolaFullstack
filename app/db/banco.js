import Database from 'better-sqlite3';

const db = new Database('exemplo.db');

db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS aluno (
    id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    idade INTEGER NOT NULL,
    serie TEXT NOT NULL,
    ra TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS notas (
    id_nota INTEGER PRIMARY KEY AUTOINCREMENT,
    trabalho1 REAL NOT NULL,
    trabalho2 REAL NOT NULL,
    trabalho3 REAL NOT NULL DEFAULT 0,
    nota1 REAL NOT NULL,
    nota2 REAL NOT NULL,
    nota3 REAL NOT NULL,
    aluno_id INTEGER NOT NULL REFERENCES aluno(id_aluno) ON DELETE CASCADE
);
`);

const colunasNotas = db.prepare('PRAGMA table_info(notas)').all();
if (!colunasNotas.some((coluna) => coluna.name === 'trabalho3')) {
  db.exec('ALTER TABLE notas ADD COLUMN trabalho3 REAL NOT NULL DEFAULT 0');
}

console.log('Banco de dados criado com sucesso!');
export default db;
