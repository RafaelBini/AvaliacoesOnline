import { Component, OnInit } from '@angular/core';
import { Professor } from 'src/app/professor';

@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit {
  public isDisabled = true;
  public divNovaSenha = false;
  public senha = "professor";
  public novaSenha = "";
  public prof = new Professor("professor@gmail.com", "professor", "");
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
    //this.senha = this.novaSenha;
    //this.teste[0].senha = this.teste[0].nova_senha;
    if(this.prof.novaSenha != ""){
      this.prof.senha = this.prof.novaSenha;
      this.prof.novaSenha = " ";
    }
  }

}
