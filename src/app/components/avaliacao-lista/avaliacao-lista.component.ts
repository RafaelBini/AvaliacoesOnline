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

  @Input() avaliacoes: Array<Avaliacao>;
  @Input() tipoAcesso;

  constructor(public comumService: ComumService) { }

  ngOnInit(): void {
    this.avaliacoesFiltradas = this.avaliacoes;
    this.selecionarStatusTabAdequada();
  }


  getStatusPorPrioridade() {
    return this.comumService.statusAvaliacao.concat().sort((a, b) => b.prioridade - a.prioridade);
  }
  getAvaliacoesNoStatus(status) {
    return this.avaliacoesFiltradas.concat().filter(avaliacao => avaliacao.status == status && (!avaliacao.isArquivada || this.mostrarArquivadas));
  }
  selecionarStatusTabAdequada() {
    for (let status of this.comumService.statusAvaliacao) {
      if (this.avaliacoesFiltradas.concat().filter(ava => ava.status == status.id && (!ava.isArquivada || this.mostrarArquivadas)).length > 0) {
        this.selectedStatusTab = status.id;
        return;
      }
    }
  }
  onBuscaKeyUp(texto: string) {
    this.avaliacoesFiltradas = this.avaliacoes.filter(avaliacao => {

      if (avaliacao.isArquivada && !this.mostrarArquivadas)
        return false;

      texto = this.comumService.normalizar(texto);

      for (let parteTexto of texto.split(" ")) {
        var titulo = this.comumService.normalizar(avaliacao.titulo);
        var descricao = this.comumService.normalizar(avaliacao.descricao);

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
    return this.avaliacoesFiltradas.concat().filter(avaliacao => (!avaliacao.isArquivada || this.mostrarArquivadas));
  }


}
