import { AvaliacaoAlunoComponent } from './components/avaliacao-aluno/avaliacao-aluno.component';
import { LoginComponent } from './components/login/login.component';
import { AvaliacaoCorrecaoComponent } from './components/avaliacao-correcao/avaliacao-correcao.component';
import { AvaliacaoProfessorComponent } from './components/avaliacao-professor/avaliacao-professor.component';
import { AvaliacaoNovaComponent } from './components/avaliacao-nova/avaliacao-nova.component';
import { ProfessorComponent } from './components/professor/professor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlunoNovoComponent } from './components/aluno-novo/aluno-novo.component';
import { AlunoComponent } from './components/aluno/aluno.component';


const routes: Routes = [
  { path: "professor/aluno/novo", component: AlunoNovoComponent },
  { path: "professor", component: ProfessorComponent },
  { path: "professor/:tab", component: ProfessorComponent },
  { path: "login", component: LoginComponent },
  { path: "aluno", component: AlunoComponent },
  { path: "aluno/:tab", component: AlunoComponent },
  { path: "professor/avaliacao/correcao/:id", component: AvaliacaoCorrecaoComponent },
  { path: "professor/avaliacao/nova", component: AvaliacaoNovaComponent },
  { path: "professor/avaliacao/:id", component: AvaliacaoProfessorComponent },
  { path: "aluno/avaliacao/:id", component: AvaliacaoAlunoComponent },
  { path: "aluno/avaliacao/correcao/:id", component: AvaliacaoCorrecaoComponent },
  { path: "aluno/avaliacao/consulta/:id", component: AvaliacaoCorrecaoComponent },
  { path: ":id", component: LoginComponent },
  { path: "", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
