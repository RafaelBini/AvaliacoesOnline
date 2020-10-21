import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfessorComponent } from './components/professor/professor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvaliacaoProfessorComponent } from './components/avaliacao-professor/avaliacao-professor.component';
import { AvaliacaoNovaComponent } from './components/avaliacao-nova/avaliacao-nova.component';
import { AvaliacaoCriadaDialogComponent } from './dialogs/avaliacao-criada-dialog/avaliacao-criada-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AvaliacaoCorrecaoComponent } from './components/avaliacao-correcao/avaliacao-correcao.component';
import { LoginComponent } from './components/login/login.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AvaliacaoAlunoComponent } from './components/avaliacao-aluno/avaliacao-aluno.component';
import { AlunoComponent } from './components/aluno/aluno.component';
import { AlunoNovoComponent } from './components/aluno-novo/aluno-novo.component';
import { InfoQuestaoComponent } from './dialogs/info-questao/info-questao.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BuscarQuestaoComponent } from './dialogs/buscar-questao/buscar-questao.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { EscolherTipoComponent } from './dialogs/escolher-tipo/escolher-tipo.component';
import { MatRadioModule } from '@angular/material/radio';
import { CadastrarSeComponent } from './dialogs/cadastrar-se/cadastrar-se.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { BarraNavegacaoComponent } from './components/barra-navegacao/barra-navegacao.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { QuestoesCorrigirComponent } from './components/questoes-corrigir/questoes-corrigir.component';
import { QuestoesEditarComponent } from './components/questoes-editar/questoes-editar.component';
import { QuestoesResponderComponent } from './components/questoes-responder/questoes-responder.component';
import { MatMenuModule } from '@angular/material/menu';
import { AvaliacaoCardComponent } from './components/avaliacao-card/avaliacao-card.component';
import { MatListModule } from '@angular/material/list';
import { UsuarioPerfilEditarComponent } from './components/usuario-perfil-editar/usuario-perfil-editar.component';
import { AlunoCardAvaliacaoProfessorComponent } from './components/avaliacao-professor/aluno-card-avaliacao-professor/aluno-card-avaliacao-professor.component';
import { ConfirmarComponent } from './dialogs/confirmar/confirmar.component';
import { AlunoCardAvaliacaoAlunoComponent } from './components/avaliacao-aluno/aluno-card-avaliacao-aluno/aluno-card-avaliacao-aluno.component';
import { HomeComponent } from './components/home/home.component';
import { AvaliacaoListaComponent } from './components/avaliacao-lista/avaliacao-lista.component';
import { environment } from 'src/environments/environment';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { EditarAlunoComponent } from './dialogs/editar-aluno/editar-aluno.component';
import { AvaliacaoAlunoCabecalhoComponent } from './components/avaliacao-aluno/avaliacao-aluno-cabecalho/avaliacao-aluno-cabecalho.component';
import { SelecionarAlunosComponent } from './dialogs/selecionar-alunos/selecionar-alunos.component';
import { HttpClientModule } from '@angular/common/http';
import { GabaritoQuestaoComponent } from './dialogs/gabarito-questao/gabarito-questao.component';
import { DetalhesProvaComponent } from './dialogs/detalhes-prova/detalhes-prova.component';
import { ImagemAmpliadaComponent } from './dialogs/imagem-ampliada/imagem-ampliada.component';
import { DropFileDirective } from './directives/drop-file.directive';
import { ArquivoAnexoComponent } from './components/arquivo-anexo/arquivo-anexo.component';
import { ArquivoImagemComponent } from './components/arquivo-imagem/arquivo-imagem.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfessorComponent,
    AvaliacaoProfessorComponent,
    AvaliacaoNovaComponent,
    AvaliacaoCriadaDialogComponent,
    AvaliacaoCorrecaoComponent,
    LoginComponent,
    AvaliacaoAlunoComponent,
    AlunoComponent,
    AlunoNovoComponent,
    InfoQuestaoComponent,
    BuscarQuestaoComponent,
    EscolherTipoComponent,
    CadastrarSeComponent,
    SafeHtmlPipe,
    BarraNavegacaoComponent,
    CountdownComponent,
    QuestoesCorrigirComponent,
    QuestoesEditarComponent,
    QuestoesResponderComponent,
    AvaliacaoCardComponent,
    UsuarioPerfilEditarComponent,
    AlunoCardAvaliacaoProfessorComponent,
    ConfirmarComponent,
    AlunoCardAvaliacaoAlunoComponent,
    HomeComponent,
    AvaliacaoListaComponent,
    EditarAlunoComponent,
    AvaliacaoAlunoCabecalhoComponent,
    SelecionarAlunosComponent,
    GabaritoQuestaoComponent,
    DetalhesProvaComponent,
    ImagemAmpliadaComponent,
    DropFileDirective,
    ArquivoAnexoComponent,
    ArquivoImagemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatStepperModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatTooltipModule,
    DragDropModule,
    MatButtonToggleModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatRadioModule,
    MatMenuModule,
    MatListModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ClipboardModule,
    HttpClientModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
