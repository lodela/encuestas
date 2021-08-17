import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
  // @ViewChild('key', { static: true }) key: ElementRef;

  key: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() { }
  ngAfterViewInit(): void {
    // this.key.nativeElement.focus();

  }

  submit() {
    if (this.key && this.key.length >= 6) {
      this.auth.login(this.key).then(
        resp => {
          this.key = null;
          this.router.navigate([`home/`]);
        }
      ).catch(err => {
        this.presentAlert('Error!', 'Porfavor revisa que tu llave sea correcta.', 'danger');
      });

    } else {
      return;
    }
  }
  async presentAlert(title: string, msg: string, css: string) {
    const alert = await this.alertController.create({
      cssClass: css,
      header: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
