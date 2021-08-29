import {Entity, model, property} from '@loopback/repository';

@model()
export class Clientes extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: false,
  })
  usuarioInstagram?: string;

  @property({
    type: 'string',
    required: true,
  })
  celular: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
    required: true,
  })
  tipoCliente: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<Clientes>) {
    super(data);
  }
}

export interface ClientesRelations {
  // describe navigational properties here
}

export type ClientesWithRelations = Clientes & ClientesRelations;
