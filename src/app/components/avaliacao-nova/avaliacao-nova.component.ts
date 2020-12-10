import { UsuarioService } from './../../services/usuario.service';
import { TimeService } from './../../services/time.service';
import { AjudaComponent } from './../../dialogs/ajuda/ajuda.component';
import { ConfirmarComponent } from './../../dialogs/confirmar/confirmar.component';
import { FileService } from './../../services/file.service';
import { SelecionarAlunosComponent } from './../../dialogs/selecionar-alunos/selecionar-alunos.component';
import { CredencialService } from './../../services/credencial.service';
import { ProvaService } from './../../services/prova.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvaliacaoService } from './../../services/avaliacao.service';
import { EscolherTipoComponent } from './../../dialogs/escolher-tipo/escolher-tipo.component';
import { ComumService } from './../../services/comum.service';
import { Avaliacao } from './../../models/avaliacao';
import { BuscarQuestaoComponent } from './../../dialogs/buscar-questao/buscar-questao.component';
import { AvaliacaoCriadaDialogComponent } from './../../dialogs/avaliacao-criada-dialog/avaliacao-criada-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import { Prova } from 'src/app/models/prova';
import { Usuario } from 'src/app/models/usuario';
import { Location } from '@angular/common';
import { GuidedTour, GuidedTourService, Orientation } from 'ngx-guided-tour';

@Component({
  selector: 'app-avaliacao-nova',
  templateUrl: './avaliacao-nova.component.html',
  styleUrls: ['./avaliacao-nova.component.css']
})
export class AvaliacaoNovaComponent implements OnInit {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    public comumService: ComumService,
    public credencialService: CredencialService,
    public avaliacaoService: AvaliacaoService,
    private usuarioService: UsuarioService,
    public provaService: ProvaService,
    private timeService: TimeService,
    private fileService: FileService,
    private guidedTourService: GuidedTourService,
  ) { }


  public avaliacao: Avaliacao = { ...this.avaliacaoService.getAvaliacaoDefault() };
  public provaGabarito: Prova = { ...this.provaService.getGabaritoDefault() };

  private avaliacoesId: Array<string> = [];
  private minhasAvaliacoes: Array<Avaliacao> = [];

  public provaExemplo: Prova;

  public visao = "professor";

  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: `Avaliações`, url: `/professor` },
    { nome: `Nova Avaliação`, url: `/professor` },
  ];


  public PrimeiraAvaliacaoTour: GuidedTour = {
    tourId: 'primeira-avaliacao-tour',
    useOrb: false,
    steps: [
      {
        title: 'A primeira avaliação!',
        content: 'Vamos criar a sua primeira avaliação! Vou te mostrar algumas dicas.',
      },
      {
        title: 'O link para compartilhar',
        selector: '.link-div',
        content: 'Este link servirá para você convidar seus alunos para participarem da avaliação.<br />Inicialmente um link aleatório já foi gerado automáticamente. Mas, caso ache interessante, você pode personalizá-lo.',
        orientation: Orientation.Bottom,
        highlightPadding: 5,
      },
      {
        title: 'O Título',
        selector: '.titulo-input',
        content: `Este título servirá para você e os alunos identificarem esta avaliação. Procure ser direto e simples na escolha de um título.`,
        orientation: Orientation.Bottom,
        highlightPadding: 5,
      },
      {
        title: 'A Descrição',
        selector: '.descricao-textarea',
        content: `Neste campo você pode descrever a atividade em mais detalhes. Instruções importantes para os alunos podem colocadas nesta parte.`,
        orientation: Orientation.Bottom,
        highlightPadding: 5,
      },
      {
        title: 'As Tags',
        selector: '.tags-div',
        content: `Insira tags (separadas por vírugla) para encontrar essa avaliação mais facilmente.`,
        orientation: Orientation.Left,
        highlightPadding: 5,
      },
      {
        title: 'Mais Opções',
        selector: '.atributos-table',
        content: `Você também pode definir outras opções como o momento de início e término da avaliação.`,
        orientation: Orientation.Right,
        highlightPadding: 5,
        scrollAdjustment: 25,
      },
      {
        title: 'Configurações Básicas',
        selector: '.configuracoes-basicas-table',
        content: `Clicando em um destes quadros você pode configurar se a prova será <b>Individual</b> ou <b>Em Grupo</b>, se os <b>alunos participarão corrigindo</b> ou se a <b>pontuação será por tentantivas</b> por exemplo.`,
        orientation: Orientation.Top,
        highlightPadding: 5,
        scrollAdjustment: 150,
      },
      {
        title: 'Selecionar Alunos',
        selector: '.selecionar-alunos-div',
        content: `Se você já tem alunos cadastrados em sua conta, você pode selecionar quais deseja que participem da avaliação.<br/><br/><b>Mas se você não cadastrou seus alunos, não se preocupe!</b><br /><br />Os alunos serão adicionados automáticamente à sua conta quando entrar no link da avaliação.`,
        orientation: Orientation.Top,
        highlightPadding: 5,
        scrollAdjustment: 50,
      },
      {
        title: 'Questão de Exemplo',
        selector: '.questao',
        content: `Esse é o exemplo de uma questão. Conforme você for editando a questão, ela será salva em seu banco de questões.`,
        orientation: Orientation.Right,
        highlightPadding: 5,
        scrollAdjustment: 25,
      },
      {
        title: 'Tipo de Questão',
        selector: '.questao-tipo-select',
        content: `Aqui você pode escolher qual tipo de questão deseja criar (dissertativa, multipla escolha, associativa ou de preenchimento por exemplo)`,
        orientation: Orientation.TopRight,
        scrollAdjustment: 150,
      },
      {
        title: 'Nível da Questão',
        selector: '.nivel-dificuldade-select',
        content: `Classifique a questão entre (fácil, médio ou difícil) para te ajudar a localizar no banco de questões.`,
        orientation: Orientation.TopLeft,
        scrollAdjustment: 150,
      },
      {
        title: 'Valor da Questão',
        selector: '.valor-questao',
        content: `Aqui você pode definir um valor para essa questão.`,
        orientation: Orientation.TopRight,
        highlightPadding: 20,
        scrollAdjustment: 150,
      },
      {
        title: 'Mais Opções',
        selector: '.opcoes-questao',
        content: `Você também pode enriquecer a sua questão adicionando imagens, anexos e tags.`,
        orientation: Orientation.Top,
        highlightPadding: 20,
        scrollAdjustment: 150,
      },
      {
        title: 'Adicionar uma nova questão',
        selector: '.btn-add-questao',
        content: `Clique aqui para adicionar uma nova questão em branco`,
        orientation: Orientation.TopRight,
        scrollAdjustment: 50,
      },
      {
        title: 'Mais Opções',
        selector: '.btn-mais-opcoes',
        content: `Por aqui você pode <b>adicionar uma questão que você já criou anteriormente</b>. Você também pode <b>ver a avaliação como aluno</b> e até <b>imprimir a avaliação para ser feita em um papel</b>.`,
        orientation: Orientation.TopRight,
        scrollAdjustment: 50,
      },
      {
        title: 'Descartar Rascunho',
        selector: '.btn-descartar-rascunho',
        content: `Cuidado! Ao clicar aqui você irá apagar tudo o que fez nesta avaliação e começar do zero.`,
        orientation: Orientation.TopLeft,
        scrollAdjustment: 50,
      },
      {
        title: 'Finalizar!',
        selector: '.btn-finalizar',
        content: `Quando estiver tudo pronto, clique aqui e envie o link da avaliação para os seus alunos!`,
        orientation: Orientation.TopLeft,
        highlightPadding: 20,
        scrollAdjustment: 50,
      },
      {
        title: 'Obter Ajuda',
        selector: '.btn-help',
        content: `Você pode obter mais detalhes sobre qualquer funcionalidade ao clicar nestes botões.`,
        orientation: Orientation.Right,
        useHighlightPadding: true,
      },


    ]
  };


  idJaExiste = false;
  isEditando = false;

  idEmEdicao: string;

  salvo: boolean = false;


  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  ngOnInit(): void {

    if (!this.credencialService.estouLogado()) {
      this.router.navigate(['']);
      return;
    }

    this.comumService.scrollToTop();
    this.route.params.subscribe(params => {

      // DUPLICANDO 
      if (params.id && params.tipo == 'duplicar') {

        this.puxarAvaliacaoParaEditar(params.id).then(() => {

          if (this.avaliacao.professorId != this.credencialService.getLoggedUserIdFromCookie()) {
            this.snack.open('Sem permissao para duplicar', null, { duration: 4500 });
            this.router.navigate(['']);
            return;
          }
          this.avaliacao.professorId = null;
          this.receberTodasAvaliacoes().then(() => {
            this.setIdDuplicado(params.id);
            this.avaliacao.status = 0;
            this.avaliacao.grupos = [
              {
                numero: 1,
                alunos: [],
                provaId: null,
              }
            ];
            this.avaliacao.dtInicio = this.comumService.getStringFromDate(this.timeService.getCurrentDateTime());
            this.avaliacao.dtInicioCorrecao = this.comumService.getStringFromDate(this.timeService.getCurrentDateTime(), 1);
            this.avaliacao.dtTermino = this.comumService.getStringFromDate(this.timeService.getCurrentDateTime(), 2);
            this.avaliacaoService.setRascunhoAvaliacao(this.avaliacao).then(() => {
              this.provaService.setRascunhoProvaGabarito(this.provaGabarito).then(() => {
                console.log("Rascunho criado");
              });
            });
          });
        });
        this.isEditando = false;

      }

      // EDITANDO
      else if (params.id) {
        this.idEmEdicao = params.id;
        this.puxarAvaliacaoParaEditar(params.id).then(() => {
          if (this.avaliacao.status != 0) {
            this.snack.open('Essa avaliação não pode mais ser editada', null, { duration: 4500 });
            this.router.navigate(['']);
            return;
          }
          else if (this.avaliacao.professorId != this.credencialService.getLoggedUserIdFromCookie()) {
            this.snack.open('Sem permissao para duplicar', null, { duration: 4500 });
            this.router.navigate(['']);
            return;
          }
          this.provaGabarito.professorId = this.credencialService.getLoggedUserIdFromCookie();
          this.receberTodasAvaliacoes();
        }).catch(() => {
          this.snack.open('Avaliação não encontrada', null, { duration: 4500 });
          this.router.navigate(['']);
          return;
        });

        this.isEditando = true;
      }

      // CRIANDO NOVA
      else {

        this.carregarRascunho();

      }

      if (!this.credencialService.loggedUser.tutorialMostradoTelaAvaliacaoNova) {
        this.guidedTourService.startTour(this.PrimeiraAvaliacaoTour);
        this.credencialService.loggedUser.tutorialMostradoTelaAvaliacaoNova = true;
        this.usuarioService.update(this.credencialService.loggedUser);
      }

    });
  }

  carregarRascunho() {
    this.avaliacaoService.getAvaliacaoFromId(this.credencialService.getLoggedUserIdFromCookie())
      .then(avaliacao => {

        this.provaService.getProvaFromId(this.credencialService.getLoggedUserIdFromCookie()).then(gabarito => {


          this.avaliacao = { ...avaliacao };
          this.provaGabarito = { ...gabarito };
          this.setIdAleatorio();
          this.receberTodasAvaliacoes();
          this.provaGabarito.professorId = this.credencialService.getLoggedUserIdFromCookie();
          this.isEditando = false;

          console.log("Rascunho carregado");

        });


      })
      .catch(reason => {

        this.setIdAleatorio();
        this.receberTodasAvaliacoes();
        this.provaGabarito.professorId = this.credencialService.getLoggedUserIdFromCookie();
        this.isEditando = false;

        this.avaliacaoService.setRascunhoAvaliacao(this.avaliacao).then(() => {
          this.provaService.setRascunhoProvaGabarito(this.provaGabarito).then(() => {
            console.log("Rascunho criado");
          });
        });

      });
  }

  atualizarRascunhoProva() {
    setTimeout(() => {

      if (!this.isEditando) {
        if (this.provaGabarito.id == '1')
          this.provaGabarito.id = this.credencialService.getLoggedUserIdFromCookie();
        this.provaService.updateProva(this.provaGabarito);
        console.log("FIREBASE UPDATE: prova rascunho atualizado");
      }
      else {
        this.provaService.updateProva(this.provaGabarito);
        console.log(`FIREBASE UPDATE: prova ${this.provaGabarito.id} atualizada`);
      }

    });

  }

  atualizarRascunhoAvaliacao() {
    setTimeout(() => {


      if (!this.isEditando) {
        var avaliacaoRascunho = { ...this.avaliacao };
        avaliacaoRascunho.id = this.credencialService.getLoggedUserIdFromCookie();
        avaliacaoRascunho.professorId = "";
        avaliacaoRascunho.provaGabarito = this.credencialService.getLoggedUserIdFromCookie();
        this.avaliacaoService.updateAvaliacao(avaliacaoRascunho);
        console.log("FIREBASE UPDATE: avaliacao rascunho atualizado");
      }
      else {
        this.avaliacaoService.updateAvaliacao(this.avaliacao);
        console.log(`FIREBASE UPDATE: avaliacao ${this.avaliacao.id} atualizada`);
      }

    });

  }

  puxarAvaliacaoParaEditar(avaliacaoId) {
    return new Promise((resolve, reject) => {
      this.avaliacaoService.getAvaliacaoFromId(avaliacaoId).then(avaliacao => {
        this.avaliacao = avaliacao;
        this.provaService.getProvaFromId(avaliacao.provaGabarito).then(prova => {
          this.provaGabarito = prova;
          resolve();
        })
          .catch(reason => {
            this.comumService.notificarErro("Erro ao tentar receber prova gabarito", reason);
            reject(reason);
            return;
          });
      })
        .catch(reason => {
          this.comumService.notificarErro("Erro ao tentar receber avaliacao", reason);
          reject(reason);
          return;
        });
    });

  }

  getAlunosFromTodosGrupos(): Array<Usuario> {
    var alunos: Array<Usuario> = [];
    for (let grupo of this.avaliacao.grupos) {
      for (let aluno of grupo.alunos) {
        alunos.push(aluno);
      }
    }
    return alunos;
  }


  receberTodasAvaliacoes() {
    return new Promise((resolve, reject) => {
      this.avaliacaoService.getAllAvaliacoes().then(avaliacoes => {
        for (let avaliacao of avaliacoes) {
          this.avaliacoesId.push(avaliacao.id);
          if (avaliacao.professorId == this.credencialService.getLoggedUserIdFromCookie())
            this.minhasAvaliacoes.push(avaliacao);
        }
        resolve();
      }).catch(reason => reject(reason));
    });

  }

  // TAGS

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.avaliacao.tags.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.atualizarRascunhoAvaliacao();
  }
  removeTag(tema: any): void {
    const index = this.avaliacao.tags.indexOf(tema);

    if (index >= 0) {
      this.avaliacao.tags.splice(index, 1);
    }

    this.atualizarRascunhoAvaliacao();
  }

  estaEmFoco(objetoDom): boolean {
    return objetoDom == document.activeElement;
  }
  ajustarAltura(event) {
    var paddingTop = parseFloat(event.target.style.paddingTop.replace("px", ""));
    var paddingBottom = parseFloat(event.target.style.paddingBottom.replace("px", ""));
    event.target.style.height = ""; event.target.style.height = (event.target.scrollHeight - (paddingTop + paddingBottom)) + "px";
  }
  addQuestao() {
    this.provaGabarito.questoes.push({
      pergunta: "",
      tipo: 4,
      resposta: "",
      alternativas: [
        { texto: '', selecionada: false }
      ],
      valor: 10,
      nivelDificuldade: 2,
      tags: [],
      associacoes: [
        { texto: '', opcaoSelecionada: '' }
      ],
      textoParaPreencher: "",
      opcoesParaPreencher: [
        { opcaoSelecionada: '', ativa: true }
      ],
      tentativas: 0,
      extensoes: [],
      correcoes: [],
      correcaoProfessor: {
        nota: null,
        observacao: ""
      },
      anexos: [],
      imagens: [],
      arquivosEntregues: [],
      imagensEntregues: [],
    });
    this.marcarEdicao(this.provaGabarito.questoes.length - 1);
    this.comumService.scrollToBottom();
    this.setQuestoesIndex();
    this.atualizarRascunhoProva();
  }
  marcarEdicao(questaoIndex: number) {
    for (var i = 0; i < this.provaGabarito.questoes.length; i++) {
      if (i != questaoIndex) {
        this.provaGabarito.questoes[i].isEditando = false;
      }
      else {
        this.provaGabarito.questoes[i].isEditando = true;
      }
    }
  }

  limitarIndeterminados() {


    if (this.avaliacao.isInicioIndeterminado) {
      this.avaliacao.isInicioCorrecaoIndeterminado = true;
    }
    if (this.avaliacao.isInicioCorrecaoIndeterminado) {
      this.avaliacao.isTerminoIndeterminado = true;
    }

    this.atualizarRascunhoAvaliacao();
  }

  corrigirDatas(dtAlterada: 'inicio' | 'correcao' | 'termino') {

    var dtInicio = new Date(this.avaliacao.dtInicio);
    var dtInicioCorrecao = new Date(this.avaliacao.dtInicioCorrecao);
    var dtTermino = new Date(this.avaliacao.dtTermino);

    if (dtInicioCorrecao <= dtInicio && dtAlterada != 'correcao') {
      this.avaliacao.dtInicioCorrecao = this.comumService.getStringFromDate(dtInicio, 1);
      this.avaliacao.dtTermino = this.comumService.getStringFromDate(new Date(this.avaliacao.dtInicioCorrecao), 1);
      console.log(`Alterei dtCorrecao para ${this.avaliacao.dtInicioCorrecao} e dtTermino para ${this.avaliacao.dtTermino}`);
    }
    else if (dtTermino <= dtInicioCorrecao && dtAlterada != 'termino') {
      this.avaliacao.dtTermino = this.comumService.getStringFromDate(dtInicioCorrecao, 1);
      console.log(`Alterei dtTermino para ${this.avaliacao.dtTermino}`);
    }

    this.atualizarRascunhoAvaliacao();
  }

  // DATAS

  getPeriodoAvaliacao() {

    if (this.avaliacao.isInicioCorrecaoIndeterminado || this.avaliacao.isInicioIndeterminado)
      return "indeterminado";

    var periodoMs = new Date(this.avaliacao.dtInicioCorrecao).getTime() - new Date(this.avaliacao.dtInicio).getTime();

    return this.comumService.getPeriodoAmigavel(periodoMs);
  }
  getPeriodoCorrecao() {

    if (this.avaliacao.isInicioCorrecaoIndeterminado || this.avaliacao.isTerminoIndeterminado)
      return "indeterminado";

    var periodoMs = new Date(this.avaliacao.dtTermino).getTime() - new Date(this.avaliacao.dtInicioCorrecao).getTime();

    return this.comumService.getPeriodoAmigavel(periodoMs);
  }

  // AJUDAS
  abrirAjudaPeriodoAvaliacao() {
    this.dialog.open(AjudaComponent, {
      data: {
        titulo: "Período de Avaliação",
        mensagem:
          `        
        O Período de Avaliação é o momento em que os alunos atuam na prova respondendo as questões. Esse período é limitado por duas informações: Data de Início e Data de Término.
        <br /><br />
        <b>Data de Início</b>: Indica quando a avaliação será iniciada. Se estiver marcada para <i>iniciar manualmente</i>, o professor poderá iniciar a avaliação quando desejar. 
        Caso não esteja marcada para <i>Iniciar manualmente</i>, o professor deverá informar a data e hora de quando a avaliação será iniciada automaticamente.
        <br /><br />
        <b>Data de Término</b>: Indica quando a avaliação será encerrada. Se estiver marcada para <i>encerrar manualmente</i>, o professor poderá encerrar a avaliação quando desejar. 
        Caso não esteja marcada para <i>encerrar manualmente</i>, o professor deverá informar a data e hora de quando a avaliação será encerrada automaticamente.
        <br /><br />
        Obs.: Além de indicar quando a avaliação será encerrada, a <b>Data de Término</b> também indica quando o Período de Correção será iniciado.
        `
      }
    })
  }
  abrirAjudaPeriodoCorrecao() {
    this.dialog.open(AjudaComponent, {
      data: {
        titulo: "Período de Correção",
        mensagem:
          `        
        O Período de Correção é o momento em que o professor (ou alunos) atua(m) corrigindo as provas. Esse período é limitado por duas informações: Data de Início e Data de Término.
        <br /><br />
        <b>Data de Início</b>: Indica quando as correções serão iniciadas. Se estiver marcada para <i>iniciar manualmente</i>, o professor poderá iniciar a correção quando desejar. 
        Caso não esteja marcada para <i>iniciar manualmente</i>, o professor deverá informar a data e hora em que as correções serão iniciadas automaticamente.
        <br /><br />
        <b>Data de Término</b>: Indica quando as correções serão encerradas. Se estiver marcada para <i>encerrar manualmente</i>, o professor poderá encerrar as correções quando desejar. 
        Caso não esteja marcada para <i>encerrar manualmente</i>, o professor deverá informar a data e hora de quando as correções serão encerradas automaticamente.
        <br /><br />
        Obs.: Além de indicar quando as correções serão iniciadas, a <b>Data de Início</b> também indica quando o Período de Avaliação será encerrado.
        `
      }
    })
  }
  abrirAjudaDuracaoIndividual() {
    this.dialog.open(AjudaComponent, {
      data: {
        titulo: "Duração Individual",
        mensagem:
          `       
        A Duração Individual é um período determinado pelo professor para o aluno responder individualmente às questões.        
        O tempo começa a contar para o aluno a partir do momento em que ele acessa à avaliação.
        <br /><br />
        Exemplo: Um aluno iniciou a avaliação às 18:00. Se a <i>Duração Individual</i> for de uma hora, às 19:00 a prova desse aluno será finalizada automaticamente.
        `
      }
    })
  }
  abrirAjudaOrdenarAleatorio() {
    this.dialog.open(AjudaComponent, {
      data: {
        titulo: "Ordenar questões de forma aleatória",
        mensagem:
          `
        Ao marcar a opção <i>ordenar questões de forma aleatória</i>, as questões aparecerão em uma sequência diferente para cada aluno (ou grupo).
        `
      }
    })
  }
  abrirAjudaBloquearAtrasados() {
    this.dialog.open(AjudaComponent, {
      data: {
        titulo: "Bloquear participação de alunos atrasados",
        mensagem:
          `
        Ao marcar a opção <i>bloquear participação de alunos atrasados</i>, serão impedidos os alunos que tentarem acessar a avaliação depois que ela já estiver sido iniciada.
        `
      }
    })
  }
  abrirAjudaTitulo() {
    this.dialog.open(AjudaComponent, {
      data: {
        titulo: "Identificação da Avaliação",
        mensagem:
          `
        O título, a descrição e as tags da avaliação ajudam o professor e os alunos a identificarem a avaliação.
        <br /><br />
        O <b>Título</b> irá aparecer no topo da avaliçao para os alunos. Preencha essa informação da forma que preferir. Exemplo de títulos seriam: <i>Avaliação 01 de Matemática</i>; <i>Lingua Portuguesa (Av. 1)</i>.
        <br /><br />
        A <b>Descrição</b> irá sempre aparecer abaixo do título. Use esse campo para informar aos alunos detalhes mais específicos sobre a avaliação.
        <br /><br />
        As <b>Tags</b> servem para identificar melhor esta avaliação. Você pode padronizar suas avaliações com uma tag da disciplina e outra do turno. Por exemplo: <i>Matemática</i>; <i>Noite</i>; <i>Lingua Portuguesa</i>; <i>Tarde</i>.
        `
      }
    })
  }

  // AVISOS
  avisarBloqueioTerminoAvaliacao() {
    if (this.avaliacao.isInicioIndeterminado) {
      this.snack.open('Desmarque o inicio manual da avaliação para desmarcar esta', null, { duration: 3500 });
    }
  }
  avisarBloqueioInicioCorrecao() {
    if (this.avaliacao.isInicioIndeterminado) {
      this.snack.open('Desmarque o encerramento manual da avaliação para desmarcar esta', null, { duration: 3500 });
    }
  }
  avisarBloqueioTerminoCorrecao() {
    if (this.avaliacao.isInicioCorrecaoIndeterminado) {
      this.snack.open('Desmarque o inicio manual da correção para desmarcar esta', null, { duration: 3500 });
    }
  }

  // FINAL
  finalizar() {
    if (this.idJaExiste) {
      this.snack.open(`Já existe uma avaliação com o ID ${this.avaliacao.id}`, null, { duration: 3500 });
      return;
    }
    else if (this.isDuracaoIndividualValida() == false) {
      this.snack.open(`Duração individual inválida`, null, { duration: 4500 });
      return;
    }
    else if (this.getIndexQuestaoGabaritoNaoPreenchida() != -1) {
      this.snack.open(`Preencha a resposta gabarito da questão ${this.getIndexQuestaoGabaritoNaoPreenchida() + 1}`, null, { duration: 5500 });
      return;
    }
    this.validarDatas().then(() => {

      this.atualizarAvaliacao();

      this.avaliacaoService.insertNovaAvaliacao(this.avaliacao).then(() => {
        this.provaGabarito.avaliacaoId = this.avaliacao.id;
        this.setQuestoesIndex();
        this.provaService.insertProvaGabarito(this.provaGabarito).then(() => {
          this.provaService.deletarProvaSemExcuirArquivos(this.credencialService.getLoggedUserIdFromCookie());
          this.avaliacaoService.deletarAvaliacao(this.credencialService.getLoggedUserIdFromCookie());
          this.router.navigate(['/professor']);
          if (!this.isEditando) {
            this.dialog.open(AvaliacaoCriadaDialogComponent, {
              data: this.avaliacao.id
            });
          }
        }).catch(reason => {
          this.comumService.notificarErro("Não foi possível adicionar a prova", reason);
        });
      }).catch(reason => {
        this.comumService.notificarErro("Não foi possível adicionar a avaliação", reason);
      });
    }).catch(reason => {
      this.snack.open(reason, null, { duration: 3500 });
    })


  }
  @HostListener('window:keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) {

    if (event.key.toUpperCase() == 'S' && event.ctrlKey) {
      event.preventDefault();
      this.salvar();
    }


  }
  salvar() {
    if (!this.isEditando)
      return;
    if (this.idJaExiste) {
      this.snack.open(`Já existe uma avaliação com o ID ${this.avaliacao.id}`, null, { duration: 3500 });
      return;
    }
    else if (this.getIndexQuestaoGabaritoNaoPreenchida() != -1) {
      this.snack.open(`Preencha a resposta gabarito da questão ${this.getIndexQuestaoGabaritoNaoPreenchida() + 1}`, null, { duration: 5500 });
      return;
    }
    this.validarDatas().then(() => {
      this.avaliacaoService.updateAvaliacao(this.avaliacao).then(() => {
        this.provaGabarito.id = this.avaliacao.provaGabarito;
        this.provaService.updateProva(this.provaGabarito).then(() => {
          this.snack.open("Avaliação salva!", null, { duration: 3500 });
        }).catch(reason => this.comumService.notificarErro("Não foi possível salvar a avaliação", reason))
      }).catch(reason => this.comumService.notificarErro("Não foi possível salvar a prova", reason));
    }).catch(reason => {
      this.snack.open(reason, null, { duration: 3500 });
    });

  }

  descartarRascunho() {
    this.avaliacao = { ...this.avaliacaoService.getAvaliacaoDefault() };
    this.provaGabarito = { ...this.provaService.getGabaritoDefault() };
    this.atualizarRascunhoAvaliacao();
    this.atualizarRascunhoProva();
    this.carregarRascunho();
    this.snack.open("Rascunho descartado", null, {
      duration: 3500
    });
  }
  atualizarAvaliacao() {
    this.avaliacao.professorId = this.credencialService.loggedUser.id;
    this.avaliacao.professorNome = this.credencialService.loggedUser.nome;
    if (this.avaliacao.isInicioIndeterminado)
      this.avaliacao.dtInicio = null;
    if (this.avaliacao.titulo == '')
      this.avaliacao.titulo = 'Sem Título';
  }


  // DIALOGS
  buscarQuestao() {
    var diagRef = this.dialog.open(BuscarQuestaoComponent, {
      data: {
        prova: this.provaGabarito,
        minhasAvaliacoes: this.minhasAvaliacoes,
        avaliacao: this.avaliacao,
      },
      width: '75%',
      height: '95%',
    });

    diagRef.afterClosed().subscribe(() => {
      this.atualizarRascunhoProva();
    });
  }
  abrirTipos(tipoEscolhido) {
    const DIAG_REF = this.dialog.open(EscolherTipoComponent, {
      data: {
        avaliacao: this.avaliacao,
        prova: this.provaGabarito,
        tipoEscolhido: tipoEscolhido
      },
      width: '75%'
    });
    DIAG_REF.afterClosed().subscribe(() => {
      if (tipoEscolhido == 'disposicao')
        this.redistribuirAlunosNosGrupos();
      this.atualizarRascunhoAvaliacao();
    });
  }
  mudarVisao(tipoVisao) {
    if (this.provaExemplo) {
      for (let questao of this.provaExemplo.questoes) {
        for (let arquivo of questao.imagensEntregues) {
          this.fileService.delete(arquivo.caminhoArquivo);
        }
        for (let arquivo of questao.arquivosEntregues) {
          this.fileService.delete(arquivo.caminhoArquivo);
        }
      }
    }
    this.provaExemplo = this.provaService.getProvaFromGabarito(this.provaGabarito, this.avaliacao.isOrdemAleatoria);
    this.visao = tipoVisao;
    this.atualizarAvaliacao();
  }
  abirSelecionarAunos() {
    var diagRef = this.dialog.open(SelecionarAlunosComponent, {
      data: this.avaliacao,
      width: '85%',
      height: '95%',
    });
    diagRef.afterClosed().subscribe(() => {
      this.redistribuirAlunosNosGrupos();
      this.atualizarRascunhoAvaliacao();
    });
  }
  redistribuirAlunosNosGrupos() {
    var todosAlunos = this.getAlunosFromTodosGrupos();

    if (todosAlunos.length <= 0)
      return;

    if (this.avaliacao.tipoDisposicao == 0) {
      this.avaliacao.grupos = this.avaliacao.grupos.filter(g => g.numero == 1);
      this.avaliacao.grupos[0].alunos = todosAlunos;
      return;
    }
    else {
      if (!this.avaliacao.limitarNumIntegrantes) {
        this.avaliacao.maxIntegrantes = 3;
      }
      const QTD_GRUPOS_NECESSARIOS = (todosAlunos.length / this.avaliacao.maxIntegrantes);
      const MAX_EQUILIBRADO = todosAlunos.length / QTD_GRUPOS_NECESSARIOS;
      this.avaliacao.grupos = [];
      for (var g = 0; g < QTD_GRUPOS_NECESSARIOS; g++) {
        this.addGrupo();
        while (this.avaliacao.grupos[g].alunos.length < MAX_EQUILIBRADO && todosAlunos.length > 0) {
          const INDEX_SORTEADO = Math.floor(Math.random() * todosAlunos.length);
          const ALUNO_SORTEADO = todosAlunos[INDEX_SORTEADO]
          this.avaliacao.grupos[g].alunos.push(ALUNO_SORTEADO);
          todosAlunos.splice(INDEX_SORTEADO, 1);
        }
      }
    }
  }
  addGrupo() {
    this.avaliacao.grupos.push({ numero: this.avaliacao.grupos.length + 1, provaId: null, alunos: [] });
  }

  // DATAS DA AVALIAÇÃO
  validarDatas() {
    return new Promise<void>((resolve, reject) => {
      const dtInicio = new Date(this.avaliacao.dtInicio);
      const dtInicioCorrecao = new Date(this.avaliacao.dtInicioCorrecao);
      const dtTermino = new Date(this.avaliacao.descricao);

      if ((dtTermino <= dtInicioCorrecao || dtTermino <= dtInicio) && !this.avaliacao.isInicioCorrecaoIndeterminado && !this.avaliacao.isInicioIndeterminado && !this.avaliacao.isTerminoIndeterminado) {
        reject('O término da avaliação não pode ser antes que o início');
        return;
      }
      else if (dtInicioCorrecao <= dtInicio && !this.avaliacao.isInicioCorrecaoIndeterminado && !this.avaliacao.isInicioIndeterminado) {
        reject('O início da correção não pode ser antes do início da avaliaçao');
        return;
      }
      else if (dtInicio < this.timeService.getCurrentDateTime() && !this.avaliacao.isInicioIndeterminado) {
        reject('O início da avaliação não pode ser colocado no passado.');
        return;
      }

      resolve();

    });
  }
  getNowStr() {
    return this.comumService.getStringFromDate(this.timeService.getCurrentDateTime());
  }

  setQuestoesIndex() {
    for (let [questaoIndex, questao] of this.provaGabarito.questoes.entries()) {
      questao.index = questaoIndex;
    }
  }

  // ID DA AVALIAÇÃO
  validarId() {
    if (this.idEmEdicao == this.avaliacao.id) {
      this.idJaExiste = false;
    }
    else if (this.avaliacoesId.includes(this.avaliacao.id)) {
      this.idJaExiste = true;
    }
    else {
      this.idJaExiste = false;
    }
  }
  corrigirId() {
    setTimeout(() => {
      this.avaliacao.id = this.avaliacao.id.replace(" ", "");
      this.validarId();
      this.atualizarRascunhoAvaliacao();
    });
  }
  corrigirIdVazio() {
    if (this.avaliacao.id == "") {
      this.setIdAleatorio();
    }
  }
  setIdAleatorio() {
    this.avaliacao.id = this.getIdAleatorio(4);
  }
  getIdAleatorio(maxDigitos: number): string {
    const CARACTERES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Z', 'Y', 'W'];
    var idAleatorio = '';
    while (idAleatorio.length < maxDigitos) {
      for (let caractere of CARACTERES) {
        if (Math.random() > 0.85) {
          idAleatorio += caractere;
          if (idAleatorio.length >= maxDigitos) {
            if (!this.avaliacoesId.includes(idAleatorio)) {
              return idAleatorio;
            }
            else {
              idAleatorio = "";
            }
          }
        }
      }
    }
    return idAleatorio;
  }
  setIdDuplicado(base: string) {
    var id = this.getIdDuplicado(base);
    this.avaliacao.id = id;
    this.provaGabarito.avaliacaoId = id;
  }
  getIdDuplicado(base: string) {
    var count = 2;
    while (this.avaliacoesId.includes(`${base}_${count}`)) {
      count++;
    }
    return `${base}_${count}`;
  }

  // DURAÇÃO INDIVIDUAL
  atualizarDuracaoIndividualMs() {
    this.avaliacao.duracaoIndividualMs = this.getDuracaoIndividualEmMs();
    this.atualizarRascunhoAvaliacao();
  }
  getDuracaoIndividualEmMs() {
    if (this.avaliacao.duracaoIndividualUnidade == 'segundos') {
      return this.avaliacao.duracaoIndividual * 1000;
    }
    else if (this.avaliacao.duracaoIndividualUnidade == 'minutos') {
      return this.avaliacao.duracaoIndividual * 60 * 1000;
    }
    else if (this.avaliacao.duracaoIndividualUnidade == 'horas') {
      return this.avaliacao.duracaoIndividual * 60 * 60 * 1000;
    }
    else if (this.avaliacao.duracaoIndividualUnidade == 'dias') {
      return this.avaliacao.duracaoIndividual * 24 * 60 * 60 * 1000;
    }
    else {
      return 0;
    }
  }
  getNumeroNaUnidadeSelecionada(numero) {
    if (this.avaliacao.duracaoIndividualUnidade == 'segundos') {
      return numero / 1000;
    }
    else if (this.avaliacao.duracaoIndividualUnidade == 'minutos') {
      return (numero / 60) / 1000;
    }
    else if (this.avaliacao.duracaoIndividualUnidade == 'horas') {
      return ((numero / 60) / 60) / 1000;
    }
    else if (this.avaliacao.duracaoIndividualUnidade == 'dias') {
      return (((numero / 24) / 60) / 60) / 1000;
    }
    else {
      return 0;
    }
  }
  isDuracaoIndividualValida() {
    if (this.avaliacao.isDuracaoIndividualIndeterminada)
      return true;

    var duracao = this.getDuracaoIndividualEmMs();

    if (duracao < 999) {
      return false;
    }

    if (!this.avaliacao.isInicioIndeterminado && !this.avaliacao.isInicioCorrecaoIndeterminado) {
      const INICIO = new Date(this.avaliacao.dtInicio).getTime();
      const FIM = new Date(this.avaliacao.dtInicioCorrecao).getTime();
      if (duracao >= (FIM - INICIO)) {
        return false;
      }
    }
    return true;
  }
  getIndexQuestaoGabaritoNaoPreenchida() {
    for (let [i, questao] of this.provaGabarito.questoes.entries()) {
      if (!this.comumService.questaoTipos[questao.tipo].isRespondida(questao)) {
        return i;
      }
    }
    return -1;
  }

}
