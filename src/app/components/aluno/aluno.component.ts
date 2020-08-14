import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css']
})
export class AlunoComponent implements OnInit {
  public alterar = false;
  public avaliacoes = [
    { nomeAvaliacao: 'Avaliação 01', nomeProfessor: 'Paulo', nota: '-', status: 'Em Correção', color: 'var(--em-correcao)' },
    { nomeAvaliacao: 'Avaliação 02', nomeProfessor: 'Dieval', nota: '55', status: 'Encerrada', color: 'var(--encerrada)' },
    { nomeAvaliacao: 'Avaliação 03', nomeProfessor: 'Carlos Felipe', nota: '-', status: 'Em Preparação', color: 'var(--em-preparacao)' },
    { nomeAvaliacao: 'Avaliação 04', nomeProfessor: 'Matheus Leonardo', nota: '-', status: 'Em Preparação', color: 'var(--em-preparacao)' },
    { nomeAvaliacao: 'Avaliação 05', nomeProfessor: 'Sandramara', nota: '-', status: 'Durante Avaliação', color: 'var(--em-avaliacao)' },
    { nomeAvaliacao: 'Avaliação 06', nomeProfessor: 'Marcos Kerchner', nota: '-', status: 'Em Correção', color: 'var(--em-correcao)' },
    { nomeAvaliacao: 'Matéria Teste 07', nomeProfessor: 'Rafael Bini', nota: '80', status: 'Encerrada', color: 'var(--encerrada)' },
    { nomeAvaliacao: 'Matéria Teste 08', nomeProfessor: 'João Sorrisão', nota: '94', status: 'Encerrada', color: 'var(--encerrada)' },

  ]
  constructor() { }



  ngOnInit(): void {
  }



}
