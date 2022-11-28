import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { SpinnerOverlayService } from './spinner-overlay.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private token: TokenService, private readonly spinnerOverlayService: SpinnerOverlayService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    //console.log("Interceptor");
    this.spinnerOverlayService.show();
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token.get()}`
      }
    });
    return next.handle(newReq).pipe(finalize(() => this.spinnerOverlayService.hide()));
  }
}
