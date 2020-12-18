import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComumService } from '../../services/comum.service';
import { CredencialService } from '../../services/credencial.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { AjudaComponent } from 'src/app/dialogs/ajuda/ajuda.component';

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
    tags: [],
    img: null,
    acesso: 'aluno',
  };
  private todosUsuarios: Array<Usuario> = [];
  public novoUsuario: boolean = true;
  public usuarioJaAdicionado: boolean = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  constructor(
    private usuarioService: UsuarioService,
    private credencialService: CredencialService,
    private comumService: ComumService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.usuarioService.getAll().then(usuarios => {
      this.todosUsuarios = usuarios;
    });
  }

  verificarEmail() {

    const USUARIOS_ENCONTRADOS = this.todosUsuarios.concat().filter(u => u.email == this.aluno.email.toLowerCase());
    if (USUARIOS_ENCONTRADOS.length <= 0) {
      this.novoUsuario = true;
      this.usuarioJaAdicionado = false;
    }
    else {
      this.novoUsuario = false;
      this.usuarioJaAdicionado = this.credencialService.loggedUser.alunos.filter(meuAluno => meuAluno.id == USUARIOS_ENCONTRADOS[0].id).length > 0;
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
      this.credencialService.cadastrar(this.aluno).then(usuarioInserido => {
        this.adicionar(usuarioInserido);
      }).catch(reason => this.comumService.notificarErro("Falha ao cadastrar aluno no banco de dados", reason));;
    }).catch(reason => this.comumService.notificarErro(reason, reason));
  }

  adicionar(aluno: Usuario) {
    if (aluno.email == this.credencialService.loggedUser.email) {
      this.snack.open("Você não pode se adicionar como aluno", null, { duration: 3500 });
      return;
    }
    this.credencialService.loggedUser.alunos.push({
      id: aluno.id,
      nome: aluno.nome,
      email: aluno.email,
      tags: aluno.tags || null,
      img: aluno.img || null,
      tagIdExterno: aluno.tagIdExterno || null,
      idExterno: aluno.idExterno || null,
    });

    this.usuarioService.update(this.credencialService.loggedUser).then(() => {
      this.aluno = {
        nome: "",
        email: "",
        senha: "",
        tipo: "",
        tags: [],
        idExterno: "",
        img: null,
      };
      this.snack.open("Aluno adicionado!", null, { duration: 3500 });
    })
      .catch(reason => this.comumService.notificarErro("Falha ao adicionar aluno ao Professor", reason));

  }

  abrirAjudaSenha() {
    this.dialog.open(AjudaComponent, {
      data: {
        titulo: "Senha do Aluno",
        mensagem:
          `
        Essa senha servirá para o aluno acessar a conta que você criou para o email dele.
        `
      }
    })
  }

}
