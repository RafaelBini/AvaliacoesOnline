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

  constructor() { }

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
