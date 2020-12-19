import { OrdenarAvaliacoesDialogComponent } from './../../dialogs/ordenar-avaliacoes-dialog/ordenar-avaliacoes-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { ComumService } from './../../services/comum.service';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';



@Component({
  selector: 'app-avaliacao-lista',
  templateUrl: './avaliacao-lista.component.html',
  styleUrls: ['./avaliacao-lista.component.css']
})
export class AvaliacaoListaComponent implements OnInit {

  public agruparAvaliacoes = (this.comumService.getWidth() > this.comumService.TAM_MOBILE);
  public mostrarArquivadas = false;
  public selectedStatusTab = 0;
  public avaliacoesFiltradas: Array<Avaliacao>;
  public textoBusca: string = "";
  public tipoOrdenacao: string = localStorage.getItem('avaliacoes-orderby') || 'status';

  @Input() avaliacoes: Array<Avaliacao>;
  @Input() tipoAcesso;




  constructor(
    public comumService: ComumService,
    private avaliacaoService: AvaliacaoService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.atualizarAvaliacoesFiltradas();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.agruparAvaliacoes = this.comumService.getWidth() > this.comumService.TAM_MOBILE;
  }

  atualizarAvaliacoesFiltradas() {
    this.onBuscaKeyUp(this.textoBusca);
  }
  getStatusPorPrioridade() {
    return this.comumService.statusAvaliacao.concat().sort((a, b) => b.prioridade - a.prioridade);
  }
  getAvaliacoesNoStatus(status) {
    return this.avaliacoesFiltradas.concat().filter(avaliacao => avaliacao.status == status && (!this.avaliacaoService.isArquivada(avaliacao) || this.mostrarArquivadas)).sort((a, b) => this.ordenarAvaliacoes(a, b));
  }
  selecionarStatusTabAdequada() {
    for (let status of this.comumService.statusAvaliacao) {
      if (this.avaliacoesFiltradas.concat().filter(ava => ava.status == status.id && (!this.avaliacaoService.isArquivada(ava) || this.mostrarArquivadas)).length > 0) {
        this.selectedStatusTab = status.id;
        return;
      }
    }
  }
  onBuscaKeyUp(texto: string) {
    this.avaliacoesFiltradas = this.avaliacoes.filter(avaliacao => {

      if (this.avaliacaoService.isArquivada(avaliacao) && !this.mostrarArquivadas)
        return false;

      texto = this.comumService.normalizar(texto);
      var titulo = this.comumService.normalizar(avaliacao.titulo);
      var descricao = this.comumService.normalizar(avaliacao.descricao);

      for (let parteTexto of texto.split(" ")) {


        const FOI_ENCONTRADO = this.estaEmAlgumLugar(parteTexto, titulo, descricao, avaliacao.tags);

        if (!FOI_ENCONTRADO)
          return false;

      }


      return true;
    });
    this.selecionarStatusTabAdequada();
  }
  estaEmAlgumLugar(parteTexto, titulo, descricao, tags) {

    // Titulo
    for (let parteTitulo of titulo.split(" ")) {
      if (parteTitulo.includes(parteTexto))
        return true;
    }

    // Descrição
    for (let parteDescricao of descricao.split(" ")) {
      if (parteDescricao.includes(parteTexto))
        return true;
    }

    // Tags
    if (tags != null) {
      for (let tag of tags) {
        if (this.comumService.normalizar(tag).includes(parteTexto))
          return true;
      }
    }
  }
  getTodasAvaliacoes() {
    return this.avaliacoesFiltradas.concat().filter(avaliacao => (!this.avaliacaoService.isArquivada(avaliacao) || this.mostrarArquivadas)).sort((a, b) => this.ordenarAvaliacoes(a, b));
  }
  toggleMostrarArquivadas() {
    this.mostrarArquivadas = !this.mostrarArquivadas;
    this.atualizarAvaliacoesFiltradas();
  }
  ordenarAvaliacoes(a: Avaliacao, b: Avaliacao): number {
    if (this.tipoOrdenacao == 'titulo') {
      if (a.titulo < b.titulo) return -1;
      else return 1;
    }
    else if (this.tipoOrdenacao == 'titulo-desc') {
      if (a.titulo < b.titulo) return 1;
      else return -1;
    }
    else if (this.tipoOrdenacao == 'status') {
      return a.status - b.status;
    }
    else if (this.tipoOrdenacao == 'status-desc') {
      return b.status - a.status;
    }
    else if (this.tipoOrdenacao == 'criacao-desc') {
      return new Date(a.dtCriacao).getTime() - new Date(b.dtCriacao).getTime();
    }
    else {
      return new Date(b.dtCriacao).getTime() - new Date(a.dtCriacao).getTime();
    }
  }
  abrirOrdenar() {
    var diagRef = this.dialog.open(OrdenarAvaliacoesDialogComponent, {
      data: this.tipoOrdenacao
    });
    diagRef.afterClosed().subscribe(tipo => {
      if (tipo) {
        this.tipoOrdenacao = tipo;
        localStorage.setItem('avaliacoes-orderby', tipo);
      }

    });
  }


}
