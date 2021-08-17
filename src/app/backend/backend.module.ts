import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SetPreguntasComponent } from './set-preguntas/set-preguntas.component';
import { PreguntasTableComponent } from './preguntas-table/preguntas-table.component';
import { ModalPage } from './modal/modal.component';
@NgModule({
  declarations: [
    SetPreguntasComponent,
    PreguntasTableComponent,
    ModalPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class BackendModule { }
