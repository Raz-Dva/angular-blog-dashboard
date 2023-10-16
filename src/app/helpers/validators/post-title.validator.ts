import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
//replace multiple spaces per one
// TODO replace with directive
export function TrimSpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const trimmedValue = control.value
        .replace(/\s{2,}/g, ' ')
        .replace(/^\s+/, '');
      if (control.value !== trimmedValue) {
        control.setValue(trimmedValue);
      }
    }
    return null;
  };
}
