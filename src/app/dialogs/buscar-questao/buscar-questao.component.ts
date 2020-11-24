import { ComumService } from './../../services/comum.service';
import { ProvaService } from './../../services/prova.service';
import { CredencialService } from './../../services/credencial.service';

import { Questao } from './../../models/questao';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prova } from 'src/app/models/prova';

@Component({
  selector: 'app-buscar-questao',
  templateUrl: './buscar-questao.component.html',
  styleUrls: ['./buscar-questao.component.css']
})
export class BuscarQuestaoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BuscarQuestaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snack: MatSnackBar,
    private credencialService: CredencialService,
    private provaService: ProvaService,
    public comumService: ComumService,
  ) { }

  public questoes = [];

  questoesFiltradas = [];

  filtroNivelDificuldade: number = -1;
  filtroTermoPesquisado: string;

  ngOnInit(): void {

    this.provaService.geProvasFromProfessor(this.credencialService.getLoggedUserIdFromCookie()).then(provas => {
      for (let prova of provas) {
        if (!prova.isGabarito || prova.id == this.credencialService.getLoggedUserIdFromCookie())
          continue;

        var avaliacao = this.data.minhasAvaliacoes.filter(a => a.provaGabarito == prova.id)[0];

        if (avaliacao == null) {
          avaliacao = {
            titulo: 'Avaliação Excluida'
          }
        }

        for (let questao of prova.questoes) {
          this.questoes.push({
            q: questao,
            avaliacao: avaliacao,
          });
        }
      }
      this.removerQuestoesDuplicadas();
      this.questoesFiltradas = this.questoes;
    }).catch(reason => { });
  }

  removerQuestoesDuplicadas() {
    for (let questao of this.questoes) {
      var count = 0;
      var hash1 = this.provaService.getQuestaoHash(questao.q);

      for (let [index, questao2] of this.questoes.entries()) {
        var hash2 = this.provaService.getQuestaoHash(questao2.q);
        if (hash1 == hash2) {
          count++;
        }
        if (count >= 2) {
          this.questoes.splice(index, 1);
          count = 1;
        }
      }

    }
  }

  isQuestaoPermitida(questao: Questao) {
    if (this.comumService.precisaDeCorrecaoAutomatica(this.data.avaliacao) && !this.comumService.questaoTipos[questao.tipo].temCorrecaoAutomatica)
      return false;
    return true;
  }


  add(index) {

    var questaoParaAdicionar = this.questoesFiltradas[index].q;
    if (this.isQuestaoPermitida(questaoParaAdicionar)) {
      questaoParaAdicionar = this.questoesFiltradas.splice(index, 1)[0].q;
      this.data.prova.questoes.push(questaoParaAdicionar);
      this.snack.open("Questão adicionada", null, {
        duration: 3000
      });
    }
    else {
      this.snack.open("A questão deve ser de correção automática!", null, {
        duration: 3000
      });
    }


  }

  filtrarQuestoes() {

    this.questoesFiltradas = this.questoes;

    if (this.filtroTermoPesquisado != "" && this.filtroTermoPesquisado != null) {

      const TERMO_NORMALIZADO = this.comumService.normalizar(this.filtroTermoPesquisado);

      this.questoesFiltradas = this.questoes.filter(questao => {
        if (this.comumService.normalizar(questao.q.pergunta).includes(TERMO_NORMALIZADO))
          return true;
        else if (this.comumService.normalizar(questao.avaliacao.titulo).includes(TERMO_NORMALIZADO))
          return true;
        for (let tag of questao.q.tags) {
          if (this.comumService.normalizar(tag).includes(TERMO_NORMALIZADO))
            return true;
        };
        return false;
      });

    }

    if (this.filtroNivelDificuldade >= 0 && this.filtroNivelDificuldade <= 4) {
      this.questoesFiltradas = this.questoesFiltradas.filter(questao => questao.q.nivelDificuldade == this.filtroNivelDificuldade)
    }

  }


}
