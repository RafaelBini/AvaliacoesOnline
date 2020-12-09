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

  public questoes: Questao[] = [];
  public questoesFiltradas: Questao[] = [];
  public isQuestoesCarregadas: boolean = false;

  filtroNivelDificuldade: number = -1;
  filtroTermoPesquisado: string;
  filtroMostrarPublicas: boolean = true;
  filtroMostrarArquivadas: boolean = false;

  async ngOnInit() {
    try {
      this.questoes = await this.provaService.getQuestoesFromProfessor(this.credencialService.getLoggedUserIdFromCookie());
      this.filtrarQuestoes();
      this.isQuestoesCarregadas = true;
    }
    catch (reason) {
      console.error(reason);
    }

  }

  isQuestaoPermitida(questao: Questao) {
    if (this.comumService.precisaDeCorrecaoAutomatica(this.data.avaliacao) && !this.comumService.questaoTipos[questao.tipo].temCorrecaoAutomatica)
      return false;
    return true;
  }


  add(index) {

    var questaoParaAdicionar = this.questoesFiltradas[index];
    if (this.isQuestaoPermitida(questaoParaAdicionar)) {
      questaoParaAdicionar = this.questoesFiltradas.splice(index, 1)[0];
      delete questaoParaAdicionar.avaliacao;
      delete questaoParaAdicionar.isPublica;
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
        if (this.comumService.normalizar(questao.pergunta).includes(TERMO_NORMALIZADO))
          return true;
        else if (this.comumService.normalizar(questao.avaliacao.titulo).includes(TERMO_NORMALIZADO))
          return true;
        for (let tag of questao.tags) {
          if (this.comumService.normalizar(tag).includes(TERMO_NORMALIZADO))
            return true;
        };
        return false;
      });

    }

    if (this.filtroNivelDificuldade >= 0 && this.filtroNivelDificuldade <= 4) {
      this.questoesFiltradas = this.questoesFiltradas.filter(questao => questao.nivelDificuldade == this.filtroNivelDificuldade)
    }

    if (!this.filtroMostrarPublicas) {
      this.questoesFiltradas = this.questoesFiltradas.filter(questao => questao.avaliacao.professorId == this.credencialService.getLoggedUserIdFromCookie())
    }

    if (!this.filtroMostrarArquivadas && this.credencialService.loggedUser.questoesHashArquivadas) {
      this.questoesFiltradas = this.questoesFiltradas.filter(questao => !this.credencialService.loggedUser.questoesHashArquivadas.includes(this.provaService.getQuestaoHash(questao)))
    }

    this.questoesFiltradas.sort((a, b) => {
      if (a.avaliacao.professorId == this.credencialService.getLoggedUserIdFromCookie() && b.avaliacao.professorId != this.credencialService.getLoggedUserIdFromCookie()) {
        return -1;
      }
      else {
        return 1;
      }
    })

  }


}
