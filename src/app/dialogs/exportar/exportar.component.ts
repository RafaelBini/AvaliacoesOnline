import { FileService } from 'src/app/services/file.service';
import { Avaliacao } from './../../models/avaliacao';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComumService } from 'src/app/services/comum.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ProvaService } from 'src/app/services/prova.service';

@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.css']
})
export class ExportarComponent implements OnInit {

  public colunasOpcoes = ["Email", "Nome", "Tag ID", "ID Externo", "Nota", "Valor", "Presença"];
  public dados: string[][] = [];
  public layout: Layout = {
    colunas: [],
    temCabecalho: true,
  }


  constructor(
    private comumService: ComumService,
    private provaService: ProvaService,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public avaliacao: Avaliacao,
  ) { }

  ngOnInit(): void {

    this.provaService.corrigirProvas(this.avaliacao);

    var cookiePreferencias = this.getCookiePreferencias();
    if (cookiePreferencias != null) {
      this.layout = cookiePreferencias.layout;
      this.colunasOpcoes = cookiePreferencias.colunasOpcoes;
    }
    else {
      this.layout.colunas = this.colunasOpcoes;
    }

    this.receberDados();

  }

  onColunasAlteradas(layout: Layout) {
    this.layout.colunas = layout.colunas;
    this.receberDados();
  }

  setCookiePreferencias() {
    var preferencias = {
      layout: this.layout,
      colunasOpcoes: this.colunasOpcoes,
    }

    localStorage.setItem('preferencias_exportar_avaliacao', JSON.stringify(preferencias));
  }

  getCookiePreferencias() {
    return JSON.parse(localStorage.getItem('preferencias_exportar_avaliacao'));
  }

  baixarCSV() {

    this.setCookiePreferencias();

    this.receberDados();

    this.comumService.downloadCSV(this.dados, this.avaliacao.titulo);
  }

  baixarPDF() {
    this.fileService.makePDF('page', this.avaliacao.titulo, 'download');
  }

  receberDados() {
    this.dados = [];

    if (this.layout.temCabecalho) {
      this.dados.push(this.layout.colunas);
    }


    for (let grupo of this.avaliacao.grupos) {
      var nota = grupo.notaTotal;
      var valor = grupo.valorTotal;

      for (let aluno of grupo.alunos) {
        if (this.avaliacao.tipoDisposicao == 0) {
          nota = aluno.notaTotal;
          valor = aluno.valorTotal;
        }

        var alunoInfo: string[] = [];

        for (let coluna of this.layout.colunas) {
          switch (coluna.toLowerCase()) {
            case 'nome':
              alunoInfo.push(aluno.nome || "");
              break;
            case 'tag id':
              alunoInfo.push(aluno.tagIdExterno || "");
              break;
            case 'id externo':
              alunoInfo.push(aluno.idExterno || "");
              break;
            case 'nota':
              alunoInfo.push((nota || 0).toString());
              break;
            case 'valor':
              alunoInfo.push((valor || 0).toString());
              break;
            case 'presença':
              alunoInfo.push(aluno.statusId ? this.comumService.statusUsuarioProva[aluno.statusId].descricaoCurta : this.comumService.statusUsuarioProva[0].descricaoCurta)
              break;
            case 'email':
              alunoInfo.push(aluno.email || "");
              break;
          }
        }
        this.dados.push(alunoInfo);

      }
    }

    console.log(this.dados);
  }


}


interface Layout {
  temCabecalho: boolean;
  colunas: string[];
}