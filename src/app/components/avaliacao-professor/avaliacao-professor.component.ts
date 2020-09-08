import { ComumService } from './../../services/comum.service';
import { UrlNode } from './../../models/url-node';
import { Avaliacao } from 'src/app/models/avaliacao';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-avaliacao-professor',
  templateUrl: './avaliacao-professor.component.html',
  styleUrls: ['./avaliacao-professor.component.css']
})
export class AvaliacaoProfessorComponent implements OnInit {

  public textoFiltroAlunos = "";
  public alunosFiltrados = [];
  public professor = {
    alunos: [
      { email: "godo@gmail.com", senha: '', nome: "Godofredo", tags: ['Web II', 'Interação Humano Computador'], online: false },
      { email: "rub@gmail.com", senha: '', nome: "Ruberlinda", tags: ['Web II', 'Interação Humano Computador'] },
      { email: "cdnleon@outlook.com", senha: '', nome: "Leon Martins", tags: ['Web II', 'Interação Humano Computador'] },
      { email: "nil@gmail.com", senha: '', nome: "Nilce Moretto", tags: ['Web II', 'Interação Humano Computador'] },
      { email: "fredb12@hotmail.com", senha: '', nome: "Fred Desimpedidos", tags: ['Web II', 'Interação Humano Computador'] },
      { email: "marilia@gmail.com", senha: '', nome: "Marília Galvão", tags: ['Web II', 'Interação Humano Computador'] },
      { email: "bueno@gmail.com", senha: '', nome: "Galvão Bueno", tags: ['Web II', 'Interação Humano Computador'] },
      { email: "alanzoka@hotmail.com", senha: '', nome: "Alan Ferreira", tags: ['Web II', 'Interação Humano Computador'] },
      { email: "balga@outlook.com", senha: '', nome: "Mari Balga", tags: ['LPOO II', 'DAC'] },
      { email: "clone@gmail.com", senha: '', nome: "Henrique Grosse", tags: ['Empreendedorismo e Inovação', 'Gestão Empresarial'] },
    ]
  };


  public avaliacao: any = {
    titulo: "Avaliação 01",
    descricao: "Essa é uma avaliação criada para testes.",
    alunos: [
      { email: "fredb12@hotmail.com", senha: '', nome: "Fred Desimpedidos", tags: ['Web II', 'Interação Humano Computador'], statusId: 2 },
      { email: "marilia@gmail.com", senha: '', nome: "Marília Galvão", tags: ['Web II', 'Interação Humano Computador'], statusId: 2 },
      { email: "bueno@gmail.com", senha: '', nome: "Galvão Bueno", tags: ['Web II', 'Interação Humano Computador'], statusId: 3 },
      { email: "rafaelbini@hotmail.com", senha: '', nome: "Rafael Bini", statusId: 3 },
    ],
    grupos: [
      {
        numero: 1,
        instanciaStatusId: 0,
        alunos: []
      }
    ],
    tipoCorrecao: 0,
    tipoDisposicao: 1,
    tipoPontuacao: 0,
  }

  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: `Avaliações`, url: `/professor/avaliacoes` },
    { nome: `${this.avaliacao.titulo}`, url: `#` },
  ];

  public scrolling = false;

  constructor(public route: ActivatedRoute, public comumService: ComumService) { }

  ngOnInit(): void {

    this.atualizarAlunosOnline();

  }

  // Parte 1 - Em Preparação

  addGrupo() {
    // TODO: Add uma instância

    this.avaliacao.grupos.push({ numero: this.avaliacao.grupos.length + 1, instanciaStatusId: 0, alunos: [] });

  }
  drop(event: CdkDragDrop<string[]>, onde: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (onde == 'grupo') {


        transferArrayItem(event.previousContainer.data,
          event.container.data,
          this.professor.alunos.indexOf(this.professor.alunos.filter(aluno => aluno.email == this.alunosFiltrados[event.previousIndex].email)[0]),
          event.currentIndex);
      }
      else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }

    }
    this.onBuscaAlunoKeyUp();
  }
  onBuscaAlunoKeyUp() {
    var texto = this.textoFiltroAlunos;

    this.professor.alunos.sort((a, b) => {
      if (a.online && !b.online) {
        return -1;
      }
      else if (!a.online && b.online) {
        return 1;
      }
      else {
        if (a.nome > b.nome) {
          return 1;
        }
        else {
          return -1;
        }
      }
    });

    this.alunosFiltrados = this.professor.alunos.filter(aluno => {

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
  atualizarAlunosOnline() {
    this.avaliacao.alunos.forEach(alunoOnline => {

      var estaEmUmGrupo = false;
      alunoOnline.online = true;

      this.avaliacao.grupos.forEach(grupo => {

        const ALUNOS_ENCONTRADOS = grupo.alunos.concat().filter(aluno => aluno.email == alunoOnline.email);

        if (ALUNOS_ENCONTRADOS.length > 0) {
          const ALUNO_ENCONTRADO_INDEX = grupo.alunos.indexOf(ALUNOS_ENCONTRADOS[0]);
          grupo.alunos[ALUNO_ENCONTRADO_INDEX].online = true;
          estaEmUmGrupo = true;
        }

      });

      if (!estaEmUmGrupo) {
        const ALUNOS_ENCONTRADOS = this.professor.alunos.concat().filter(aluno => aluno.email == alunoOnline.email);

        if (ALUNOS_ENCONTRADOS.length > 0) {
          const ALUNO_ENCONTRADO_INDEX = this.professor.alunos.indexOf(ALUNOS_ENCONTRADOS[0]);
          this.professor.alunos[ALUNO_ENCONTRADO_INDEX].online = true;
        }

        else {
          this.professor.alunos.push(alunoOnline);
        }
      }

    });

    this.onBuscaAlunoKeyUp();

  }
  scrollDown(element: HTMLElement) {
    this.scrolling = true;
    const interval = setInterval(() => {
      if (this.scrolling == false || element.scrollTop == element.scrollHeight) {
        clearInterval(interval);
      }
      else {
        element.scroll({
          top: (element.scrollTop + 7),
          left: 0,
        });
      }
    })
  }
  scrollUp(element) {

    this.scrolling = true;
    const interval = setInterval(() => {
      if (this.scrolling == false || element.scrollTop == 0) {
        clearInterval(interval);
      }
      else {
        element.scroll({
          top: (element.scrollTop - 7),
          left: 0,
        });
      }
    })
  }


}
