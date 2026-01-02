import { InjectionToken } from '@angular/core';

export interface AppConfig {
  offlineMode: boolean;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
