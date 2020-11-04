import { Md5 } from 'ts-md5/dist/md5';
import { FileService } from './../../services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from './../../services/usuario.service';
import { CredencialService } from 'src/app/services/credencial.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-usuario-perfil-editar',
  templateUrl: './usuario-perfil-editar.component.html',
  styleUrls: ['./usuario-perfil-editar.component.css']
})
export class UsuarioPerfilEditarComponent implements OnInit {
  public alterar = false;

  public usuario: Usuario = {
    id: '',
    nome: '',
    email: ''
  };
  public confirmacaoSenha: string;

  constructor(
    private snack: MatSnackBar,
    public credencialService: CredencialService,
    private usuarioService: UsuarioService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    var ref = setInterval(() => {
      if (this.credencialService.loggedUser.id != null) {
        this.usuario = { ...this.credencialService.loggedUser };
        this.usuario.senha = '';
        clearInterval(ref);
      }
    }, 100);
  }

  onImagemSelected(evento) {

    if (evento.target.files.length <= 0) {
      return;
    }

    if (this.usuario.img != null) {
      if (this.usuario.img.url != '' && this.usuario.img.url != null) {
        this.fileService.delete(this.usuario.img.caminhoArquivo)
      }
    }

    const tiposPermitidos = ['image']
    const file = evento.target.files[0];

    const TIPO = file.type.split('/')[0];
    const TAMANHO_MAXIMO = 50000000;

    if (!tiposPermitidos.includes(TIPO)) {
      this.snack.open(`O formato ${TIPO} não é permitido`, null, {
        duration: 3500,
      });
      return;
    }
    if (file.size > TAMANHO_MAXIMO) {
      this.snack.open(`Não é possivel subir arquivos com mais de 50MB`, null, {
        duration: 3500,
      });
      return;
    }

    const CAMINHO: string = `${new Date().getTime()}_${file.name}`;

    this.usuario.img = {
      nomeArquivo: file.name,
      caminhoArquivo: CAMINHO,
      tamanho: file.size,
      tipo: TIPO,
      tipoCompleto: file.type,
      percentual: 0,
      url: '',
    };


    var uploadTask = this.fileService.upload(CAMINHO, file);

    uploadTask.percentageChanges().subscribe(percentual => {
      if (this.usuario.img.descricao == "cancelar") {
        uploadTask.cancel();
        return;
      }
      this.usuario.img.percentual = percentual;
    });

    uploadTask.then(uploadTaskSnap => {

      uploadTaskSnap.ref.getDownloadURL().then(url => {
        this.usuario.img.url = url;
        this.salvar();
      })
        .catch(reason => {
          console.log(reason);
        });
    })
      .catch(reason => {
        console.log(reason);
      });


  }

  salvar() {

    var usuarioParaInserir = { ...this.usuario };

    if (!this.alterar) {
      delete usuarioParaInserir.senha;
      this.confirmacaoSenha = null;
    }


    this.credencialService.isNovoUsuarioValido(usuarioParaInserir, this.confirmacaoSenha).then(() => {

      if (this.alterar)
        usuarioParaInserir.senha = Md5.hashStr(usuarioParaInserir.senha).toString();

      this.usuarioService.update(usuarioParaInserir).then(() => {
        this.snack.open("Dados salvos", null, {
          duration: 3500,
        });
        this.credencialService.loggedUser = usuarioParaInserir;
        if (this.alterar) {
          this.usuario.senha = "";
          this.alterar = false;
        }
      }).catch(reason => {
        this.snack.open(reason, null, {
          duration: 3500,
        });
      });
    }).catch(reason => {
      this.snack.open(reason, null, {
        duration: 3500,
      });
    });





  }

}
