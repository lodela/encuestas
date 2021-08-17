import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { Pregunta, Personales, Encuestado, Users, SingleRespuesta, NodoRespuesta } from '../../../models';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare const HKVideoPlayer;
@Component({
  selector: 'app-pregunta',
  styleUrls: ['./pregunta.component.scss'],
  templateUrl: './pregunta.component.html'
})
export class PreguntaComponent implements OnInit, AfterViewInit {
  @ViewChild('preguntas') pregunta;
  @Output() questionIndex = new EventEmitter<number>();
  @Output() qlength = new EventEmitter<number>();
  @Output() mensaje = new EventEmitter<string>();

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    paterno: new FormControl('', Validators.required),
    materno: new FormControl('', Validators.required),
    mail: new FormControl('', [Validators.required, Validators.email])
  });

  loading: any;
  ready = false;
  questions: Pregunta[] = [
    {
      foto: null,
      fecha: null,
      id: '',
      order: 0,
      pregunta: '',
      respuestas: ['']
    }
  ];

  questionsAnswered: boolean[] = [];

  textoLibre = 'NO';

  textoBtn = {
    msg: '',
    init: 'Siguente Pregunta',
    end: 'Finalizar Encuesta'
  };
  encuestadoId: string;
  questionsLength: number;
  selected = 0;

  isButtonDisabled: boolean;
  tipoPregunta = 'opcionMultiple';

  personales: Personales = {
    nombre: '',
    paterno: '',
    materno: '',
    mail: null
  };

  videoPoster = 'assets/imgs/play_poster.png';

  private encuestado: Encuestado = {
    encuestado: '',
    geo: [],
    rangoEdad: '',
    seccionElectoral: '',
    sexo: '',
    video: '',
    voto: ''
  };

  private preguntas: NodoRespuesta[];

  constructor(
    public router: Router,
    private db: FirestoreService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.encuestadoId = this.db.getId();
    this.presentLoading('', 'Cargando...', 10000);
    this.db.getCollection<Pregunta>('preguntas').subscribe(
      res => {
        const qlength = res.length;
        this.questions = res;
        this.questionsLength = this.questions.length - 1;
        this.textoBtn.msg = this.textoBtn.init;
        this.qlength.emit(qlength);
        this.ready = true;
        // eslint-disable-next-line guard-for-in
        for (const i in res) {
          this.questionsAnswered.push(false);
        }
        this.loading.dismiss();
      }
    );
  }
  ngAfterViewInit() {
    this.isButtonDisabled = (this.tipoPregunta && this.tipoPregunta === 'opcionMultiple') ? true : false;
  }

  async presentLoading(css?: string, message?: string, duration?: number) {
    this.loading = await this.loadingController.create({
      cssClass: css ? css : 'success',
      message: message ? message : 'Please wait...',
      duration: duration ? duration : 1500
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
  }
  next(back?: string) {
    this.isButtonDisabled = true;
    if (back) {
      this.selected--;
      this.tipoPregunta = this.questions[this.selected].tipoPregunta;
      this.questionIndex.emit(this.selected);
      this.textoBtn.msg = this.textoBtn.init;
      this.mensaje.emit(this.questions[this.selected].intro);
    } else {
      if ('formulario' === this.tipoPregunta) {
        this.profileFormm();
        return;
      } else if ('texto' === this.tipoPregunta) {
        this.isButtonDisabled = false;
        if (!this.textoLibre) {
          return;
        } else {
          this.saveTextoLibre();
        }
      } else {
        this.setNext();
      }
    }
  }

  profileFormm() {
    if (this.profileForm.valid) {
      this.db.setProfile(this.profileForm.value, this.encuestadoId).subscribe(
        res => {
          this.profileForm.reset('');
          this.selected += 1;
          this.questionIndex.emit(this.selected);
          this.mensaje.emit(this.questions[this.selected].intro);
          this.tipoPregunta = this.questions[this.selected].tipoPregunta;
          this.isButtonDisabled = false;
        });
    } else {
      console.error('NOT VALID');
      return;
    }
  }

  radioSelect(e: any) {
    this.isButtonDisabled = false;
    const value = (null === e.srcElement.value) ? null : (0 === e.srcElement.value) ? '0' : e.srcElement.value.toString();
    const respuesta = {
      encuestado: this.encuestadoId,
      preguntaId: this.questions[this.selected].id,
      respuesta: value,
      latitude: 17.0732567, // DELETE
      longitude: -96.727435 // DELETE
    };
    value ? this.db.setRespuestas(respuesta, `respuestas/${this.questions[this.selected].id}/encuestados`, this.encuestadoId).subscribe() : null;
  }

  setNext() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !this.pregunta ? null : this.pregunta.value = null;
    if (this.selected < this.questionsLength) {
      this.selected += 1;
      if (this.selected === this.questionsLength) {
        this.textoBtn.msg = this.textoBtn.end;
      }
      this.questionIndex.emit(this.selected);
      this.mensaje.emit(this.questions[this.selected].intro);
      this.tipoPregunta = this.questions[this.selected].tipoPregunta;
      this.isButtonDisabled = ('texto' === this.tipoPregunta) ? false : true;
      return;
    } else {
      alert('que show: ¿ya guardando lo ultimo?');
      let i;
      this.encuestado.encuestado = this.encuestadoId;

      this.db.getsingleRespuesta<SingleRespuesta>(this.questions[0].id, this.encuestadoId).subscribe((res: SingleRespuesta) => {
        this.encuestado.geo.push(res.latitude);
        this.encuestado.geo.push(res.longitude);
        responses().then(() => {
          userCounter().then(() => {
            this.loading.present('Hola', 'Mundo', 3000).then(
              () => {
                this.db.setRegistroDeEncuesta(this.encuestado, this.encuestadoId).subscribe(
                  () => {
                    this.clearAll();
                    this.presentLoading('', 'Cargando...', 3000).then(
                      () => { this.router.navigate([`home/`]); }
                    );
                  }
                );
              }
            );
          });
        });
      });

      const responses = async () => {
        const mapRespuestas = () => {
          this.preguntas = [];
          // eslint-disable-next-line guard-for-in
          for (i in this.questions) {
            const qId = this.questions[i].id;
            // eslint-disable-next-line max-len
            const qNodo = this.questions[i].pregunta.includes('video') ? 'video' : this.questions[i].pregunta.includes('sección electoral') ? 'seccionElectoral' : this.questions[i].pregunta.includes('piensa votar') ? 'voto' : this.questions[i].pregunta.includes('sexo') ? 'sexo' : this.questions[i].pregunta.includes('edad') ? 'rangoEdad' : null;
            this.questions[i].pregunta.includes('video') ? this.preguntas.push({ preguntaId: this.questions[i].id, nodo: qNodo }) :
              this.questions[i].pregunta.includes('sección electoral') ? this.preguntas.push({ preguntaId: this.questions[i].id, nodo: qNodo }) :
                this.questions[i].pregunta.includes('votar') ? this.preguntas.push({ preguntaId: this.questions[i].id, nodo: qNodo }) :
                  this.questions[i].pregunta.includes('sexo') ? this.preguntas.push({ preguntaId: this.questions[i].id, nodo: qNodo }) :
                    this.questions[i].pregunta.includes('edad') ? this.preguntas.push({ preguntaId: this.questions[i].id, nodo: qNodo }) : null;
          }
        };
        await mapRespuestas();
      };
      const userCounter = async () => {
        const asyncFn = () => {
          // eslint-disable-next-line guard-for-in
          for (const e in this.preguntas) {
            this.db.getsingleRespuesta<SingleRespuesta>(this.preguntas[e].preguntaId, this.encuestadoId).subscribe(re => {
              this.encuestado[this.preguntas[e].nodo] = re.respuesta;
            });
          }
          return 'OK';
        };
        await asyncFn();
      };
      return;
    }
  }



  saveTextoLibre() {
    const preguntaId = this.questions[this.selected].id;
    const encuestado = this.encuestadoId;
    const data = {
      encuestado,
      preguntaId,
      respuesta: this.textoLibre.trim()
    };
    this.db.setRespuestas(data, `respuestas/${preguntaId}/encuestados`, encuestado).subscribe(() => {
      this.setNext();
    });
  }

  clearAll() {
    return new Promise((resolve, reject) => {
      this.selected = 0;
      this.tipoPregunta = 'opcionMultiple';
      this.textoBtn.msg = this.textoBtn.init;
      this.profileForm.reset('');
      this.isButtonDisabled = true;
      resolve(true);
    });
  }

  getSingleRespuestas(qId: string) {
    // this.db.getDoc<Pregunta>('preguntas/', qId).subscribe(res => {
    //   console.log(res);
    //   console.log('-------------------------------------------- hay un debugger en la consola --------------------------------------------');
    //   debugger;
    //   if (res.pregunta.includes('video')) {
    //     this.dataEncuestado.video = res.respuestas[respuesta];
    //   }
    //   else if (res.pregunta.includes('sección electoral')) {
    //     this.dataEncuestado.seccionElectoral = res.respuestas[0];
    //   }
    //   else if (res.pregunta.includes('piensa votar')) {
    //     this.dataEncuestado.voto = res.respuestas[respuesta];
    //   }
    //   else if (res.pregunta.includes('sexo')) {
    //     this.dataEncuestado.sexo = res.respuestas[respuesta];
    //   }
    //   else if (res.pregunta.includes('edad')) {
    //     this.dataEncuestado.rangoEdad = res.respuestas[respuesta];
    //   } else { }
    //   console.log(this.dataEncuestado);
    // });

  }

  playVideo() {
    HKVideoPlayer.play('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  }
}
