import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getCurrentUserId = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    return user?._id;
  },
);
