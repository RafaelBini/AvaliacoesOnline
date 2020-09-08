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
    tipoCorrecao: 0,
    tipoPontuacao: 0,
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

  public caminho: Array<UrlNode> = [
    { nome: `Aluno`, url: `/aluno` },
    { nome: `Avaliações`, url: `/aluno/avaliacoes` },
    { nome: `${this.avaliacao.titulo}`, url: `#` },
  ];

  ngOnInit(): void {

  }

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

}
