import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalPage {

  constructor(public modalController: ModalController) { }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
