import { AjudaComponent } from 'src/app/dialogs/ajuda/ajuda.component';
import { MatDialog } from '@angular/material/dialog';
import { CredencialService } from './../../services/credencial.service';
import { Avaliacao } from './../../models/avaliacao';
import { Questao } from './../../models/questao';
import { ComumService } from './../../services/comum.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProvaService } from 'src/app/services/prova.service';

@Component({
  selector: 'app-questao-card',
  templateUrl: './questao-card.component.html',
  styleUrls: ['./questao-card.component.css']
})
export class QuestaoCardComponent implements OnInit {

  @Input() questao: Questao;
  @Output() houveAlteracoes = new EventEmitter<void>();

  constructor(
    public comumService: ComumService,
    public credencialService: CredencialService,
    public provaService: ProvaService,
    public usuarioService: UsuarioService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log(this.questao);
  }

  notificarAlteracoes() {
    this.houveAlteracoes.emit();
  }

  arquivar() {
    if (!this.credencialService.loggedUser.questoesHashArquivadas)
      this.credencialService.loggedUser.questoesHashArquivadas = [];

    this.credencialService.loggedUser.questoesHashArquivadas.push(this.provaService.getQuestaoHash(this.questao));
    this.usuarioService.update(this.credencialService.loggedUser);
    this.notificarAlteracoes();
  }

  desarquivar() {
    if (!this.credencialService.loggedUser.questoesHashArquivadas)
      return;

    this.credencialService.loggedUser.questoesHashArquivadas = this.credencialService.loggedUser.questoesHashArquivadas.filter(hash => hash != this.provaService.getQuestaoHash(this.questao));
    this.usuarioService.update(this.credencialService.loggedUser);
    this.notificarAlteracoes();
  }

  isArquivada(): boolean {
    if (this.credencialService.loggedUser.questoesHashArquivadas)
      return this.credencialService.loggedUser.questoesHashArquivadas.includes(this.provaService.getQuestaoHash(this.questao))
    return false
  }

  async publicar() {
    this.questao.isPublica = true;
    var prova = await this.provaService.getProvaFromId(this.questao.avaliacao.provaGabarito);
    const questaoIndex = prova.questoes.findIndex(q => this.provaService.getQuestaoHash(q) == this.provaService.getQuestaoHash(this.questao));
    if (questaoIndex < 0)
      return;
    prova.questoes[questaoIndex].isPublica = true;
    this.provaService.updateProva(prova);
    this.notificarAlteracoes();
  }

  async despublicar() {
    this.questao.isPublica = false;
    var prova = await this.provaService.getProvaFromId(this.questao.avaliacao.provaGabarito);
    const questaoIndex = prova.questoes.findIndex(q => this.provaService.getQuestaoHash(q) == this.provaService.getQuestaoHash(this.questao));
    if (questaoIndex < 0)
      return;
    prova.questoes[questaoIndex].isPublica = false;
    this.provaService.updateProva(prova);
    this.notificarAlteracoes();
  }

  isMinha(): boolean {
    return this.questao.avaliacao.professorId == this.credencialService.getLoggedUserIdFromCookie();

  }

  abrirAjudaQuestaoPublica() {
    this.dialog.open(AjudaComponent, {
      data: {
        titulo: `Questão Pública`,
        mensagem: `As questões marcadas como "Questão Pública" foram criadas por outros professores que decidiram publicar questões para outros professores.<br /><br />
        Você pode fazer isso também! Basta clicar nos três pontos de <i>Mais Opções</i> em uma questão e em seguida clicar em <b>Publicar Questão</b>.<br /><br />
        Quando alguém adiciona uma questão pública de outro professor, uma nova questão é criada. A questão pública do outro professor permanece intacta.`
      }
    });
  }

}
