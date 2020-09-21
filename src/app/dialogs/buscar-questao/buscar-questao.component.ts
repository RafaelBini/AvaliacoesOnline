import { Avaliacao } from './../../models/avaliacao';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-buscar-questao',
  templateUrl: './buscar-questao.component.html',
  styleUrls: ['./buscar-questao.component.css']
})
export class BuscarQuestaoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BuscarQuestaoComponent>,
    @Inject(MAT_DIALOG_DATA) public avaliacao: Avaliacao, private snack: MatSnackBar, public comumService: ComumService) { }

  public questoes: Questao[] = [
    {
      pergunta: "Qual é a cor da grama?",
      tags: ["grama", "botânica"],
      tipo: 1,
      valor: 10,
      nivelDificuldade: 1,
      alternativas: [],
      resposta: "A cor da Grama é verde."
    },
    {
      pergunta: "Quanto é 2 + 2?",
      tags: ["matemática", "soma", "cálculo", "números"],
      tipo: 3,
      valor: 10,
      nivelDificuldade: 1,
      alternativas: [
        { texto: "1", selecionada: false },
        { texto: "2", selecionada: false },
        { texto: "3", selecionada: false },
        { texto: "4", selecionada: true },
      ]
    },
    {
      pergunta: "Por que o céu é azul?",
      tags: ["astronomia", "cores", "química"],
      tipo: 1,
      valor: 10,
      nivelDificuldade: 4,
      alternativas: [],
      resposta: "É a luz azul — que tem o comprimento mais curto — que se espalha mais por essas pequenas partículas, o que leva à coloração azulada que observamos.\nAvaliar a forma como explicou. Verificar se conhece (...)"
    },
    {
      pergunta: "Qual é o país mais populoso do mundo?",
      tags: ["geografia", "população", "conhecimentos gerais"],
      tipo: 1,
      valor: 10,
      nivelDificuldade: 3,
      alternativas: [],
      resposta: "O país mais populoso é a China."
    },
    {
      pergunta: "Quais são os nomes continentes do planeta Terra?",
      tags: ["geografia", "território"],
      tipo: 1,
      valor: 10,
      nivelDificuldade: 3,
      alternativas: [],
      resposta: "África, Ásia, Europa, Oceania, América e Antártida."
    },
  ];

  questoesFiltradas: Array<Questao>;

  filtroNivelDificuldade: number = -1;
  filtroTermoPesquisado: string;

  ngOnInit(): void {
    this.questoesFiltradas = this.questoes;
  }


  add(index) {
    var questaoParaAdicionar = this.questoesFiltradas.splice(index, 1);
    this.avaliacao.questoes.push(questaoParaAdicionar[0]);
    this.snack.open("Questão adicionada", null, {
      duration: 3000
    });

  }

  filtrarQuestoes() {

    this.questoesFiltradas = this.questoes;

    if (this.filtroTermoPesquisado != "" && this.filtroTermoPesquisado != null) {
      this.filtroTermoPesquisado = this.comumService.normalizar(this.filtroTermoPesquisado);
      this.questoesFiltradas = this.questoes.filter(questao => {
        if (this.comumService.normalizar(questao.pergunta).includes(this.filtroTermoPesquisado))
          return true;
        for (let tag of questao.tags) {
          if (this.comumService.normalizar(tag).includes(this.filtroTermoPesquisado))
            return true;
        };
        return false;
      });
    }

    if (this.filtroNivelDificuldade >= 0 && this.filtroNivelDificuldade <= 4) {
      this.questoesFiltradas = this.questoesFiltradas.filter(questao => questao.nivelDificuldade == this.filtroNivelDificuldade)
    }

  }


}
