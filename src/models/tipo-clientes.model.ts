import {Entity, model, property} from '@loopback/repository';

@model()
export class TipoClientes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    id: true,

  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;


  constructor(data?: Partial<TipoClientes>) {
    super(data);
  }
}

export interface TipoClientesRelations {
  // describe navigational properties here
}

export type TipoClientesWithRelations = TipoClientes & TipoClientesRelations;
