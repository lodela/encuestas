import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { PreguntaComponent } from './pregunta-card/pregunta.component';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {
  @ViewChild('ref', { read: PreguntaComponent })

  ref: PreguntaComponent;
  loading: any;

  user: string;
  isAdmin: boolean;
  questionsLength = 0;
  progress = 0;
  lectura: string;

  constructor(
    public menucontroler: MenuController,
    public loadingController: LoadingController,
    private auth: AuthService,
    public router: Router
  ) { }

  async presentLoading(css?: string, message?: string, duration?: number) {
    this.loading = await this.loadingController.create({
      cssClass: css ? css : 'success',
      message: message ? message : 'Please wait...',
      duration: duration ? duration : 1500
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
  }

  ngOnInit() {
    this.isLoggedIn();
    this.lectura = 'Are you experiencing any of the combination of the following symptons?';
  }

  openMenu() {
    this.menucontroler.open('principal');
  }
  isLoggedIn() {
    this.auth.isLogedIn().subscribe(
      res => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        res === false ? this.router.navigate([`login/`]) : null;
        if (sessionStorage.getItem('sesion')) {
          this.user = JSON.parse(sessionStorage.getItem('sesion')).id;
          this.isAdmin = JSON.parse(sessionStorage.getItem('sesion')).pos === 'admin';
        }
      }
    );
  }
  logOut() {
    this.auth.logout();
    this.user = null;
    this.isAdmin = null;
  }
  nextQuote(event) {
    this.ref.next();
  }
  questLength(e: number): void {
    const no = Number(e);
    this.questionsLength = no;
  }
  indexQuestion(e: any): void {
    this.progress = e;
  }
  setMensaje(e: string) {
    this.lectura = e;
  }
  getBack() {
    this.ref.clearAll();
  }
  goHome() {
    this.router.navigate([`home/`]);
  }

}
