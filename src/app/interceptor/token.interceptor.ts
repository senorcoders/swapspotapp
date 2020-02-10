import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {

    public static url = environment.apiURL;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let event: HttpRequest<any>;
        let data = localStorage.getItem('login'); // this is set in login and register
        //console.log("DATA: ", data);

        //Para cuando se usa el translate
        if (req.url.includes("/assets/i18n") === true || req.url.includes("https://") === true || req.url.includes("http://") === true) {
            return next.handle(req.clone({
                url: req.url
            }));
        }

        if (data) {
            let json = data;
            let token = json['token'];
            //console.log("inter", json);


            event = req.clone({
                url: Interceptor.url + req.url,
                setHeaders: {
                    'token': data,
                    //'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                }
           
            });
        } else {
            event = req.clone({
                url: Interceptor.url + req.url
            });
        }

        return next.handle(event);
    }
}