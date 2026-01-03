import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { UtilsService } from '../services/utils.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const utilsService = inject(UtilsService);

  utilsService.setLoaderState(true);

  return next(req).pipe(
    finalize(() => {
      utilsService.setLoaderState(false);
    })
  );
};
