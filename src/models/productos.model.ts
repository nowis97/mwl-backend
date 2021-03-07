import {Entity, model, property, hasOne, belongsTo} from '@loopback/repository';
import {ProductoPersonalizado} from './producto-personalizado.model';
import {Recetario} from './recetario.model';
import {Inventarios} from '../types';

@model()
export class Productos extends Entity {

  @property({
    type: 'string',
    required: false,
  })
  descripcion: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'number',
    required: false,
    default:0
  })
  stock?: number;

  @property({
    type: 'number',
    required: false,
  })
  precio?: number;

  @property({
    type: 'any',
  })
  imagenRuta?: string;

  @property({
    type: 'number',
  })
  costo?: number;

  @property({
    type: 'string',
    required: true,
  })
  categoria: string;

  @property({
    type: 'string',
    required: true,
  })
  subCategoria: string;

  @property({
    type: 'string',
    default: 'Creado'
  })
  estado?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: false
  })
  inventarios?: Inventarios[]

  @property({
    type: 'boolean',
    default: false
  })
  esSubproducto: boolean


  @property({
    type: 'array',
    itemType: 'object',
    required: false
  })
  subProductos?: object[]




  @property({
    type:'number'
  })
  porcentajeGanancia?:number

  @hasOne(() => ProductoPersonalizado)
  productoPersonalizado: ProductoPersonalizado;

  @belongsTo(() => Recetario, {name: 'recetario'})
  receta: string;

  constructor(data?: Partial<Productos>) {
    super(data);
  }
}

export interface ProductosRelations {
  // describe navigational properties here
}

export type ProductosWithRelations = Productos & ProductosRelations;
