import { CredencialService } from './../../services/credencial.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Avaliacao } from 'src/app/models/avaliacao';
import { Usuario } from 'src/app/models/usuario';
import { ComumService } from 'src/app/services/comum.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-selecionar-alunos',
  templateUrl: './selecionar-alunos.component.html',
  styleUrls: ['./selecionar-alunos.component.css']
})
export class SelecionarAlunosComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public avaliacao: Avaliacao,
    private credencialService: CredencialService,
    private comumService: ComumService,
    private timeService: TimeService,
  ) { }

  textoBuscaAvaliacao: string;
  textoBusca: string;

  alunos: Array<Usuario> = [];
  alunosFiltrados: Array<Usuario> = [];
  alunosSelecionados: Array<Usuario> = [];

  alunosAvaliacaoFiltrados: Array<Usuario> = [];
  alunosAvaliacaoSelecionados: Array<Usuario> = [];

  ngOnInit(): void {
    this.onBuscaAlunoAvaliacaoKeyUp();
    this.onBuscaAlunoKeyUp();
  }

  // Meus Alunos
  onBuscaAlunoKeyUp() {
    this.alunos = this.getAlunosSemGrupo();
    this.alunosFiltrados = this.alunos.filter(aluno => {

      var texto = this.comumService.normalizar(this.textoBusca);
      var nome = this.comumService.normalizar(aluno.nome);
      var email = this.comumService.normalizar(aluno.email);

      for (let parteTexto of texto.split(" ")) {

        const FOI_ENCONTRADO = this.estaEmAlgumLugar(parteTexto, nome, email, aluno.tags);

        if (!FOI_ENCONTRADO)
          return false;

      }

      return true;

    });

  }
  selecionarTodos() {
    if (this.alunosFiltrados.length == this.alunosSelecionados.length) {
      this.alunosSelecionados = [];
    }
    else {
      this.alunosSelecionados = [];
      this.alunosFiltrados.forEach(aluno => {
        this.alunosSelecionados.push(aluno);
      })
    }

  }
  addGrupo() {
    this.avaliacao.grupos.push({ numero: this.avaliacao.grupos.length + 1, provaId: null, alunos: [] });
  }
  getAlunosSemGrupo() {

    var alunosSemDuplicados: Array<Usuario> = [];
    var alunosEmGrupos = this.getAlunosFromTodosGrupos();
    this.alunos = this.credencialService.loggedUser.alunos;

    for (let aluno of this.alunos) {
      var estaEmGrupo = false;
      for (let alunoEmGrupo of alunosEmGrupos) {
        if (aluno.id == alunoEmGrupo.id) {
          estaEmGrupo = true;
          break;
        }
      }
      if (!estaEmGrupo) {
        alunosSemDuplicados.push(aluno);
      }
    }
    return alunosSemDuplicados;
  }
  addSelecionadosParaAvaliacao() {
    for (let alunoSelecionado of this.alunosSelecionados) {

      // Seta status para 0
      alunoSelecionado.statusId = 0;
      alunoSelecionado.dtStatus = this.comumService.insertInArray(alunoSelecionado.dtStatus, 0, this.timeService.getCurrentDateTime().toISOString());

      // Passa por cada grupo
      var foiAlocado = false;
      for (let grupo of this.avaliacao.grupos) {
        if (grupo.alunos.length < this.avaliacao.maxIntegrantes) {
          grupo.alunos.push(alunoSelecionado);
          foiAlocado = true;
          break;
        }
      }

      // Se não consegui nenhum grupo,
      if (!foiAlocado) {
        // Cria um novo grupo
        this.addGrupo();
        // Entra nele        
        this.avaliacao.grupos[this.avaliacao.grupos.length - 1].alunos.push(alunoSelecionado);
      }
    }
    this.onBuscaAlunoAvaliacaoKeyUp();
    this.onBuscaAlunoKeyUp();
  }



  // Alunos da Avalaiação
  getAlunosFromTodosGrupos(): Array<Usuario> {
    var alunos: Array<Usuario> = [];
    for (let grupo of this.avaliacao.grupos) {
      for (let aluno of grupo.alunos) {
        alunos.push(aluno);
      }
    }
    return alunos;
  }
  onBuscaAlunoAvaliacaoKeyUp() {
    this.alunosAvaliacaoFiltrados = this.getAlunosFromTodosGrupos().filter(aluno => {

      var texto = this.comumService.normalizar(this.textoBuscaAvaliacao);
      var nome = this.comumService.normalizar(aluno.nome);
      var email = this.comumService.normalizar(aluno.email);

      for (let parteTexto of texto.split(" ")) {

        const FOI_ENCONTRADO = this.estaEmAlgumLugar(parteTexto, nome, email, aluno.tags);

        if (!FOI_ENCONTRADO)
          return false;

      }

      return true;

    });

  }
  selecionarTodosAlunosAvaliacao() {
    if (this.alunosAvaliacaoFiltrados.length == this.alunosAvaliacaoSelecionados.length) {
      this.alunosAvaliacaoSelecionados = [];
    }
    else {
      this.alunosAvaliacaoSelecionados = [];
      this.alunosAvaliacaoFiltrados.forEach(aluno => {
        this.alunosAvaliacaoSelecionados.push(aluno);
      })
    }

  }
  removerSelecionadosDaAvaliacao() {
    for (let grupo of this.avaliacao.grupos) {

      grupo.alunos = grupo.alunos.filter(a => this.alunosAvaliacaoSelecionados.filter(aa => aa.id == a.id).length <= 0);

    }
    this.onBuscaAlunoAvaliacaoKeyUp();
    this.onBuscaAlunoKeyUp();
  }

  // GERAL

  estaEmAlgumLugar(parteTexto, nome, email, tags) {

    // Nome
    for (let parteNome of nome.split(" ")) {
      if (parteNome.includes(parteTexto))
        return true;
    }

    // Descrição

    if (email.includes(parteTexto))
      return true;


    // Tags
    if (tags != null) {
      for (let tag of tags) {
        if (this.comumService.normalizar(tag).includes(parteTexto))
          return true;
      }
    }
  }



}
