import {Entity, model, property} from '@loopback/repository';

@model()
export class Producciones extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  productoId: string;

  @property({
    type: 'number',
    required: true,
  })
  cantidadProducir: number;

  @property({
    type: 'date',
  })
  fechaProduccion?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  historial?: object[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  materiasPrimasNecesarias?: object[];

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<Producciones>) {
    super(data);
  }
}

export interface ProduccionesRelations {
  // describe navigational properties here
}

export type ProduccionesWithRelations = Producciones & ProduccionesRelations;
