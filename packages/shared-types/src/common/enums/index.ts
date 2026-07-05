export enum Prioridad {
  baja = 'baja',
  media = 'media',
  alta = 'alta',
}

export enum CategoriaTicket {
  bug = 'bug',
  feature = 'feature',
  soporte = 'soporte',
  incidente = 'incidente',
}

export enum SagaPaso {
  crearTicket = 'crearTicket',
  asignarTecnico = 'asignarTecnico',
  confirmarTicket = 'confirmarTicket',
}

export enum SagaResultado {
  completada = 'completada',
  compensada = 'compensada',
  fallida = 'fallida',
}
