import { ComumService } from './../../services/comum.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UrlNode } from 'src/app/models/url-node';


@Component({
  selector: 'app-avaliacao-aluno',
  templateUrl: './avaliacao-aluno.component.html',
  styleUrls: ['./avaliacao-aluno.component.css']
})
export class AvaliacaoAlunoComponent implements OnInit {

  constructor(public route: ActivatedRoute, public comumService: ComumService) { }
  public finalizado = false;

  public avaliacao = {
    titulo: "Titulo da Avaliação",
    descricao: `Descrição da Avaliação Descrição da Avaliação Descrição da Avaliação Descrição da Avaliação
    Descrição da Avaliação`,
    status: 0,
    tipoDisposicao: 2,
    tipoCorrecao: 3,
    tipoPontuacao: 2,
    questoes: [
      {
        pergunta: "Qual é a cor da grama?",
        tipo: 1,
        resposta: "Verde",
        alternativas: [],
        valor: 70
      },
      {
        pergunta: "Qual é a cor da grama?",
        tipo: 4,
        resposta: "",
        alternativas: [
          { texto: "A cor é Vermelha.", correta: false },
          { texto: "A cor é Verde.", correta: true },
          { texto: "A cor é Rosa.", correta: false },
          { texto: "A cor é Azul.", correta: false },
        ],
        valor: 30
      },
    ],
    alunos: [
      { nome: "Camila Bini", email: 'Junqueira@gmail.com', online: true, instanciaStatusId: null },
      { nome: "Matheus Leonardo", email: 'Junqueira3@gmail.com', online: true, instanciaStatusId: null },
      { nome: "Douglas Marques", email: 'Junqueira2@gmail.com', online: true, instanciaStatusId: null },
      { nome: "Guilherme Cruz", email: 'Junqueira4@gmail.com', online: true, instanciaStatusId: null },
    ],
    grupos: [
      {
        numero: 1,
        instanciaStatusId: 0,
        instanciaId: '1',
        alunos: [
          { nome: "Douglas Marques", email: 'Junqueira2@gmail.com', online: true, instanciaStatusId: null },
          { nome: "Guilherme Cruz", email: 'Junqueira4@gmail.com', online: true, instanciaStatusId: null },
        ]
      },
      {
        numero: 2,
        instanciaStatusId: 0,
        instanciaId: '2',
        alunos: [
          { nome: "Camila Bini", email: 'Junqueira@gmail.com', online: true, instanciaStatusId: null },
          { nome: "Matheus Leonardo", email: 'Junqueira3@gmail.com', online: true, instanciaStatusId: null },
        ]
      },
    ],
  }

  public instancia = {
    id: '1',
    avaliacaoId: "1",
    titulo: "Titulo da Avaliação",
    descricao: `Descrição da Avaliação Descrição da Avaliação Descrição da Avaliação Descrição da Avaliação
    Descrição da Avaliação`,
    status: 0,
    tipoDisposicao: 3,
    tipoCorrecao: 3,
    tipoPontuacao: 3,
    questoes: [
      /*{
        pergunta: "Qual é a cor da grama?",
        tipo: 1,
        resposta: "Verde",
        alternativas: [],
        valor: 70,
        tentativas: 0,
      },*/
      {
        pergunta: "Qual é a cor da grama?",
        tipo: 4,
        resposta: "",
        alternativas: [
          { texto: "A cor é Vermelha.", correta: false },
          { texto: "A cor é Verde.", correta: true },
          { texto: "A cor é Rosa.", correta: false },
          { texto: "A cor é Azul.", correta: false },
        ],
        valor: 30,
        tentativas: 0,
      },
      {
        pergunta: "Qual(is) deste(s) tem quatro patas?",
        tipo: 3,
        resposta: "",
        alternativas: [
          { texto: "Cachorro.", correta: true },
          { texto: "Pássaro.", correta: false },
          { texto: "Gato.", correta: true },
          { texto: "Centopéia.", correta: false },
        ],
        valor: 10,
        tentativas: 0,
      },
      {
        valor: 5,
        pergunta: "Complete a frase abaixo:",
        tags: ["astronomia", "cores", "química"],
        tipo: 5,
        nivelDificuldade: 4,
        opcoesParaPreencher: [
          { texto: "grama", opcaoSelecionada: null, ativa: true },
          { texto: "verde", opcaoSelecionada: null, ativa: true }
        ],
        textoParaPreencher: "A (1) geralemnte é da cor (2).",
        partesPreencher: [
          { conteudo: "A ", tipo: "texto" },
          { conteudo: 0, tipo: "select" },
          { conteudo: " geralmente é da cor ", tipo: "texto" },
          { conteudo: 1, tipo: "select" },
          { conteudo: ".", tipo: "texto" },
        ],
        correcaoProfessor: {
          nota: null,
          observacao: null,
        },
        correcoes: [],
        tentativas: 0,
      },

    ],
    alunos: [
      { nome: "Douglas Marques", email: 'Junqueira2@gmail.com', online: true, statusId: 1, instanciaStatusId: null },
      { nome: "Guilherme Cruz", email: 'Junqueira4@gmail.com', online: true, statusId: 1, instanciaStatusId: null },
      { nome: "Rafael Bini", email: 'rfabini1996@gmail.com', online: true, statusId: 1, instanciaStatusId: null },
    ],
  }

  public caminho: Array<UrlNode> = [
    { nome: `Aluno`, url: `/aluno` },
    { nome: `Avaliações`, url: `/aluno/avaliacoes` },
    { nome: `${this.avaliacao.titulo}`, url: `#` },
  ];

  ngOnInit(): void {

  }

  // EM PREPARAÇÃO
  addGrupo() {
    this.avaliacao.grupos.push({ numero: this.avaliacao.grupos.length + 1, instanciaId: `${(this.avaliacao.grupos.length + 1)}`, instanciaStatusId: 0, alunos: [] });
    setTimeout(() => {
      window.scroll({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 200);
  }
  entrarNoGrupo(grupo) {
    const me = this.comumService.loggedUser;

    // Passa por cada grupo da avaliação
    this.avaliacao.grupos.forEach(g => {
      // Se estou nesse grupo, me retiro
      if (g.alunos.includes(me)) {
        g.alunos = g.alunos.filter(a => a.email != me.email);
      }
    });

    // Insere no grupo
    grupo.alunos.push(me);
  }
  temGrupoVazio() {
    for (let g of this.avaliacao.grupos) {
      if (g.alunos.length <= 0)
        return true;
    };
    return false;
  }

  // DURANTE AVALIAÇÃO
  sinalizarFinalizacao() {
    this.finalizado = true;
    const EU = this.comumService.loggedUser;
    const MEU_INDEX_INSTANCIA = this.instancia.alunos.indexOf(this.instancia.alunos.filter(a => a.email == EU.email)[0]);
    this.instancia.alunos[MEU_INDEX_INSTANCIA].statusId = 3;
    console.log(this.getMinhaNota());
  }


  // ENCERRADA
  getMinhaNota() {
    var nota = 0;
    for (let questao of this.instancia.questoes) {
      const questaoTipo = this.comumService.questaoTipos[questao.tipo];
      if (questaoTipo.temCorrecaoAutomatica)
        nota += questaoTipo.getNota(questao);
    }
    return nota;
  }
}
