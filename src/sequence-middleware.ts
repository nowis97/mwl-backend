import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export class MySequence extends MiddlewareSequence {


  async handle(context: RequestContext): Promise<void> {
    await super.handle(context);
  }
}