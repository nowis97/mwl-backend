import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {ProductoPersonalizado, Productos} from '../models';
import {InventarioRepository, ProductosRepository} from '../repositories';
import {base64File,createorUpdateFile} from '../helpers/files';
import {Producto} from '../types';

export class ProductosController {
  constructor(
    @repository(ProductosRepository)
    public productosRepository : ProductosRepository,
    @repository(InventarioRepository)
    public inventarioRepository : InventarioRepository

  ) {}

  @post('/productos', {
    responses: {
      '200': {
        description: 'Productos model instance',
        content: {'application/json': {schema: getModelSchemaRef(Productos)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type:'object',
            required:["nombre","categoria","subCategoria","inventario"],
            properties:{
              "nombre":{type:"string"},
              "precio":{type:"number"},
              "stock":{type:"number"},
              "categoria":{type:"string"},
              "subCategoria":{type:"string"},
              "descripcion":{type:"string"},
              "imagenRuta":{type:"object"},
              "inventario":{type:"array"},
              "campos":{type:"array"},
              "subproductos":{type:"array"}
            }
          },
        },
      },
    })
    producto: Producto,
  ): Promise<Productos> {
    let ob = null;
    let ext = null;
    if (producto.imagenRuta) {
      // @ts-ignore
      ob = base64File(producto.imagenRuta.rawFile);
      // @ts-ignore
      ext = ob.type.split('/')[1];
    }
    const productoCreated = await this.productosRepository.create(
      new Productos(
        {
          nombre:producto.nombre,
          descripcion:producto.descripcion,
          precio:producto.precio,
          stock:producto.stock,
          categoria:producto.categoria,
          subCategoria:producto.subCategoria,
          inventarios:producto.inventario,
          subProductos:producto.subproductos,
          esSubproducto:producto.esSubproducto,
          receta:producto.receta
        }));
    if (producto.campos)
      await this.productosRepository
                .productoPersonalizado(productoCreated.getId())
                .create(
                  new ProductoPersonalizado({campos: producto.campos})
                )


    let nameFile= null;
    // @ts-ignore
    if (producto.imagenRuta)
      {
        // @ts-ignore
        nameFile  = createorUpdateFile(ob? ob.data:'',ext,productoCreated.getId().toString(),"uploads")!;
        productoCreated.imagenRuta = nameFile? nameFile:'';
        await this.productosRepository.updateById(productoCreated.getId(),{imagenRuta:nameFile});
      }


  /*
    for (const value of producto.inventario) {
      const materiaPrima = await this.inventarioRepository.findById(value.id);
      await this.inventarioRepository.updateById(value.id,{ cantidad: materiaPrima.cantidad - value.cantidad })
    }*/
    return productoCreated;
  }

  @get('/productos/count', {
    responses: {
      '200': {
        description: 'Productos model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Productos) where?: Where<Productos>,
  ): Promise<Count> {
    return this.productosRepository.count(where);
  }

  @get('/productos', {
    responses: {
      '200': {
        description: 'Array of Productos model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Productos, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Productos) filter?: Filter<Productos>,
  ): Promise<Productos[]> {
     filter= {...filter,include:[{relation:"productoPersonalizado"}]};

    return this.productosRepository.find(filter);
  }

  @patch('/productos', {
    responses: {
      '200': {
        description: 'Productos PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Productos, {partial: true}),
        },
      },
    })
    productos: Productos,
    @param.where(Productos) where?: Where<Productos>,
  ): Promise<Count> {
    return this.productosRepository.updateAll(productos, where);
  }

  @get('/productos/{id}', {
    responses: {
      '200': {
        description: 'Productos model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Productos, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Productos, {exclude: 'where'}) filter?: FilterExcludingWhere<Productos>
  ): Promise<Productos> {
    if (!filter) filter= {include:[{relation:"productoPersonalizado"}]}

    const producto = await this.productosRepository.findById(id, filter);
    return producto;
    //return {...producto,campos:producto.productoPersonalizado.campos};



  }

  @patch('/productos/{id}', {
    responses: {
      '204': {
        description: 'Productos PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Productos, {partial: true}),
        },
      },
    })
    productos: Productos,
  ): Promise<void> {
    await this.productosRepository.updateById(id, productos);
  }

  @put('/productos/{id}', {
    responses: {
      '204': {
        description: 'Productos PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() producto: Producto,
  ): Promise<void> {
    await this.productosRepository.productoPersonalizado(id).patch({campos: producto.productoPersonalizado?.campos})

    delete producto.productoPersonalizado;
    delete producto.campos;
    let fileName= undefined;
    if (producto.imagenRuta){
      let fileDecode = undefined;
      // @ts-ignore
      if (producto.imagenRuta.rawFile){
        // @ts-ignore
        fileDecode = base64File(producto.imagenRuta.rawFile);
        // @ts-ignore
        const ext = fileDecode.type.split('/')[1];

        // @ts-ignore
        fileName = createorUpdateFile(fileDecode.data,ext,id,'uploads');

        // @ts-ignore
        producto.imagenRuta = fileName;

      }




    }

    await this.productosRepository.replaceById(id,producto);
  }

  @del('/productos/{id}', {
    responses: {
      '204': {
        description: 'Productos DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productosRepository.deleteById(id);
    //await this.productosRepository.productoPersonalizado(id).delete();
  }
}
