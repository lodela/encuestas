import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetPreguntasComponent } from './backend/set-preguntas/set-preguntas.component';
import { PreguntasTableComponent } from './backend/preguntas-table/preguntas-table.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/start/start.module').then(m => m.StartPageModule)
  },
  {
    path: 'encuesta',
    loadChildren: () => import('./pages/encuesta/encuesta.module').then(m => m.EncuestaPageModule)
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        component: PreguntasTableComponent
      },
      {
        path: ':preguntaId',
        component: SetPreguntasComponent
      }
    ]
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then(m => m.StartPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
