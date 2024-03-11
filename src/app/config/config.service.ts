import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

/**
 * Application wide configuration.
 */
export interface AppConfig {

  /** Cache update interval. */
  cahceRefreshIntervalInMinutes: number;
}

/** A simple service to load and provide configs. */
@Injectable()
export class ConfigService {

  #config: AppConfig;

  constructor(private httpClient: HttpClient) { }

  public init(): Promise<AppConfig> {
    return this.httpClient.get<AppConfig>('assets/config.json').pipe(tap(config => this.#config = config)).toPromise();
  }

  public get config() {
    return this.#config;
  }
}
