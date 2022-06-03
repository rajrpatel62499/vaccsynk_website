import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[OnlyNumeric]'
})
export class OnlynumericDirective {

  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];

  constructor(private _el: ElementRef<HTMLInputElement>) { }
// ​
//   @HostListener('input', ['$event']) onInputChange(event:InputEvent) {

//     // const charCode = (event.which) ? event.which : event.keyCode;
//     // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
//     //   event.stopPropagation();
//     //   return false;
//     // }else {
//     //   return true;
//     // }
//     const initalValue = this._el.nativeElement.value;
//     this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
//     if ( initalValue !== this._el.nativeElement.value) {
//       this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
//       event.stopPropagation();
//     }

//   }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
  if (
    // Allow: Delete, Backspace, Tab, Escape, Enter, etc
    this.navigationKeys.indexOf(e.key) > -1 || 
    (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
    (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
    (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
    (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
    (e.key === 'a' && e.metaKey === true) || // Cmd+A (Mac)
    (e.key === 'c' && e.metaKey === true) || // Cmd+C (Mac)
    (e.key === 'v' && e.metaKey === true) || // Cmd+V (Mac)
    (e.key === 'x' && e.metaKey === true) // Cmd+X (Mac)
  ) {
    return;  // let it happen, don't do anything
  }
  // Ensure that it is a number and stop the keypress
  if (e.key === ' ' || isNaN(Number(e.key))) {
    e.preventDefault();
  }
}
}
