import { AbstractControl } from '@angular/forms';

export type FormControls<T> = {
  [P in keyof T]: AbstractControl<any, any>;
};
