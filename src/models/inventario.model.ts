import {Entity, model, property, hasMany} from '@loopback/repository';
import {Recetario} from './recetario.model';

@model()
export class Inventario extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  nombreMaterial: string;

  @property({
    type: 'string',
  })
  marca?: string;

  @property({
    type: 'number',
    required: true,
  })
  precio: number;

  @property({
    type: 'number',
    required: true,
  })
  cantidad: number;

  @property({
    type: 'number',
    default:0
  })
  cantidadUtilizada: number;

  @property({
    type: 'string',
    required: true,
  })
  unidadMedida: string;

  @property({
    type: 'number',
    required: false,
  })
  costoUnitario?: number;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  productosId?: string;

  @property({
    type: 'string',
  })
  categoria?: string;


  constructor(data?: Partial<Inventario>) {
    super(data);
  }
}

export interface InventarioRelations {
  // describe navigational properties here
}

export type InventarioWithRelations = Inventario & InventarioRelations;
