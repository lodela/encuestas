import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MainNavComponent } from './shared/main-nav/main-nav.component';

@NgModule({
  declarations: [MainNavComponent],
  imports: [
    CommonModule,
    IonicModule,
    IonicModule.forRoot(),
    MainNavComponent
  ]
})
export class PagesModule { }
