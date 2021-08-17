import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Pregunta, Users, Encuestado } from '../models';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public db: AngularFirestore) { }

  createPregunta(data: any, path: string, id: string): any {
    const collection = this.db.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<Tipe>(path: string, id: string) {
    const collection = this.db.collection<Tipe>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: Pregunta, path: string, id: string): any {
    const collection = this.db.collection(path);
    return collection.doc(id).update(data);
  }

  getId() {
    return this.db.createId();
  }

  getCollection<Tipe>(path: string) {
    const collection = this.db.collection<Tipe>(path, ref => ref.orderBy('order', 'asc'));
    return collection.valueChanges();
  }

  getUser(path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).valueChanges();
  }

  setRespuestas(data: any, path: string, id: string): Observable<any> {
    const collection = this.db.collection(path);
    return of(collection.doc(id).set(data));
  }
  updateRespuestas(data: any, id: string) {
    const collection = this.db.collection('respuestas/');
    return collection.doc(id).update(data);
  }
  deleteRespuesta(id: string) {
    const collection = this.db.collection('respuestas/');
    return collection.doc(id).delete();
  }
  getRespuestas(id: string) {
    const collection = this.db.collection('respuestas/');
    return collection.valueChanges();
  }

  getsingleRespuesta<Tipe>(preguntaId: string, encuestadoId: string): Observable<Tipe> {
    const collection = this.db.collection<Tipe>(`respuestas/${preguntaId}/encuestados`);
    return collection.doc(encuestadoId).valueChanges();
  }

  setProfile(data: any, id: string): Observable<any> {
    const collection = this.db.collection('encuestados');
    return of(collection.doc(id).set(data));
  }

  setRegistroDeEncuesta(data: Encuestado, encuestadoId: string): Observable<any> {
    const user = JSON.parse(sessionStorage.getItem('sesion')).id;
    const path = `users/${user}/encuestas/`;
    const collection = this.db.collection(path);
    return of(collection.doc(encuestadoId).set(data));
  }

  readRegistroDeEncuesta(id: string) {
    const collection = this.db.collection(`users/${id}/encuestas/`);
    return collection.get().subscribe(res => {
      console.log(res);
    })
  }

}
//
