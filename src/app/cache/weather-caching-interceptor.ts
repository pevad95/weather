import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { CacheService } from "./cache.service";
import { CurrentConditions } from "app/current-conditions/current-conditions.type";
import { Forecast } from "app/forecasts-list/forecast.type";
import { ConfigService } from "app/config/config.service";

/**
 * A custom Http interceptor for caching the current weather and the foreacasts based on zip codes as keys. @see{CacheService}
 *  The interceptors checks the url and parses the zip code if presented. If the data is presented in the cache and the last update is within the provided time interval
 * then the cached data is returned and no request is done. If the cache does not contain the zip code or the last is stale then the request is continued to the server.
 * The updata interval can be set through @see{ConfigService}
 */
@Injectable()
export class WeatherCachingInterceptor implements HttpInterceptor {
    constructor(private cacheService: CacheService, private configService: ConfigService) {}

    public intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('zip=')) {
            const zipCode = req.url.match(/zip=([0-9]*)/)[1];
            
            if (zipCode && req.url.includes('weather?')) {
                const cached = this.cacheService.find<CurrentConditions>(`${zipCode}-current`);
                cached && console.info(`Cache hit, zip: ${zipCode}, type: Current weather, lastUpdated: ${(Date.now() - cached.lastUpdated) / 1000 / 60} mins ago`);
                return !cached || this.shouldUpdate(cached.lastUpdated) ? this.sendRequest<CurrentConditions>(req, handler, zipCode, 'current') : this.generateResponse(cached.data);
            } else if (zipCode && req.url.includes('forecast/daily')) {
                const cached = this.cacheService.find<Forecast>(`${zipCode}-forecast`);
                cached && console.info(`Cache hit, zip: ${zipCode}, type: Forecast, lastUpdated: ${(Date.now() - cached.lastUpdated) / 1000 / 60} mins ago`);
                return !cached || this.shouldUpdate(cached.lastUpdated) ? this.sendRequest<Forecast>(req, handler, zipCode, 'forecast') : this.generateResponse(cached.data);
            }
        }

        return handler.handle(req);
    }

    private generateResponse(body: CurrentConditions | Forecast) {
        return of(new HttpResponse({
            body
        }));
    }

    private shouldUpdate(date: number) {
        return (Date.now() - date) / 1000 >= this.configService.config.cahceRefreshIntervalInMinutes * 60;
    }

    private sendRequest<T extends CurrentConditions | Forecast>(req: HttpRequest<any>, handler: HttpHandler, zipCode: string, type: 'current' | 'forecast'): Observable<HttpEvent<any>> {
        return handler.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cacheService.save<T>(`${zipCode}-${type}`, event.body);
                }
            })
        );
    }
}