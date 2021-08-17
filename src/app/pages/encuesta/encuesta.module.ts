import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaPageRoutingModule } from './encuesta-routing.module';

import { EncuestaPage } from './encuesta.page';

import { PreguntaComponent } from './pregunta-card/pregunta.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicModule,
    EncuestaPageRoutingModule
  ],
  declarations: [EncuestaPage, PreguntaComponent]
})
export class EncuestaPageModule { }
