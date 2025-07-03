import {Component, OnInit} from '@angular/core';
import {Marca} from '../models/marca';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {MarcaService} from '../services/marca.service';
import {ToastModule} from 'primeng/toast';
import {Button, ButtonDirective} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {ButtonGroupModule} from 'primeng/buttongroup';
import {DialogModule} from 'primeng/dialog';
import {NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-main-marca',
  standalone: true,
  imports: [
    ToastModule,
    Button,
    TableModule,
    ButtonGroupModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonDirective,
    NgIf,
    InputTextModule
  ],
  templateUrl: './main-marca.component.html',
  styleUrl: './main-marca.component.css',
  providers: [MessageService]
})
export class MainMarcaComponent implements OnInit {
  marcaForm: FormGroup;
  marcas: Marca[] = [];
  visibleDialogForm: boolean = false;
  isEditing: boolean = false;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private marcaService: MarcaService
  ) {
    this.marcaForm = this.formBuilder.group({
      id: [null],
      marca: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMarcas();
  }

  loadMarcas(): void {
    this.marcaService.getMarcas().subscribe({
      next: (marcas: Marca[]) => {
        this.marcas = marcas;
      },
      error: (err) => console.error(err)
    });
  }

  showDialog(marca?: Marca): void {
    if (marca) {
      this.marcaForm.setValue({
        id: marca.id,
        marca: marca.marca
      });
      this.isEditing = true;
    } else {
      this.resetForm();
      this.isEditing = false;
    }
    this.visibleDialogForm = true;
  }

  resetForm(): void {
    this.marcaForm.reset();
    this.marcaForm.markAsPristine();
    this.marcaForm.markAsUntouched();
  }

  saveMarca(): void {
    if (this.marcaForm.invalid) return;

    const marca: Marca = this.marcaForm.value;

    if (this.isEditing) {
      this.updateMarca(marca);
    } else {
      this.createMarca(marca);
    }
  }

  createMarca(marca: Marca): void {
    this.marcaService.createMarca(marca).subscribe({
      next: (newMarca: Marca) => {
        this.marcas.push(newMarca);
        this.visibleDialogForm = false;
        this.resetForm();
        this.messageService.add({ severity: 'success', summary: 'Marca Creada', detail: 'Marca registrada exitosamente.' });
      },
      error: (err) => console.error(err)
    });
  }

  updateMarca(marca: Marca): void {
    this.marcaService.updateMarca(marca.id, marca).subscribe({
      next: (updatedMarca: Marca) => {
        const index = this.marcas.findIndex(m => m.id === updatedMarca.id);
        if (index !== -1) this.marcas[index] = updatedMarca;
        this.visibleDialogForm = false;
        this.resetForm();
        this.messageService.add({ severity: 'success', summary: 'Marca Actualizada', detail: 'Marca modificada exitosamente.' });
      },
      error: (err) => console.error(err)
    });
  }

  deleteMarca(id: number): void {
    this.marcaService.deleteMarca(id).subscribe({
      next: () => {
        this.marcas = this.marcas.filter(m => m.id !== id);
        this.messageService.add({ severity: 'warn', summary: 'Marca Eliminada', detail: 'Marca eliminada correctamente.' });
      },
      error: (err) => console.error(err)
    });
  }
}
