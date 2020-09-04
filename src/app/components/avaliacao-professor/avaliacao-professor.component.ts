import { ComumService } from './../../services/comum.service';
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

  public textoFiltroAlunos = "";
  public alunosFiltrados = [];
  public alunos = [
    { email: "godo@gmail.com", nome: "Godofredo", matricula: "grr20178700", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "rub@gmail.com", nome: "Ruberlinda", matricula: "grr20181110", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "cdnleon@outlook.com", nome: "Leon Martins", matricula: "grr20194580", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "nil@gmail.com", nome: "Nilce Moretto", matricula: "grr20171234", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "fredb12@hotmail.com", nome: "Fred Desimpedidos", matricula: "grr20184658", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "marilia@gmail.com", nome: "Marília Galvão", matricula: "grr20167755", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "bueno@gmail.com", nome: "Galvão Bueno", matricula: "grr20184848", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "alanzoka@hotmail.com", nome: "Alan Ferreira", matricula: "grr20178452", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "balga@outlook.com", nome: "Mari Balga", matricula: "grr20196658", tags: ['LPOO II', 'DAC'] },
    { email: "clone@gmail.com", nome: "Henrique Grosse", matricula: "grr20184610", tags: ['Empreendedorismo e Inovação', 'Gestão Empresarial'] },
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

  constructor(public route: ActivatedRoute, public comumService: ComumService) { }

  ngOnInit(): void {
    this.alunosFiltrados = this.alunos;
  }

  // Parte 1 - Em Preparação

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
    this.onBuscaAlunoKeyUp();
  }
  onDrag(event) {
    console.log(event);
  }
  onBuscaAlunoKeyUp() {
    var texto = this.textoFiltroAlunos;
    this.alunosFiltrados = this.alunos.filter(aluno => {

      texto = this.comumService.normalizar(texto);
      var nome = this.comumService.normalizar(aluno.nome);
      var email = this.comumService.normalizar(aluno.email);

      if (nome.includes(texto))
        return true;

      if (email.includes(texto))
        return true;

      for (let parteTexto of texto.split(" ")) {
        if (nome.includes(parteTexto))
          return true;
      }

      if (aluno.tags != null) {
        for (let tag of aluno.tags) {
          if (this.comumService.normalizar(tag).includes(texto))
            return true;
        }
      }
      return false;
    });

  }

}
