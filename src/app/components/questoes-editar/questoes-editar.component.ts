import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagemAmpliadaComponent } from './../../dialogs/imagem-ampliada/imagem-ampliada.component';
import { FileService } from './../../services/file.service';
import { Alternativa } from './../../models/alternativa';
import { Prova } from 'src/app/models/prova';

import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Input, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { InfoQuestaoComponent } from 'src/app/dialogs/info-questao/info-questao.component';
import { Arquivo } from 'src/app/models/arquivo';
import { TimeService } from 'src/app/services/time.service';



@Component({
  selector: 'app-questoes-editar',
  templateUrl: './questoes-editar.component.html',
  styleUrls: ['./questoes-editar.component.css']
})
export class QuestoesEditarComponent implements OnInit {
  @Input() prova: Prova;
  @Input() avaliacao: Avaliacao;

  @Output() algoAlterado = new EventEmitter<void>();

  constructor(public comumService: ComumService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private timeService: TimeService,
    private fileService: FileService,
  ) { }

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
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

  }
  tipoQuestaoChanged(questao, novoTipo) {
    questao.tipo = novoTipo;
    if (this.comumService.questaoTipos[novoTipo].nome == "Entrega") {
      this.tipoArquivoChanged(questao, 'Todos');
    }
  }
  openInfoQuestao(questao) {
    this.dialog.open(InfoQuestaoComponent, {
      width: '80%',
      data: questao
    });
  }
  getPontuacaoMaxima() {
    var pontuacaoMaxima = 0;
    this.prova.questoes.forEach(questao => {
      pontuacaoMaxima += (questao.valor || 0);
    });
    return pontuacaoMaxima;
  }
  getQuestaoTiposAdequados() {

    if (this.comumService.precisaDeCorrecaoAutomatica(this.avaliacao)) {
      return this.comumService.questaoTipos.concat().filter(tipo => tipo.temCorrecaoAutomatica);
    }
    return this.comumService.questaoTipos;
  }
  deletarQuestao(questaoIndex: number) {
    if (this.prova.questoes.length > 1)
      this.prova.questoes.splice(questaoIndex, 1);
  }
  marcarEdicao(questaoIndex: number) {
    for (var i = 0; i < this.prova.questoes.length; i++) {
      if (i != questaoIndex) {
        this.prova.questoes[i].isEditando = false;
      }
      else {
        this.prova.questoes[i].isEditando = true;
      }
    }
  }
  sinalizarAlteracao() {
    this.algoAlterado.emit();
  }

  // Alternativa
  removerAlternativa(questao: Questao, alternativaIndesejadaIndex) {
    if (questao.alternativas.length > 1)
      questao.alternativas.splice(alternativaIndesejadaIndex, 1);
    else {
      this.snack.open("Deve existir pelo menos uma alternativa", null, { duration: 3500 });
    }
  }
  addAlternativa(questao: Questao, tabelaAlternativas: HTMLElement) {
    questao.alternativas.push({ texto: '', selecionada: false });
    this.changeDetectorRef.detectChanges();
    (tabelaAlternativas.children[questao.alternativas.length - 1].children[0].children[0].children[0].children[1].children[1] as HTMLInputElement).focus();
  }
  onNovaAlterKeyUp(event, questao: Questao, tabelaAlternativas) {
    if (event.key == 'Enter' && event.ctrlKey) {
      this.addAlternativa(questao, tabelaAlternativas);
    }
  }
  desmarcarTudoMenosUma(questao: Questao, alternativaIndex: number, isEditavel: boolean) {
    if (questao.tipo != 4)
      return;
    for (var i = 0; i < questao.alternativas.length; i++) {
      if (i != alternativaIndex) {
        questao.alternativas[i].selecionada = false;
      }
    }
  }

  // Associacao
  removerAssociacao(questao, associacaoIndesejadaIndex) {
    questao.associacoes.splice(associacaoIndesejadaIndex, 1);
  }
  addAssociacao(questao, tabelaAssociacoes) {
    questao.associacoes.push({
      texto: '',
      opcaoSelecionada: '',
    });
    this.changeDetectorRef.detectChanges();

    (tabelaAssociacoes.children[questao.associacoes.length - 1].children[0].children[0].children[0] as HTMLInputElement).focus();
  }
  onNovaAssocKeyUp(event, questao, tabelaAssociacoes) {
    if (event.key == 'Enter' && event.ctrlKey) {
      this.addAssociacao(questao, tabelaAssociacoes);
    }
  }
  getAssociacoesOrdenadas(questao: Questao) {
    return questao.associacoes.concat().sort((a, b) => a.texto > b.texto ? 1 : -1);
  }

  // Envio de Arquivo
  tipoArquivoChanged(questao, tipo) {
    if (tipo == 'Todos') {
      questao.extensoes = [];
      this.comumService.arquivosPossiveis.forEach(arquivo => {
        arquivo.extensoes.forEach(extensao => {
          questao.extensoes.push(extensao)
        });
      });
    }
    else {
      questao.extensoes = this.comumService.arquivosPossiveis[tipo].extensoes;
    }
  }

  // PREENCHIMENTO / COMPLETAR
  inserirOpcaoPreeencherSelecionado(questao: Questao, editorElement) {
    const TRECHO_SELECIONADO = questao.textoParaPreencher.substring(editorElement.selectionStart, editorElement.selectionEnd);

    if (questao.opcoesParaPreencher[questao.opcoesParaPreencher.length - 1].opcaoSelecionada == '') {
      questao.opcoesParaPreencher[questao.opcoesParaPreencher.length - 1].opcaoSelecionada = TRECHO_SELECIONADO;
    }
    else {
      questao.opcoesParaPreencher.push({
        opcaoSelecionada: TRECHO_SELECIONADO,
        ativa: true
      });
    }

    questao.textoParaPreencher =
      questao.textoParaPreencher.substring(0, editorElement.selectionStart)
      + `(${questao.opcoesParaPreencher.length})` +
      questao.textoParaPreencher.substring(editorElement.selectionEnd, questao.textoParaPreencher.length);

    questao.partesPreencher = this.getPreenchimentoPartes(questao);
    this.algoAlterado.emit();
  }
  removerOpcaoPreencher(questao: Questao, opcaoPreencherIndesejadaIndex) {
    questao.opcoesParaPreencher[opcaoPreencherIndesejadaIndex].ativa = false;
    questao.partesPreencher = this.getPreenchimentoPartes(questao);
  }
  addOpcaoPreencher(questao: Questao, tabelaOpcoesPreencher: HTMLElement) {
    questao.opcoesParaPreencher.push({ opcaoSelecionada: "", ativa: true });

    questao.partesPreencher = this.getPreenchimentoPartes(questao);

    this.changeDetectorRef.detectChanges();
    (tabelaOpcoesPreencher.children[questao.opcoesParaPreencher.length - 1].children[1].children[0].children[0] as HTMLInputElement).focus()
  }
  onNovaOpcaoPreencherKeyUp(event, questao, tabelaOpcoesPreencher) {

    if (event.key == 'Enter' && event.ctrlKey) {
      this.addOpcaoPreencher(questao, tabelaOpcoesPreencher);
    }
  }
  onEditorPreencherKeyUp(questao) {
    questao.partesPreencher = this.getPreenchimentoPartes(questao);
  }
  getOpcoesPreencherAtivas(questao: Questao, questaoIndex: number) {
    return questao.opcoesParaPreencher.concat().filter(opcao => opcao.ativa).sort((a, b) => a.opcaoSelecionada > b.opcaoSelecionada ? 1 : -1);
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

  // VERDADEIRO OU FALSO
  addAlternativaVouF(questao: Questao, tabelaAlternativaVerdadeiroOuFalso: HTMLElement) {
    questao.alternativas.push({ texto: '', selecionada: false });
    this.changeDetectorRef.detectChanges();
    (tabelaAlternativaVerdadeiroOuFalso.children[questao.alternativas.length - 1].children[1].children[0].children[0] as HTMLInputElement).focus();
  }
  onNovaAlterKeyUpVouF(event, questao: Questao, tabelaAlternativaVerdadeiroOuFalso) {
    if (event.key == 'Enter' && event.ctrlKey) {
      this.addAlternativaVouF(questao, tabelaAlternativaVerdadeiroOuFalso);
    }
  }

  // IMAGENS
  onImagemSelected(event, questao: Questao) {
    this.uploadImagens(event.target.files, questao);
  }
  uploadImagens(files, questao: Questao) {
    const tiposPermitidos = ['image']

    for (let file of files) {

      const TIPO = file.type.split('/')[0];
      const TAMANHO_MAXIMO = 50000000;

      if (!tiposPermitidos.includes(TIPO)) {
        this.snack.open(`O formato ${TIPO} não é permitido`, null, {
          duration: 3500,
        });
        continue;
      }
      if (file.size > TAMANHO_MAXIMO) {
        this.snack.open(`Não é possivel subir arquivos com mais de 50MB`, null, {
          duration: 3500,
        });
        continue;
      }

      const CAMINHO: string = `${this.timeService.getCurrentDateTime().getTime()}_${file.name}`;

      const newFileIndex = questao.imagens.push({
        nomeArquivo: file.name,
        caminhoArquivo: CAMINHO,
        tamanho: file.size,
        tipo: TIPO,
        tipoCompleto: file.type,
        percentual: 0,
        url: '',
      }) - 1;


      var uploadTask = this.fileService.upload(CAMINHO, file);

      uploadTask.percentageChanges().subscribe(percentual => {
        if (questao.imagens[newFileIndex].descricao == "cancelar") {
          uploadTask.cancel();
          questao.imagens.splice(newFileIndex, 1);
          return;
        }
        questao.imagens[newFileIndex].percentual = percentual;
      });

      uploadTask.then(uploadTaskSnap => {

        uploadTaskSnap.ref.getDownloadURL().then(url => {
          questao.imagens[newFileIndex].url = url;
          this.sinalizarAlteracao();
        })
          .catch(reason => {
            console.log(reason);
          });
      })
        .catch(reason => {
          console.log(reason);
        });

    }
  }


  // ANEXOS
  onAnexoSelected(event, questao: Questao) {
    this.uploadAnexos(event.target.files, questao);
  }
  uploadAnexos(files, questao: Questao) {

    for (let file of files) {

      const TIPO = file.type.split('/')[0];
      const TAMANHO_MAXIMO = 50000000;
      if (file.size > TAMANHO_MAXIMO) {
        this.snack.open(`Não é possivel subir arquivos com mais de 50MB`, null, {
          duration: 3500,
        });
        continue;
      }

      const CAMINHO: string = `${this.timeService.getCurrentDateTime().getTime()}_${file.name}`;

      const newFileIndex = questao.anexos.push({
        nomeArquivo: file.name,
        caminhoArquivo: CAMINHO,
        tamanho: file.size,
        tipo: TIPO,
        tipoCompleto: file.type,
        percentual: 0,
        url: '',
      }) - 1;


      var uploadTask = this.fileService.upload(CAMINHO, file);

      uploadTask.percentageChanges().subscribe(percentual => {
        if (questao.anexos[newFileIndex].descricao == "cancelar") {
          uploadTask.cancel();
          questao.anexos.splice(newFileIndex, 1);
          return;
        }
        questao.anexos[newFileIndex].percentual = percentual;

      });

      uploadTask.then(uploadTaskSnap => {

        uploadTaskSnap.ref.getDownloadURL().then(url => {
          questao.anexos[newFileIndex].url = url;
          this.sinalizarAlteracao();
        })
          .catch(reason => {
            console.log(reason);
          });
      })
        .catch(reason => {
          console.log(reason);
        });

    }
  }


}
