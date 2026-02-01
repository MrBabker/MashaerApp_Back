import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CURRENT_USER_KEY, JWT_Payload } from 'src/utils';

export const CurrntDecorator = createParamDecorator(
  (data, context: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const payload: JWT_Payload = request[CURRENT_USER_KEY];
    return payload;
  },
);
