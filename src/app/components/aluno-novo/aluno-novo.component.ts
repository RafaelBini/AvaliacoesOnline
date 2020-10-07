import { MatSnackBar } from '@angular/material/snack-bar';
import { ComumService } from './../../services/comum.service';
import { CredencialService } from './../../services/credencial.service';
import { UsuarioService } from './../../services/usuario.service';
import { Usuario } from './../../models/usuario';
import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-aluno-novo',
  templateUrl: './aluno-novo.component.html',
  styleUrls: ['./aluno-novo.component.css']
})
export class AlunoNovoComponent implements OnInit {
  public aluno: Usuario = {
    nome: "",
    email: "",
    senha: "",
    tipo: "",
    tags: []
  };
  private todosUsuarios: Array<Usuario> = [];
  public novoUsuario: boolean = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  constructor(
    private usuarioService: UsuarioService,
    private credencialService: CredencialService,
    private comumService: ComumService,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.usuarioService.getAll().then(usuarios => {
      this.todosUsuarios = usuarios;
    });
  }

  verificarEmail() {
    const USUARIOS_ENCONTRADOS = this.todosUsuarios.concat().filter(u => u.email == this.aluno.email);
    if (USUARIOS_ENCONTRADOS.length <= 0) {
      this.novoUsuario = true;
    }
    else {
      this.novoUsuario = false;
      this.aluno = { ...USUARIOS_ENCONTRADOS[0] };
      this.aluno.senha = "";
      this.aluno.tags = [];
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.aluno.tags.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeTag(tema: any): void {
    const index = this.aluno.tags.indexOf(tema);

    if (index >= 0) {
      this.aluno.tags.splice(index, 1);
    }
  }

  cadastrar() {
    this.credencialService.isNovoUsuarioValido(this.aluno, this.aluno.senha).then(() => {
      this.usuarioService.insert(this.aluno).then(docRef => {
        this.aluno.id = docRef.id;
        this.adicionar();
      }).catch(reason => this.comumService.notificarErro("Falha ao cadastrar aluno no banco de dados", reason));;
    }).catch(reason => this.comumService.notificarErro(reason, reason));
  }

  adicionar() {
    this.credencialService.loggedUser.alunos.push({
      id: this.aluno.id,
      nome: this.aluno.nome,
      email: this.aluno.email,
      tags: this.aluno.tags,
    });
    this.usuarioService.update(this.credencialService.loggedUser);
    this.aluno = {
      nome: "",
      email: "",
      senha: "",
      tipo: "",
      tags: []
    };
    this.snack.open("Aluno adicionado!", null, { duration: 3500 });
  }

}
