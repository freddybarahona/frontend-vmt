import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',//este es el nombre de la carpeta
  imports: [],
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() isOpen = false; //controla si se muestra
  @Input() title = ''; //variable de titulo si la llama en multiples componentes
  @Output() close = new EventEmitter<void>();
  onClose() {//notifica al componente padre de que se cerro
    this.close.emit();
  }
}
