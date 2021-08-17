import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {

  constructor(
    public menucontroler: MenuController,
    private auth: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.auth.isLogedIn();
  }

}
