import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

export enum ErrorMessage500 {
  SOMETHING_WRONG = 'something wrong',
}

export function CommonResponse(
  tag: string,
  { name, successType, error400 = [], error500 = [] },
): any {
  const messageError500 = [ErrorMessage500.SOMETHING_WRONG];
  if (error500.length) {
    messageError500.push(...error500);
  }

  const errorFactory = new ErrorMessageFactory(name);
  const Error400 = errorFactory.build(400, error400);
  const Error500 = errorFactory.build(500, messageError500);
  return applyDecorators(
    ApiTags(tag),
    ApiResponse({
      status: 200,
      description: 'Success',
      type: successType,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      type: Error400,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Error',
      type: Error500,
    }),
  );
}

export default CommonResponse;

class ErrorMessageFactory {
  constructor(private readonly name: string) {}

  build(statusCode: number, msgError = []) {
    const className = `${this.name}Error${statusCode}`;
    class X {
      @ApiProperty({
        type: String,
        required: true,
        example: msgError.at(0),
        enum: msgError,
      })
      readonly message: string;
    }

    Object.defineProperty(X, 'name', { value: className });

    return X;
  }
}
