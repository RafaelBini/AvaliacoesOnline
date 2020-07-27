import { AvaliacaoProfessorComponent } from './components/avaliacao-professor/avaliacao-professor.component';
import { AvaliacaoNovaComponent } from './components/avaliacao-nova/avaliacao-nova.component';
import { ProfessorComponent } from './components/professor/professor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: "professor", component: ProfessorComponent },
  { path: "nova-avaliacao", component: AvaliacaoNovaComponent },
  { path: "professor/avaliacao/:id", component: AvaliacaoProfessorComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
