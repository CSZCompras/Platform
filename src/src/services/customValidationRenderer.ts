import { ValidationRenderer, RenderInstruction, ValidateResult } from 'aurelia-validation';
import 'jquery';

export class CustomValidationRenderer {
     
  $: any;

  render(instruction: RenderInstruction) { 
        for (let { result, elements } of instruction.unrender) {
          for (let element of elements) {
            this.remove(element, result);
          }
        }

        for (let { result, elements } of instruction.render) {
          for (let element of elements) {
            this.add(element, result);
          }
        }
      }

   add(element: Element, result: ValidateResult) {
        if (result.valid) {
          return;
        }
        
        $(element).addClass('border-danger');
    }

      remove(element: Element, result: ValidateResult) {
        if (result.valid) {
          return;
        }

          $(element).removeClass('border-danger');
      }
}