import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',//este es el nombre de la carpeta
  imports: [],
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() isOpen = false //un componente padre le envie datos a este componente hijo
  @Input() title = ''
  @Output() close = new EventEmitter<void>()//@output para que el hijo envie eventos al padre
  /* el event emitter es un generico que permite lanzar eventos personalizados */
  onClose() {//notifica al componente padre de que se cerro
    this.close.emit();
  }
}
