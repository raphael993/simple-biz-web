import { InjectionToken } from '@angular/core';

export interface AppConfig {
  offlineMode: boolean;
  api: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
