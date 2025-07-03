import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Producto} from '../models/producto';
import {ProductoService} from '../services/producto.service';
import {MarcaService} from '../services/marca.service';
import {GeneroService} from '../services/genero.service';
import {ColorService} from '../services/color.service';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {Button, ButtonDirective} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, NgIf} from '@angular/common';
import {ButtonGroupModule} from 'primeng/buttongroup';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-main-producto',
  standalone: true,
  imports: [
    ToastModule,
    Button,
    InputTextModule,
    TableModule,
    CurrencyPipe,
    ButtonGroupModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonDirective,
    NgIf
  ],
  templateUrl: './main-producto.component.html',
  styleUrl: './main-producto.component.css',
  providers: [MessageService]
})
export class MainProductoComponent implements OnInit {
  productoForm: FormGroup;
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  marcas: any[] = [];
  generos: any[] = [];
  colores: any[] = [];
  visibleDialogForm: boolean = false;
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private generoService: GeneroService,
    private colorService: ColorService,
    private messageService: MessageService
  ) {
    this.productoForm = this.formBuilder.group({
      id: [null],
      producto: ['', Validators.required],
      marca: [null, Validators.required],
      genero: [null],
      color: [null],
      stock: [0, Validators.required],
      precioventa: [0, Validators.required],
      costocompra: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('MainProductoComponent: Initializing component...');
    this.loadProductos();
    this.loadMarcas();
    this.loadGeneros();
    this.loadColores();
  }

  loadProductos(): void {
    console.log('MainProductoComponent: Loading productos...');
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        console.log('MainProductoComponent: Productos loaded:', productos);
        this.productos = productos;
        this.filteredProductos = productos;
      },
      error: (err) => console.error('Error loading productos:', err),
    });
  }

  loadMarcas(): void {
    console.log('MainProductoComponent: Loading marcas...');
    this.marcaService.getMarcas().subscribe({
      next: (marcas) => {
        console.log('MainProductoComponent: Marcas loaded:', marcas);
        this.marcas = marcas;
      },
      error: (err) => console.error('Error loading marcas:', err),
    });
  }

  loadGeneros(): void {
    console.log('MainProductoComponent: Loading generos...');
    this.generoService.getGenero().subscribe({
      next: (generos) => {
        console.log('MainProductoComponent: Generos loaded:', generos);
        this.generos = generos;
      },
      error: (err) => console.error('Error loading generos:', err),
    });
  }

  loadColores(): void {
    console.log('MainProductoComponent: Loading colores...');
    this.colorService.getColor().subscribe({
      next: (colores) => {
        console.log('MainProductoComponent: Colores loaded:', colores);
        this.colores = colores;
      },
      error: (err) => console.error('Error loading colores:', err),
    });
  }

  buscarProductos(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    console.log('MainProductoComponent: Filtering productos with query:', input);
    this.filteredProductos = this.productos.filter((producto) =>
      producto.producto.toLowerCase().includes(input)
    );
  }

  showDialog(producto?: Producto): void {
    if (producto) {
      console.log('MainProductoComponent: Editing producto:', producto);
      this.productoForm.setValue({
        id: producto.id,
        producto: producto.producto,
        marca: producto.marca,
        genero: producto.genero,
        color: producto.color,
        stock: producto.stock,
        precioventa: producto.precioventa,
        costocompra: producto.costocompra,
      });
      this.isEditing = true;
    } else {
      console.log('MainProductoComponent: Creating new producto...');
      this.resetForm();
      this.isEditing = false;
    }
    this.visibleDialogForm = true;
  }

  resetForm(): void {
    console.log('MainProductoComponent: Resetting form...');
    this.productoForm.reset();
    this.productoForm.markAsPristine();
    this.productoForm.markAsUntouched();
  }

  saveProducto(): void {
    if (this.productoForm.invalid) return;
    const producto: Producto = this.productoForm.value;
    console.log('MainProductoComponent: Saving producto:', producto);

    if (this.isEditing) {
      this.updateProducto(producto);
    } else {
      this.createProducto(producto);
    }
  }

  createProducto(producto: Producto): void {
    console.log('MainProductoComponent: Creating producto:', producto);
    this.productoService.createProducto(producto).subscribe({
      next: (newProducto) => {
        console.log('MainProductoComponent: Producto created:', newProducto);
        this.productos.push(newProducto);
        this.filteredProductos.push(newProducto);
        this.visibleDialogForm = false;
        this.resetForm();
        this.messageService.add({ severity: 'success', summary: 'Producto Creado', detail: 'Producto registrado exitosamente.' });
      },
      error: (err) => console.error('Error creating producto:', err),
    });
  }

  updateProducto(producto: Producto): void {
    console.log('MainProductoComponent: Updating producto:', producto);
    this.productoService.updateProducto(producto.id, producto).subscribe({
      next: (updatedProducto) => {
        console.log('MainProductoComponent: Producto updated:', updatedProducto);
        const index = this.productos.findIndex((p) => p.id === updatedProducto.id);
        if (index !== -1) this.productos[index] = updatedProducto;
        this.filteredProductos = [...this.productos];
        this.visibleDialogForm = false;
        this.resetForm();
        this.messageService.add({ severity: 'success', summary: 'Producto Actualizado', detail: 'Producto modificado exitosamente.' });
      },
      error: (err) => console.error('Error updating producto:', err),
    });
  }

  deleteProducto(id: string): void {
    console.log('MainProductoComponent: Deleting producto with ID:', id);
    this.productoService.deleteProducto(id).subscribe({
      next: () => {
        console.log('MainProductoComponent: Producto deleted with ID:', id);
        this.productos = this.productos.filter((p) => p.id !== id);
        this.filteredProductos = this.filteredProductos.filter((p) => p.id !== id);
        this.messageService.add({ severity: 'warn', summary: 'Producto Eliminado', detail: 'Producto eliminado correctamente.' });
      },
      error: (err) => console.error('Error deleting producto:', err),
    });
  }
}
