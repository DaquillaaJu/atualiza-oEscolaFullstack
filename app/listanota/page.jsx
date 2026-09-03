'use client';

import { useState } from "react";
import Header from "../components/header";

export default function NotaAluno() {
    const [nomeAluno, setNomeAluno] = useState("");
    const [t1, setT1] = useState("");
    const [t2, setT2] = useState("");
    const [n1, setN1] = useState("");
    const [n2, setN2] = useState("");
    const [n3, setN3] = useState("");

    const [notas, setNotas] = useState([
        {
            id: 1,
            nomeAluno: "Julia Daquila",
            t1: 8.5,
            t2: 9.0,
            n1: 7.0,
            n2: 8.0,
            n3: 9.5,
        },
    ]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!nomeAluno) {
            alert("Informe o nome do aluno.");
            return;
        }

        const novaNota = {
            id: notas.length + 1,
            nomeAluno,
            t1,
            t2,
            n1,
            n2,
            n3,
        };

        setNotas([...notas, novaNota]);

        // limpa o formulário
        setNomeAluno("");
        setT1("");
        setT2("");
        setN1("");
        setN2("");
        setN3("");
    }

    return (
        <>
            <Header />
            <h2>Lançamento de Notas</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome do Aluno</label>
                    <input
                        type="text"
                        value={nomeAluno}
                        onChange={(e) => setNomeAluno(e.target.value)}
                        placeholder="Nome do aluno"
                    />
                </div>

                <div>
                    <label>Trabalho 1 (T1)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={t1}
                        onChange={(e) => setT1(e.target.value)}
                        placeholder="T1"
                    />
                </div>

                <div>
                    <label>Trabalho 2 (T2)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={t2}
                        onChange={(e) => setT2(e.target.value)}
                        placeholder="T2"
                    />
                </div>

                <div>
                    <label>Nota 1 (N1)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={n1}
                        onChange={(e) => setN1(e.target.value)}
                        placeholder="N1"
                    />
                </div>

                <div>
                    <label>Nota 2 (N2)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={n2}
                        onChange={(e) => setN2(e.target.value)}
                        placeholder="N2"
                    />
                </div>

                <div>
                    <label>Nota 3 (N3)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={n3}
                        onChange={(e) => setN3(e.target.value)}
                        placeholder="N3"
                    />
                </div>

                <button type="submit">Salvar Nota</button>
            </form>

            <h2>Notas Lançadas</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>T1</th>
                        <th>T2</th>
                        <th>N1</th>
                        <th>N2</th>
                        <th>N3</th>
                    </tr>
                </thead>

                <tbody>
                    {notas.map((nota) => (
                        <tr key={nota.id}>
                            <td>{nota.id}</td>
                            <td>{nota.nomeAluno}</td>
                            <td>{nota.t1}</td>
                            <td>{nota.t2}</td>
                            <td>{nota.n1}</td>
                            <td>{nota.n2}</td>
                            <td>{nota.n3}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}