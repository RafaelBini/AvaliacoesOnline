import { CredencialService } from 'src/app/services/credencial.service';
import { FileService } from './../../services/file.service';
import { MatDialog } from '@angular/material/dialog';
import { Arquivo } from './../../models/arquivo';
import { Questao } from 'src/app/models/questao';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImagemAmpliadaComponent } from 'src/app/dialogs/imagem-ampliada/imagem-ampliada.component';
import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-arquivo-imagem',
  templateUrl: './arquivo-imagem.component.html',
  styleUrls: ['./arquivo-imagem.component.css']
})
export class ArquivoImagemComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private fileService: FileService,
    private credencialService: CredencialService,
  ) { }

  @Input() questao: Questao;
  @Input() file: Arquivo;
  @Input() imagemIndex: number;
  @Input() editando: boolean = false;
  @Input() tipo: 'imagens' | 'imagensEntregues' = 'imagens';

  @Output() imagemRemovida = new EventEmitter<void>();
  @Output() descricaoAlterada = new EventEmitter<void>();

  ngOnInit(): void {
  }

  removerImagem(questao: Questao, imagemIndex: number) {
    if (this.tipo == 'imagens') {
      // Remove no fire
      this.fileService.delete(questao.imagens[imagemIndex].caminhoArquivo);
      // Remove daqui
      questao.imagens.splice(imagemIndex, 1);
    }
    else if (this.tipo == 'imagensEntregues') {
      // Remove no fire
      this.fileService.delete(questao.imagensEntregues[imagemIndex].caminhoArquivo);
      // Remove daqui
      questao.imagensEntregues.splice(imagemIndex, 1);
      this.imagemRemovida.emit();
    }

  }
  cancelarUploadImagem(anexo: Arquivo) {
    var diagRef = this.dialog.open(ConfirmarComponent, {
      data: {
        titulo: "Cancelar Upload",
        mensagem: `Você tem certeza de que deseja cancelar o upload do arquivo ${anexo.nomeArquivo}?`
      }
    });
    diagRef.afterClosed().subscribe(result => {
      if (result == true) {
        anexo.descricao = "cancelar";
      }
    });

  }
  ampliarImagem(imagem: Arquivo) {
    this.dialog.open(ImagemAmpliadaComponent, {
      data: imagem,
      width: '85%',
      height: '90%',
    })
  }
  notificarDescricaoAlterada() {
    this.descricaoAlterada.emit();
  }
  isLocked(questao: Questao) {
    if (questao.usuarioUltimaModificacao == null) {
      return false;
    }
    return (questao.usuarioUltimaModificacao.id != this.credencialService.getLoggedUserIdFromCookie());
  }
  onDissertativaFocus(questao: Questao) {
    var usuario: Usuario = {
      id: this.credencialService.getLoggedUserIdFromCookie(),
      nome: this.credencialService.loggedUser.nome,
    }
    questao.usuarioUltimaModificacao = usuario;
    this.descricaoAlterada.emit();
  }
  onDissertativaBlur(questao: Questao) {
    questao.usuarioUltimaModificacao = null;
    this.descricaoAlterada.emit();
  }
}
