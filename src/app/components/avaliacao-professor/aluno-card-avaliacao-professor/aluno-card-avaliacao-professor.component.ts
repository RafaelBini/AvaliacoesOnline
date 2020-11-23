import { TimeService } from './../../../services/time.service';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { Avaliacao } from './../../../models/avaliacao';
import { ComumService } from 'src/app/services/comum.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { DetalhesProvaComponent } from 'src/app/dialogs/detalhes-prova/detalhes-prova.component';

@Component({
  selector: 'app-aluno-card-avaliacao-professor',
  templateUrl: './aluno-card-avaliacao-professor.component.html',
  styleUrls: ['./aluno-card-avaliacao-professor.component.css']
})
export class AlunoCardAvaliacaoProfessorComponent implements OnInit {

  @Input() aluno;
  @Input() avaliacao: Avaliacao;
  @Input() grupoIndex: number;
  @Input() alunoIndex: number;

  constructor(
    private dialog: MatDialog,
    public comumService: ComumService,
    private timeService: TimeService,
    private avaliacaoService: AvaliacaoService,
  ) { }

  ngOnInit(): void {
  }

  abrirDetalhes(aluno: Usuario) {
    this.dialog.open(DetalhesProvaComponent, {
      data: aluno
    });
  }


  voltarStatusProva(grupoIndex, alunoIndex) {
    this.avaliacao.grupos[grupoIndex].alunos[alunoIndex].statusId = 2;

    this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaModificar => {
      avaliacaoParaModificar.grupos[grupoIndex].alunos[alunoIndex].statusId = this.avaliacao.grupos[grupoIndex].alunos[alunoIndex].statusId;
      return avaliacaoParaModificar;
    }, this.avaliacao.id);

    console.log("Professor retornou status de um aluno TRANSACAO");
  }
  bloquearProva(grupoIndex, alunoIndex) {
    this.avaliacao.grupos[grupoIndex].alunos[alunoIndex].statusId = 1;
    this.avaliacao.grupos[grupoIndex].alunos[alunoIndex].dtStatus = this.comumService.insertInArray(this.avaliacao.grupos[grupoIndex].alunos[alunoIndex].dtStatus, 1, this.timeService.getCurrentDateTime().toISOString());

    this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaModificar => {
      avaliacaoParaModificar.grupos[grupoIndex].alunos[alunoIndex].statusId = this.avaliacao.grupos[grupoIndex].alunos[alunoIndex].statusId;
      avaliacaoParaModificar.grupos[grupoIndex].alunos[alunoIndex].dtStatus = this.avaliacao.grupos[grupoIndex].alunos[alunoIndex].dtStatus;
      return avaliacaoParaModificar;
    }, this.avaliacao.id);

    console.log("Professor bloqueou a prova de um aluno TRANSACAO");
  }

}
