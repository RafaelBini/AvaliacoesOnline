import { UrlNode } from './../../models/url-node';
import { Avaliacao } from 'src/app/models/avaliacao';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-avaliacao-professor',
  templateUrl: './avaliacao-professor.component.html',
  styleUrls: ['./avaliacao-professor.component.css']
})
export class AvaliacaoProfessorComponent implements OnInit {



  public grupos: Array<any> = [
    {
      numero: 1,
      alunos: []
    }
  ];

  public alunos: Array<any> = [
    { nome: "Rafael Bini" },
    { nome: "Matheus Cabral" },
    { nome: "Gustavo Silva" },
    { nome: "Marcos Almeida" },
  ];

  public avaliacao: any = {
    titulo: "Avaliação 01",
    descricao: "Essa é uma avaliação criada para testes.",
  }

  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: `Avaliações`, url: `/professor/avaliacoes` },
    { nome: `${this.avaliacao.titulo}`, url: `#` },
  ];

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {

  }

  addGrupo() {
    this.grupos.push({ numero: this.grupos.length + 1, alunos: [] });
  }


  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onDrag(event) {
    console.log(event);
  }

}
