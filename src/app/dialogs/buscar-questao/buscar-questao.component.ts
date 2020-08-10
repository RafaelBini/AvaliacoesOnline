import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-buscar-questao',
  templateUrl: './buscar-questao.component.html',
  styleUrls: ['./buscar-questao.component.css']
})
export class BuscarQuestaoComponent implements OnInit {

  constructor(private snack: MatSnackBar) { }

  public questoes: any[] = [
    {
      pergunta: "Qual é a cor da grama?",
      tags: ["grama", "botânica"],
      tipo: 1,
      nivel: 1
    },
    {
      pergunta: "Quanto é 2 + 2?",
      tags: ["matemática", "soma", "cálculo", "números"],
      tipo: 1,
      nivel: 1
    },
    {
      pergunta: "Por que o céu é azul?",
      tags: ["astronomia", "cores", "química"],
      tipo: 1,
      nivel: 4
    },
    {
      pergunta: "Qual é o país mais populoso do mundo?",
      tags: ["geografia", "população", "conhecimentos gerais"],
      tipo: 1,
      nivel: 3
    },
    {
      pergunta: "Quais são os nomes continentes do planeta Terra?",
      tags: ["geografia", "território"],
      tipo: 1,
      nivel: 3
    },
  ];

  ngOnInit(): void {
  }

  getNivel(numero) {
    if (numero == 1) {
      return "Muito Fácil";
    }
    else if (numero == 2) {
      return "Fácil";
    }
    else if (numero == 3) {
      return "Médio";
    }
    else if (numero == 4) {
      return "Difícil";
    }
    else if (numero == 5) {
      return "Muito Difícil";
    }
    else {
      return "Indeterminado";
    }
  }

  add(index) {
    this.questoes.splice(index, 1);
    this.snack.open("Questão adicionada", null, {
      duration: 3000
    })
  }

}
