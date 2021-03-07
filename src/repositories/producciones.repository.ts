import {DefaultCrudRepository, repository} from '@loopback/repository';
import {Producciones, ProduccionesRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {groupBy} from '../helpers/functions';
import {SubproductoProduccion} from '../types';
import {ProductosRepository} from './productos.repository';

export class ProduccionesRepository extends DefaultCrudRepository<
  Producciones,
  typeof Producciones.prototype.id,
  ProduccionesRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
    @repository(ProductosRepository) public productosRepository:ProductosRepository
  ) {
    super(Producciones, dataSource);
  }


   async getSubproductosaProducir(produccion: Producciones): Promise<SubproductoProduccion[]> {
     const productosPedidos = produccion.pedidos.map(obj => obj.productosPedidos);
     const allProductosPedidos = productosPedidos.flat();

     let allSubProductosPedidos: unknown[] = []

     for (const productoPedido of allProductosPedidos) {
       // @ts-ignore
       const producto = await this.productosRepository.findById(productoPedido?.idProducto);

       if (producto.subProductos) {
         // @ts-ignore
         if (productoPedido.cantidad) {
           // @ts-ignore
           producto.subProductos = producto.subProductos.map(value => {

             return {
               // @ts-ignore
               idProducto: value.id,
               // @ts-ignore
               cantidad: (value.cantidad * productoPedido.cantidad)
             }
           })
         }
         // @ts-ignore
         allSubProductosPedidos = allSubProductosPedidos.concat(producto.subProductos.map(value => ({
           // @ts-ignore
           idProducto: value.id || value.idProducto,
           // @ts-ignore
           cantidad: value.cantidad
         })));

       }
       // @ts-ignore
       if (productoPedido?.cantidad)
        { // @ts-ignore
          productoPedido.cantidad = 0
        }


       allSubProductosPedidos.push(productoPedido);


     }


     // @ts-ignore
     const productosPedidosporId = groupBy(allSubProductosPedidos, 'idProducto');


     const productosPedidosResponse: SubproductoProduccion[] = [];
     const keysProductosPedidosPorId = Object.keys(productosPedidosporId)
     const idProductoPersonalizado = (await this.productosRepository.findOne({where: {nombre: "Personalizado"}}))?.id;


     for (const keyProductoPedidoPorId of keysProductosPedidosPorId) {
       const objSubproductoPedido: SubproductoProduccion = {
         idProducto: '',
         cantidadTotal: 0,
         subproductosProducir: [],
         fechaEntrega: '',
         enProduccion: false,
         cantidadEnProduccion:0,
         cantidadFaltante:0
       }
       // @ts-ignore
       const arrayProductoPedidoPorId = productosPedidosporId[keyProductoPedidoPorId];

       let sumCantidad = 0;


       arrayProductoPedidoPorId.forEach((val: object, index: number) => {
         // @ts-ignore
         if (val.cantidad) {
           // @ts-ignore
           sumCantidad += val.cantidad;
           // @ts-ignore
         } else if (idProductoPersonalizado === val.idProducto) {
           sumCantidad += 1
         } else {
           arrayProductoPedidoPorId.splice(index, 1)
         }

       })

       objSubproductoPedido.subproductosProducir = objSubproductoPedido.subproductosProducir.concat(arrayProductoPedidoPorId)
       objSubproductoPedido.cantidadTotal = sumCantidad;
       objSubproductoPedido.idProducto = keyProductoPedidoPorId;
       objSubproductoPedido.fechaEntrega = produccion.fechaEntrega ?? '';
       objSubproductoPedido.cantidadFaltante = sumCantidad


       productosPedidosResponse.push(objSubproductoPedido);


     }
     return productosPedidosResponse.filter(obj => obj.cantidadTotal !==0)
   }
}
