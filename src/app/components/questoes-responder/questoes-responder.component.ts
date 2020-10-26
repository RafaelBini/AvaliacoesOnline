import { ENTER } from '@angular/cdk/keycodes';
import { TimeService } from './../../services/time.service';
import { CredencialService } from './../../services/credencial.service';
import { Prova } from 'src/app/models/prova';
import { Associacao } from './../../models/associacao';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Input, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';
import { Usuario } from 'src/app/models/usuario';
import { Arquivo } from 'src/app/models/arquivo';
import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';
import { FileService } from 'src/app/services/file.service';


@Component({
  selector: 'app-questoes-responder',
  templateUrl: './questoes-responder.component.html',
  styleUrls: ['./questoes-responder.component.css']
})
export class QuestoesResponderComponent implements OnInit {
  @Input() avaliacao: Avaliacao;
  @Input() gabarito: Prova;
  @Input() prova: Prova;
  public provaCache: Prova = {
    questoes: [
      { arquivosEntregues: [] }
    ]
  };

  @Output() respostaAlterada = new EventEmitter<void>();

  constructor(
    public comumService: ComumService,
    public credencialService: CredencialService,
    private fileService: FileService,
    private timeService: TimeService,
    private dialog: MatDialog,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
    var interval = setInterval(() => {
      if (this.prova.id != '1') {
        this.provaCache = JSON.parse(JSON.stringify(this.prova));
        clearInterval(interval);
      }
    })
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
  estaNoContextoCerto(questao) {
    const PRECISA_CORRECAO_AUTOMATICA = this.comumService.precisaDeCorrecaoAutomatica(this.avaliacao);

    if (!PRECISA_CORRECAO_AUTOMATICA) {
      return true;
    }

    const QUESTAO_EH_DE_CORRECAO_AUTOMATICA = this.comumService.questaoTipos[questao.tipo].temCorrecaoAutomatica;

    if (QUESTAO_EH_DE_CORRECAO_AUTOMATICA && PRECISA_CORRECAO_AUTOMATICA) {
      return true;
    }

    return false;

  }
  sinalizarRespostaAlterada(questao: Questao) {
    questao.ultimaModificacao = new Date().getTime();
    questao.isValidadaCorreta = false;
    this.respostaAlterada.emit();
  }
  sinalizarRespostaAlteradaSemInvalidar(questao: Questao) {
    questao.ultimaModificacao = new Date().getTime();
    this.respostaAlterada.emit();
  }
  identificarQuestao(index: Number, questao: Questao) {
    return index;
  }
  validar(questao: Questao, questaoIndex: number) {
    if (this.avaliacao.tipoPontuacao != 2)
      return;

    var tudoCerto = true;

    // ASSOCIACAO
    if (questao.tipo == 0) {
      for (let [i, associacao] of questao.associacoes.entries()) {
        if (associacao.opcaoSelecionada != this.gabarito.questoes[questaoIndex].associacoes[i].opcaoSelecionada && associacao.opcaoSelecionada != null && associacao.opcaoSelecionada != '') {

          setTimeout(() => {
            associacao.opcaoSelecionada = null;
          }, 1200);
          tudoCerto = false;
          break;
        }
      }
    }
    // MULTIPLAESCOLHA
    else if (questao.tipo == 3 || questao.tipo == 4) {
      for (let [i, alternativa] of questao.alternativas.entries()) {
        if (!this.gabarito.questoes[questaoIndex].alternativas[i].selecionada && alternativa.selecionada) {

          setTimeout(() => {
            alternativa.selecionada = false;
          }, 1200);
          tudoCerto = false;
          break;
        }
      }

    }
    // PREENCHIMENTO
    else if (questao.tipo == 5) {
      for (let [i, opcao] of questao.opcoesParaPreencher.entries()) {
        if (opcao.opcaoSelecionada != this.gabarito.questoes[questaoIndex].opcoesParaPreencher[i].opcaoSelecionada && opcao.opcaoSelecionada != null && opcao.opcaoSelecionada != '') {
          opcao.opcaoSelecionada = null;
          tudoCerto = false;
          break;
        }
      }
    }
    // VERDADEIRO OU FALSO
    else if (questao.tipo == 6) {
      for (let [i, alternativa] of questao.alternativas.entries()) {
        if ((this.gabarito.questoes[questaoIndex].alternativas[i].selecionada != alternativa.selecionada) && alternativa.selecionada != null) {

          setTimeout(() => {
            alternativa.selecionada = null;
          }, 1200);
          tudoCerto = false;
          break;
        }
      }
    }

    if (tudoCerto) {
      questao.isValidadaCorreta = true;
      this.snack.open("Respondido corretamente!", null, { duration: 3500 });
    }
    else {
      questao.isValidadaCorreta = false;
      if (questao.tentativas < 3) {
        questao.tentativas++;
        this.snack.open(`Resposta incorreta... Você perdeu ${Math.round(questao.valor / 3)} pontos no valor da questão`, null, {
          duration: 4000
        });
      } else {
        this.snack.open(`Resposta incorreta!`, null, {
          duration: 4000
        });
      }
    }
    this.sinalizarRespostaAlteradaSemInvalidar(questao);
  }

  // ASSOCIACAO
  getAssociacoesOrdenadas(questaoIndex: number) {
    return this.gabarito.questoes[questaoIndex].associacoes.concat().sort((a, b) => a.texto > b.texto ? 1 : -1);
  }


  // ALTERNATIVAS
  onMultiplaEscolhaChange(questao: Questao, alternativaIndex: number, isEditavel: boolean, questaoIndex: number) {
    this.desmarcarTudoMenosUma(questao, alternativaIndex, isEditavel);
    this.sinalizarRespostaAlterada(questao);
    //console.log(this.comumService.questaoTipos[questao.tipo].getNota(questao));
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


  // DISSERTATIVA
  isLocked(questao: Questao) {
    if (questao.usuarioUltimaModificacao == null) {
      return false;
    }
    return (questao.usuarioUltimaModificacao.id != this.credencialService.getLoggedUserIdFromCookie());
  }
  onDissertativaFocus(questao: Questao) {
    var usuario: Usuario = {
      id: this.credencialService.getLoggedUserIdFromCookie(),
      nome: this.credencialService.loggedUser.nome,
    }
    questao.usuarioUltimaModificacao = usuario;
    this.respostaAlterada.emit();
  }
  onDissertativaBlur(questao: Questao) {
    questao.usuarioUltimaModificacao = null;
    this.respostaAlterada.emit();
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


  // ENVIO DE ARQUIVOS
  onAnexoSelected(event, questao: Questao) {
    this.uploadAnexos(event.target.files, questao);
  }
  isExtensaoValida(nomeArquivo: string, questao: Questao) {
    for (let extensao of questao.extensoes) {
      if (nomeArquivo.split('.')[nomeArquivo.split('.').length - 1] == extensao.replace(".", "")) {
        return true;
      }
    }
    return false;
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
      else if (questao.tipo == 2) {
        if (!this.isExtensaoValida(file.name, questao)) {
          this.snack.open(`Não é permitido subir arquivos do tipo .${file.name.split('.')[file.name.split('.').length - 1]}`, null, {
            duration: 3500,
          });
          continue;
        }
      }

      const CAMINHO: string = `${new Date().getTime()}_${file.name}`;
      const questaoIndex = this.prova.questoes.indexOf(questao);

      const newFileIndex = this.provaCache.questoes[questaoIndex].arquivosEntregues.push({
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
        if (this.provaCache.questoes[questaoIndex].arquivosEntregues[newFileIndex].descricao == "cancelar") {
          uploadTask.cancel();
          this.provaCache.questoes[questaoIndex].arquivosEntregues.splice(newFileIndex, 1);
          return;
        }
        this.provaCache.questoes[questaoIndex].arquivosEntregues[newFileIndex].percentual = percentual;
        // console.log(percentual);
      });

      uploadTask.then(uploadTaskSnap => {

        uploadTaskSnap.ref.getDownloadURL().then(url => {
          this.provaCache.questoes[questaoIndex].arquivosEntregues[newFileIndex].url = url;
          this.prova.questoes[questaoIndex].arquivosEntregues.push(this.provaCache.questoes[questaoIndex].arquivosEntregues[newFileIndex]);
          this.respostaAlterada.emit();
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
  anexoRemovido() {

    this.respostaAlterada.emit();
  }


  // ENVIO DE IMAGENS
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

      const CAMINHO: string = `${new Date().getTime()}_${file.name}`;
      const questaoIndex = this.prova.questoes.indexOf(questao);

      const newFileIndex = this.provaCache.questoes[questaoIndex].imagensEntregues.push({
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
        if (this.provaCache.questoes[questaoIndex].imagensEntregues[newFileIndex].descricao == "cancelar") {
          uploadTask.cancel();
          this.provaCache.questoes[questaoIndex].imagensEntregues.splice(newFileIndex, 1);
          return;
        }
        this.provaCache.questoes[questaoIndex].imagensEntregues[newFileIndex].percentual = percentual;
      });

      uploadTask.then(uploadTaskSnap => {

        uploadTaskSnap.ref.getDownloadURL().then(url => {
          this.provaCache.questoes[questaoIndex].imagensEntregues[newFileIndex].url = url;
          this.prova.questoes[questaoIndex].imagensEntregues.push(this.provaCache.questoes[questaoIndex].imagensEntregues[newFileIndex]);
          this.respostaAlterada.emit();
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
  imagemRemovida() {
    this.respostaAlterada.emit();
  }
  onDescricaImagemAlterada() {
    this.respostaAlterada.emit();
  }



}
