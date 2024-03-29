import { AvaliacaoAlunoGuard } from './guards/avaliacao-aluno.guard';
import { AvaliacaoProfessorGuard } from './guards/avaliacao-professor.guard';
import { HomeGuard } from './guards/home.guard';
import { AuthGuard } from './guards/auth.guard';
import { ProvaImprimirComponent } from './components/prova-imprimir/prova-imprimir.component';
import { HomeComponent } from './components/home/home.component';
import { AvaliacaoAlunoComponent } from './components/avaliacao-aluno/avaliacao-aluno.component';
import { LoginComponent } from './components/login/login.component';
import { AvaliacaoCorrecaoComponent } from './components/avaliacao-correcao/avaliacao-correcao.component';
import { AvaliacaoProfessorComponent } from './components/avaliacao-professor/avaliacao-professor.component';
import { AvaliacaoNovaComponent } from './components/avaliacao-nova/avaliacao-nova.component';
import { ProfessorComponent } from './components/professor/professor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlunoComponent } from './components/aluno/aluno.component';
import { AvaliacaoGuard } from './guards/avaliacao.guard';


const routes: Routes = [
  { path: "professor", component: ProfessorComponent, canActivate: [AuthGuard] },
  { path: "professor/:tab", component: ProfessorComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "aluno", component: AlunoComponent, canActivate: [AuthGuard] },
  { path: "aluno/:tab", component: AlunoComponent, canActivate: [AuthGuard] },
  { path: "professor/avaliacao/imprimir/:id", component: ProvaImprimirComponent, canActivate: [AvaliacaoProfessorGuard] },
  { path: "professor/avaliacao/correcao/:id", component: AvaliacaoCorrecaoComponent, canActivate: [AuthGuard] },
  { path: "professor/avaliacao/nova", component: AvaliacaoNovaComponent, canActivate: [AuthGuard] },
  { path: "professor/avaliacao/editar/:id", component: AvaliacaoNovaComponent, canActivate: [AvaliacaoProfessorGuard] },
  { path: "professor/avaliacao/:tipo/:id", component: AvaliacaoNovaComponent, canActivate: [AvaliacaoProfessorGuard] },
  { path: "professor/avaliacao/:id", component: AvaliacaoProfessorComponent, canActivate: [AvaliacaoProfessorGuard] },

  { path: "aluno/avaliacao/:id", component: AvaliacaoAlunoComponent, canActivate: [AvaliacaoAlunoGuard] },
  { path: "aluno/avaliacao/correcao/:id", component: AvaliacaoCorrecaoComponent, canActivate: [AuthGuard] },
  { path: "aluno/avaliacao/consulta/:id", component: AvaliacaoCorrecaoComponent, canActivate: [AuthGuard] },
  { path: ":id", component: LoginComponent, canActivate: [AvaliacaoGuard] },
  { path: "", component: HomeComponent, canActivate: [HomeGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
