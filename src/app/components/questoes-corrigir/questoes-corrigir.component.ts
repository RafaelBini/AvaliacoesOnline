import { GabaritoQuestaoComponent } from './../../dialogs/gabarito-questao/gabarito-questao.component';
import { ProvaService } from './../../services/prova.service';
import { Correcao } from './../../models/correcao';
import { CredencialService } from './../../services/credencial.service';
import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';
import { Prova } from 'src/app/models/prova';
import { Grupo } from 'src/app/models/grupo';
import { Usuario } from 'src/app/models/usuario';
import { TimeService } from 'src/app/services/time.service';


@Component({
  selector: 'app-questoes-corrigir',
  templateUrl: './questoes-corrigir.component.html',
  styleUrls: ['./questoes-corrigir.component.css']
})
export class QuestoesCorrigirComponent implements OnInit {
  @Input() avaliacao: Avaliacao;
  @Input() prova: Prova;
  @Input() gabarito: Prova;
  @Input() userTipo: string;
  @Input() visaoTipo: string;


  @Output() correcaoAlterada = new EventEmitter<void>();

  constructor(
    public comumService: ComumService,
    private credencialService: CredencialService,
    private provaService: ProvaService,
    private timeService: TimeService,
    private dialog: MatDialog,
    private elementRef: ElementRef) { }


  ngOnInit(): void {
  }


  // GERAL
  estaEmFoco(objetoDom): boolean {
    return objetoDom == document.activeElement;
  }
  ajustarAltura(event) {
    var paddingTop = parseFloat(event.target.style.paddingTop.replace("px", ""));
    var paddingBottom = parseFloat(event.target.style.paddingBottom.replace("px", ""));
    event.target.style.height = ""; event.target.style.height = (event.target.scrollHeight - (paddingTop + paddingBottom)) + "px";
  }
  getPontuacaoMaxima() {
    var pontuacaoMaxima = 0;
    this.prova.questoes.forEach(questao => {
      pontuacaoMaxima += questao.valor;
    });
    return pontuacaoMaxima;
  }
  sinalizarCorrecaoAlterada(questao: Questao) {
    questao.ultimaModificacao = this.timeService.getCurrentDateTime().getTime();
    this.correcaoAlterada.emit();
  }
  identificarQuestao(index: Number, questao: Questao) {
    return index;
  }
  inserirNotaMaxima(questao: Questao) {
    questao.correcaoProfessor.nota = questao.valor;
    this.sinalizarCorrecaoAlterada(questao);
  }
  inserirNotaMaximaAluno(questao: Questao, questaoIndex: number) {
    this.getMinhaCorrecao(questao, questaoIndex).nota = questao.valor;
    this.sinalizarCorrecaoAlterada(questao);
  }
  getMeuGrupoNaAvaliacao(): Grupo {
    for (let grupo of this.avaliacao.grupos) {
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie())
          return this.avaliacao.grupos[this.avaliacao.grupos.indexOf(grupo)];
      }
    }
    return {
      alunos: []
    }
  }
  getMinhaCorrecao(questao: Questao, questaoIndex: number): Correcao {

    var MINHA_PROVA_ID = null;

    if (this.avaliacao.tipoDisposicao != 0)
      MINHA_PROVA_ID = this.getMeuGrupoNaAvaliacao().provaId;
    else
      MINHA_PROVA_ID = this.getEuNaAvaliacao().provaId;

    // Busco minha correcao, e retorno-a
    for (var i = 0; i < questao.correcoes.length; i++) {
      if (questao.correcoes[i].avaliadorProvaId == MINHA_PROVA_ID)
        return questao.correcoes[i];
    }

    // Se não encontrei a minha correção mas tenho uma instância, insiro-me
    if (MINHA_PROVA_ID != null) {
      var questaoGabarito = this.gabarito.questoes[questaoIndex];
      questao.correcoes.push({
        avaliadorProvaId: MINHA_PROVA_ID,
        nota: 0,
        observacao: ""
      });
      return questao.correcoes[questao.correcoes.length - 1];
    }

    return null;

  }
  getGrupoFromProvaId(provaId: string) {
    for (let grupo of this.avaliacao.grupos) {
      if (grupo.provaId == provaId)
        return grupo;
    }
    return {
      alunos: []
    }
  }
  getAlunoFromProvaId(provaId: string) {
    for (let aluno of this.avaliacao.grupos[0].alunos) {
      if (aluno.provaId == provaId)
        return aluno;
    }
    return null;
  }
  getEuNaAvaliacao(): Usuario {
    for (let grupo of this.avaliacao.grupos) {
      var count = 0;
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie())
          return this.avaliacao.grupos[this.avaliacao.grupos.indexOf(grupo)].alunos[count];
        count++;
      }
    }
    return null;
  }
  abrirGabarito(questaoIndex: number) {
    this.dialog.open(GabaritoQuestaoComponent, {
      width: '70%',
      data: this.gabarito.questoes[questaoIndex]
    })
  }

  // ASSOCIACAO
  getAssociacoesOrdenadas(questaoIndex: number) {
    return this.gabarito.questoes[questaoIndex].associacoes.concat().sort((a, b) => a.texto > b.texto ? 1 : -1);
  }


  // ALTERNATIVAS
  desmarcarTudoMenosUma(questao: Questao, alternativaIndex: number, isEditavel: boolean) {
    if (questao.tipo != 4)
      return;
    for (var i = 0; i < questao.alternativas.length; i++) {
      if (i != alternativaIndex) {
        questao.alternativas[i].selecionada = false;
      }
    }
  }

  // DISSERTATIVAS
  isLocked(questao: Questao) {
    if (questao.usuarioUltimaModificacao == null) {
      return false;
    }
    return (questao.usuarioUltimaModificacao.id != this.credencialService.getLoggedUserIdFromCookie());
  }
  onDissertativaFocus(questao: Questao) {
    if (this.avaliacao.tipoDisposicao == 0)
      return;
    var usuario: Usuario = {
      id: this.credencialService.getLoggedUserIdFromCookie(),
      nome: this.credencialService.loggedUser.nome,
    }
    questao.usuarioUltimaModificacao = usuario;
    this.correcaoAlterada.emit();
  }
  onDissertativaBlur(questao: Questao) {
    if (this.avaliacao.tipoDisposicao == 0)
      return;
    questao.usuarioUltimaModificacao = null;
    this.correcaoAlterada.emit();
  }

  // PREENCHER
  getOpcoesPreencherAtivas(questao: Questao, questaoIndex: number) {
    return this.gabarito.questoes[questaoIndex].opcoesParaPreencher.concat().filter(opcao => opcao.ativa).sort((a, b) => a.opcaoSelecionada > b.opcaoSelecionada ? 1 : -1);
  }
  getPreenchimentoPartes(questao: Questao) {
    var texto = questao.textoParaPreencher;
    var textoSplitado = [];
    var partes = [];
    const SEPARADOR_RANDOMICO = `*#${Math.random()}#*`;
    const IDENTIFICADOR_RANDOMICO = `*#${Math.random()}#*`;
    for (var i = 0; i < questao.opcoesParaPreencher.length; i++) {
      if (questao.opcoesParaPreencher[i].ativa)
        texto = texto.replace(`(${i + 1})`, `${SEPARADOR_RANDOMICO + IDENTIFICADOR_RANDOMICO + (i + 1) + SEPARADOR_RANDOMICO}`);
    }

    textoSplitado = texto.split(SEPARADOR_RANDOMICO);

    textoSplitado.forEach(parte => {
      if (parte.includes(IDENTIFICADOR_RANDOMICO)) {
        partes.push({
          conteudo: parseInt(parte.replace(IDENTIFICADOR_RANDOMICO, "")) - 1,
          tipo: "select"
        });
        console.log(partes);
      }
      else {
        partes.push({
          conteudo: parte,
          tipo: "texto"
        });
      }
    });

    return partes;

  }


}
