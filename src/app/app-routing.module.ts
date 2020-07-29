import { AvaliacaoAlunoComponent } from './components/avaliacao-aluno/avaliacao-aluno.component';
import { LoginComponent } from './components/login/login.component';
import { AvaliacaoCorrecaoComponent } from './components/avaliacao-correcao/avaliacao-correcao.component';
import { AvaliacaoProfessorComponent } from './components/avaliacao-professor/avaliacao-professor.component';
import { AvaliacaoNovaComponent } from './components/avaliacao-nova/avaliacao-nova.component';
import { ProfessorComponent } from './components/professor/professor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: "professor", component: ProfessorComponent },
  { path: "nova-avaliacao", component: AvaliacaoNovaComponent },
  { path: "professor/avaliacao/:id", component: AvaliacaoProfessorComponent },
  { path: "professor/avaliacao/correcao/:id", component: AvaliacaoCorrecaoComponent },
  { path: "login", component: LoginComponent },
  { path: "aluno/avaliacao/:id", component: AvaliacaoAlunoComponent },
  { path: "aluno/avaliacao/correcao/:id", component: AvaliacaoCorrecaoComponent },
  { path: "avaliacao/correcao/:id", component: AvaliacaoCorrecaoComponent },
  { path: ":id", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
