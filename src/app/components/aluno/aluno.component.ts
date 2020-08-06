import { Component, OnInit } from '@angular/core';
import { Aluno } from 'src/app/aluno';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css']
})
export class AlunoComponent implements OnInit {
  public isDisabled = true;
  public divNovaSenha = false;
  public novaSenha = "";
  public aluno = new Aluno("grr20181234", "Aluno Teste", "aluno@gmail.com", "TADS2020");
  constructor() { }

  ngOnInit(): void {
  }

  alterarSenha(){
    this.isDisabled = false;
    this.divNovaSenha = true;
  }

  editar(){
    this.isDisabled = true;
    this.divNovaSenha = false;
    confirm("Sua senha foi alterada com sucesso");
  }

}
