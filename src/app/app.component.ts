import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  sesion: boolean;
  userName: string;
  pages = [
    { title: 'Admin Home', page: '', icon: '' },
    { title: '', page: '', icon: '' }
  ];
  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.isLogedIn();
  }

  ionViewWillEnter() {
    if (this.auth.isAdmin()) {

    } else {

    }
  }

}
