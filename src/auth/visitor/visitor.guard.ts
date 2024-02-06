import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthVisitorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = this.extractToken(context);
    return true;
  }

  private extractToken(context: ExecutionContext) {
    const authentication = context.switchToHttp().getRequest()
      .cookies?.Authentication;

    console.log(authentication, '>>>>');
    return authentication;
  }
}
