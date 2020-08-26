import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfessorComponent } from './components/professor/professor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
  ],
  providers: [

  ],
  bootstrap: [AppComponent],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
