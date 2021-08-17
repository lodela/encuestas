import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // finalUrl: string;
  constructor(public fireStorage: AngularFireStorage) { }

  fileUpload(file: any, preguntaId: string, nombre: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `encuesta/preguntas/${preguntaId}_${nombre}`;
      const ref = this.fireStorage.ref(filePath);
      const task = ref.put(file);
      let finalUrl: any;
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(res => {
            finalUrl = res;
            resolve(finalUrl);
            return;
          });
        })
      ).subscribe();
    });
  }


}
