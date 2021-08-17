import { EmailValidator } from "@angular/forms";

export interface Pregunta {
  pregunta: string;
  respuestas: string[];
  fecha: Date;
  foto: string[];
  order: number;
  id: string;
  intro?: string;
  tipoPregunta?: string;
  videoURL?: string;
}
export interface SingleRespuesta {
  encuestado: string;
  latitude: number;
  longitude: number;
  preguntaId: string;
  respuesta: string;
}

export interface NodoRespuesta {
  nodo: string;
  preguntaId: string;
}
export interface Users {
  id: string;
  pos: string;
  role?: number;
}

export interface Personales {
  nombre: string;
  paterno: string;
  materno: string;
  mail: EmailValidator;
}

export interface Encuestado {
  encuestado: string;
  geo: number[];
  rangoEdad: string;
  seccionElectoral: string;
  sexo: string;
  video: string;
  voto: string;
}
