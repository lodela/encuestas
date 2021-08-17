import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit, AfterViewInit {

  user: string;
  isAdmin: boolean;
  loading: any;

  upload = {
    message: '',
    initMsg: 'Subir Resultados',
    endMsg: 'Nada que subir',
    disabled: false,
    upToDate: false
  };

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
    this.presentLoading();
  }
  ngAfterViewInit() {
    this.isLoggedIn();
    this.upload.message = this.upload.initMsg;
  }

  getUser() {
    // this.loading.dismiss();
    if (sessionStorage.getItem('sesion')) {
      this.user = JSON.parse(sessionStorage.getItem('sesion')).id;
      this.isAdmin = JSON.parse(sessionStorage.getItem('sesion')).pos === 'admin';
    }
  }

  openMenu() {
    this.menucontroler.open('principal');
  }

  isLoggedIn() {
    this.auth.isLogedIn().subscribe(
      res => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        res === false ? this.router.navigate([`login/`]) : null;
        this.getUser();
      }
    );
  }

  logOut() {
    this.auth.logout();
    this.user = null;
    this.isAdmin = null;
  }
  subirDatos() {
    this.presentLoading('danger', 'Subiendo datos... Espere!', 3000).then(
      res => {
        this.upload.message = this.upload.endMsg;
        this.upload.disabled = true;
        this.upload.upToDate = true;
      }
    );
  }
  goTo(go: string) {
    this.router.navigate([go]);
  }


}
