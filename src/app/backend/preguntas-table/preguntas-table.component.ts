import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Pregunta } from '../../models';
import { MenuController, ModalController } from '@ionic/angular';

import { IonReorderGroup } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ModalPage } from '../modal/modal.component';
@Component({
  selector: 'app-preguntas-table',
  templateUrl: './preguntas-table.component.html',
  styleUrls: ['./preguntas-table.component.scss'],
})
export class PreguntasTableComponent implements OnInit {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  title: 'Campaña Uno';
  preguntas: Pregunta[];
  loading: any;
  modal: any;

  constructor(
    public menucontroler: MenuController,
    public loadingController: LoadingController,
    public db: FirestoreService,
    private router: Router,
    public toast: ToastController,
    public alertController: AlertController,
    private auth: AuthService,
    public modalController: ModalController
  ) { }

  async presentModal(question: Pregunta) {
    this.modal = await this.modalController.create({
      component: ModalPage,
      cssClass: ['../modal/modal.component.scss'],
      swipeToClose: true,
      componentProps: {
        firstName: 'Douglas',
        lastName: 'Adams',
        middleInitial: 'N'
      }
    });
    return await this.modal.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'loading',
      message: 'Please wait...',
      duration: 1500
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
  }

  async presentToast(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      color: 'medium',
      duration: 2000
    });
    toast.present();
  }

  openMenu() {
    this.menucontroler.open('principal');
  }
  ngOnInit() {
    this.auth.isLogedIn();
    this.presentLoading();
    this.getCollection();
  }

  getCollection() {
    this.db.getCollection<Pregunta>('preguntas/').subscribe(res => {
      this.preguntas = res;
    });
  }

  doReorder(ev: Event) {
    //CustomEvent<ItemReorderEventDetail>
    const value = (ev as CustomEvent).detail;
    this.presentLoading();
    value.complete(this.preguntas);

    // eslint-disable-next-line guard-for-in
    for (const i in this.preguntas) {
      this.preguntas[i].order = Number(i);
      this.db.updateDoc(this.preguntas[i], 'preguntas/', this.preguntas[i].id);
    }
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

  editPregunta(id: string) {
    this.router.navigate([`admin/${id}`]);
  }

  addNewPregunta() {
    this.router.navigate([`admin/new`]);
  }

  async deletePregunta(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: 'Alerta!',
      message: 'El borrado es permanente!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Borrar!',
          cssClass: 'danger',
          handler: () => {
            // eslint-disable-next-line max-len
            this.db.deleteDoc('preguntas/', id).then(res => { this.presentToast('Borrado con Exito!'); }).catch(error => { this.presentToast(`Hubo un error ${error}`); });
          }
        }
      ]
    });
    await alert.present();
  }

  goHome() {
    this.router.navigate([`home/`]);
  }

}
