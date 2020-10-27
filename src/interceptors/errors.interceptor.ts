import { 
  BadGatewayException,
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators'
import { ConnectionRefusedError } from "sequelize";
import { ForeignKeyConstraintError } from "sequelize";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(
        catchError(err => {
          console.log("==========================")
          console.log("err", err)
          console.log("==========================")
          let exception = null;
          if (err instanceof BadRequestException) {
            exception = new BadRequestException(err);
          }
          if (err instanceof BadGatewayException) {
            exception = new BadGatewayException(err);
          }
          if (err instanceof NotFoundException) {
            let error = {
              message:err['response']['error'],
              status: err['status']
            }
            exception = new NotFoundException(error);
          }
          if (err instanceof ForeignKeyConstraintError) {
            let error = {
              message: `No existe el ID del siguiente campo: ${err.fields}`,
              status: 400
            }
            exception = new BadRequestException(error)
          }
          if (err instanceof ConnectionRefusedError) {
            let error = {
              message: 'Error al conectarse a la Base de datos',
              status: 500
            }
            exception = new InternalServerErrorException(error);
          }

          return throwError(exception)
        })
      );
  }
}