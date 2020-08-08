import { Component, OnInit } from '@angular/core';
import { Aluno } from 'src/app/models/aluno';

@Component({
  selector: 'app-aluno-novo',
  templateUrl: './aluno-novo.component.html',
  styleUrls: ['./aluno-novo.component.css']
})
export class AlunoNovoComponent implements OnInit {
  public aluno = new Aluno("", "", "", "TADS2020");
  constructor() { }

  ngOnInit(): void {
  }


}
