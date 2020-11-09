import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { ComumService } from './../../services/comum.service';
import { Component, Input, OnInit } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';

@Component({
  selector: 'app-avaliacao-lista',
  templateUrl: './avaliacao-lista.component.html',
  styleUrls: ['./avaliacao-lista.component.css']
})
export class AvaliacaoListaComponent implements OnInit {

  public agruparAvaliacoes = true;
  public mostrarArquivadas = false;
  public selectedStatusTab = 0;
  public avaliacoesFiltradas: Array<Avaliacao>;
  public textoBusca: string = "";

  @Input() avaliacoes: Array<Avaliacao>;
  @Input() tipoAcesso;

  constructor(public comumService: ComumService,
    private avaliacaoService: AvaliacaoService) { }

  ngOnInit(): void {
    if (this.tipoAcesso != 'professor') {
      this.mostrarArquivadas = true;
    }
    this.atualizarAvaliacoesFiltradas();

  }

  atualizarAvaliacoesFiltradas() {
    this.onBuscaKeyUp(this.textoBusca);
  }
  getStatusPorPrioridade() {
    return this.comumService.statusAvaliacao.concat().sort((a, b) => b.prioridade - a.prioridade);
  }
  getAvaliacoesNoStatus(status) {
    return this.avaliacoesFiltradas.concat().filter(avaliacao => avaliacao.status == status && (!this.avaliacaoService.isArquivada(avaliacao) || this.mostrarArquivadas));
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
    return this.avaliacoesFiltradas.concat().filter(avaliacao => (!this.avaliacaoService.isArquivada(avaliacao) || this.mostrarArquivadas));
  }
  toggleMostrarArquivadas() {
    this.mostrarArquivadas = !this.mostrarArquivadas;
    this.atualizarAvaliacoesFiltradas();
  }


}
