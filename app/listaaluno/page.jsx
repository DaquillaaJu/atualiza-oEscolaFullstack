'use client';

import {useState} from "react";
import Header from "../components/header";

export default function ListaAluno() {
    return (
        <>
        <Header />
       <h2>Lista de alunos</h2>
       <table>
        <thead>
            <th>ID</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Série</th>
            <th>RA</th>
        </thead>

        <tbody>
            <tr>
                <td>1</td>
                <td>Julia Daquila</td>
                <td>18</td>
                <td>3A</td>
                <td>2918</td>
                
            </tr>
        </tbody>
       </table>
    
        </>
    )
}