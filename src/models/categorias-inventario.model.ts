import {Entity, model, property} from '@loopback/repository';

@model()
export class CategoriasInventario extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;

  constructor(data?: Partial<CategoriasInventario>) {
    super(data);
  }

}

export interface CategoriasInventarioRelations {
  // describe navigational properties here
}

export type CategoriasInventarioWithRelations = CategoriasInventario & CategoriasInventarioRelations;
