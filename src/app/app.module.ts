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
    AlunoNovoComponent
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
    FormsModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
