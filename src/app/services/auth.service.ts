import { Injectable } from '@angular/core';
import { Users } from '../models';
import { FirestoreService } from './firestore.service';
import { Router } from '@angular/router';

import { of, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Users;
  constructor(
    private db: FirestoreService,
    private router: Router
  ) { }

  login(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.getUser('users', id).subscribe(
        (res: Users) => {
          if (!res) {
            reject(false);
            return;
          } else {
            this.currentUser = {
              id: res.id,
              pos: res.pos,
            };
            sessionStorage.setItem('sesion', JSON.stringify(this.currentUser));
            resolve(true);
          }
        },
        err => { console.log(err); }
      );
    });
  }

  isLogedIn(): Observable<boolean> {
    const session = sessionStorage.getItem('sesion');
    if (session) {
      return of(true);
    } else {
      this.router.navigate([`login/`]);
      return of(false);
    }
  }
  isAdmin() {
    return this.currentUser?.pos === 'admin';
  }
  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('sesion');
    this.router.navigate([`login/`]);
  }
}
