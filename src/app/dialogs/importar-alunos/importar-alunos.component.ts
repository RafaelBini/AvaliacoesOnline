import { ComumService } from './../../services/comum.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CredencialService } from 'src/app/services/credencial.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-importar-alunos',
  templateUrl: './importar-alunos.component.html',
  styleUrls: ['./importar-alunos.component.css']
})
export class ImportarAlunosComponent implements OnInit {
  public novosAlunos: Array<Usuario> = [];
  public novosAlunosSelecionados: Array<Usuario> = [];
  private todosUsuarios: Array<Usuario> = [];

  public alunosIndexJaAdicionados: number[] = [];
  public alunosIndexJaPersistidos: number[] = [];
  public alunosParaCadastrar: Usuario[] = [];
  public alunosParaAdicionar: Usuario[] = [];
  public alunosIndexComProblemas: { index: number, problema: string }[] = [];


  constructor(
    private credencialService: CredencialService,
    private comumService: ComumService,
    private snack: MatSnackBar,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<ImportarAlunosComponent>,
  ) { }

  ngOnInit(): void {
    this.usuarioService.getAll().then(usuarios => {
      this.todosUsuarios = usuarios;
    });
  }

  receberArquivo(event, tipo: 'clicked' | 'dropped') {

    var arquivos: File[] = null;

    if (tipo == 'dropped') {
      arquivos = event;
    }
    else if (tipo == 'clicked') {
      arquivos = event.target.files;
    }

    if (arquivos == null || arquivos.length <= 0)
      return;

    for (let arquivo of arquivos) {

      if (!arquivo.name.split('.')[arquivo.name.split('.').length - 1].includes('csv'))
        continue;

      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        const TEXTO: string = fileReader.result.toString();
        const LINHAS = TEXTO.split('\r\n');

        var tagIdExterno = "idExterno";

        for (let [index, linha] of LINHAS.entries()) {
          const colunas = linha.split(';');

          if (colunas.length <= 0)
            continue;

          if (colunas[0] == "")
            continue;

          var idExterno = colunas[0];
          var nome = this.credencialService.getProperCase(colunas[1]);
          var email = colunas[2].toLowerCase();
          var senha = idExterno;

          if (index == 0) {
            tagIdExterno = idExterno;
            continue;
          }



          var novoAluno: Usuario;
          const USUARIO_CADASTRADO = this.usuarioJaCadastrado(email);
          if (USUARIO_CADASTRADO == null) {
            novoAluno = {
              tagIdExterno: tagIdExterno,
              idExterno: idExterno,
              nome: nome,
              email: email,
              senha: senha,
              img: null,
              tags: [],
            };
          }
          else {
            novoAluno = {
              id: USUARIO_CADASTRADO.id,
              tagIdExterno: tagIdExterno,
              idExterno: colunas[0],
              nome: USUARIO_CADASTRADO.nome,
              email: email,
              img: USUARIO_CADASTRADO.img ? USUARIO_CADASTRADO.img : null,
              tags: [],
            };
          }

          this.novosAlunos.push(novoAluno);
        }

        this.atualizarValidacoes();

      }
      fileReader.readAsText(arquivo);
    }



  }


  usuarioJaCadastrado(email: string) {
    for (let usuario of this.todosUsuarios)
      if (usuario.email == email)
        return usuario;
    return null;
  }

  isAlunoJaPersistido(alunoIndex: number): boolean {
    return this.alunosIndexJaPersistidos.includes(alunoIndex);
  }

  isAlunoJaAdicionado(alunoIndex: number): boolean {
    return this.alunosIndexJaAdicionados.includes(alunoIndex);
  }

  isAlunoComProblemas(alunoIndex: number): boolean {
    return this.alunosIndexComProblemas.filter(a => a.index == alunoIndex).length > 0;
  }

  isAlunoParaSerCadastrado(aluno: Usuario) {
    return this.alunosParaCadastrar.filter(a => a.email == aluno.email).length > 0;
  }

  isAlunoParaSerAdicionado(aluno: Usuario) {
    return this.alunosParaAdicionar.filter(a => a.email == aluno.email).length > 0;
  }

  removerAluno(alunoIndex) {
    this.novosAlunos.splice(alunoIndex, 1);

    this.atualizarValidacoes();
  }


  atualizarValidacoes() {
    this.alunosIndexJaAdicionados = [];
    this.alunosIndexJaPersistidos = [];
    this.alunosParaCadastrar = [];
    this.alunosParaAdicionar = [];
    this.alunosIndexComProblemas = [];

    for (let [index, novoAluno] of this.novosAlunos.entries()) {

      // Verfica se está com problemas
      if (this.credencialService.getProblemaFromNovoUsuario(novoAluno, novoAluno.senha) == null) {
        // Sinaliza se já foi adicionado
        if (this.novosAlunos.filter(na => na.email == novoAluno.email).length > 0 && this.alunosParaAdicionar.filter(apc => apc.email == novoAluno.email).length > 0) {
          this.alunosIndexJaAdicionados.push(index);
        }
        else if (this.credencialService.loggedUser.alunos.filter(a => a.email == novoAluno.email).length > 0) {
          this.alunosIndexJaAdicionados.push(index);
        }
        else {
          // Sinaliza se já foi persistido
          if (this.usuarioJaCadastrado(novoAluno.email) != null) {
            this.alunosIndexJaPersistidos.push(index);
            if (this.alunosParaAdicionar.filter(apc => apc.email == novoAluno.email).length <= 0)
              this.alunosParaAdicionar.push(novoAluno);
          }
          // Sinaliza para cadastrar
          else if (this.alunosParaCadastrar.filter(apc => apc.email == novoAluno.email).length <= 0) {
            this.alunosParaAdicionar.push(novoAluno);
            this.alunosParaCadastrar.push(novoAluno);
          }
        }
      }
      else {
        this.alunosIndexComProblemas.push({
          index: index,
          problema: this.credencialService.getProblemaFromNovoUsuario(novoAluno, novoAluno.senha),
        })
      };

    }
  }

  getAlunoIndexComProblemas(alunoIndex) {
    return this.alunosIndexComProblemas.filter(a => a.index == alunoIndex)[0];
  }

  finalizarImportacao() {
    var teveErro = false;
    for (let [index, alunoParaAdd] of this.alunosParaAdicionar.entries()) {

      if (this.isAlunoParaSerCadastrado(alunoParaAdd)) {
        this.credencialService.isNovoUsuarioValido(alunoParaAdd, alunoParaAdd.senha).then(() => {
          this.credencialService.cadastrar(alunoParaAdd).then(usuarioInserido => {
            this.adicionar(usuarioInserido);
          }).catch(reason => {
            teveErro = true;
            this.comumService.notificarErro(`Falha ao cadastrar o aluno ${alunoParaAdd.nome} no banco de dados`, reason)
          });
        }).catch(reason => {
          teveErro = true;
          this.comumService.notificarErro(reason, reason)
        });
      }
      else {
        this.adicionar(alunoParaAdd);
      }

    }
    if (!teveErro) {
      this.usuarioService.update(this.credencialService.loggedUser).then(() => {

      }).catch(reason => this.comumService.notificarErro("Falha ao adicionar aluno ao Professor", reason));
      this.dialogRef.close();
    }


  }

  adicionar(aluno: Usuario) {
    this.credencialService.loggedUser.alunos.push({
      id: aluno.id,
      idExterno: aluno.idExterno,
      tagIdExterno: aluno.tagIdExterno,
      nome: aluno.nome,
      email: aluno.email,
      tags: aluno.tags,
      img: aluno.img,
    });


  }

}