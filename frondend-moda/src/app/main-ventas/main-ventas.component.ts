import {Component, OnInit} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MessageService} from 'primeng/api';
import {ClienteService} from '../services/cliente.service';
import {Cliente} from '../models/cliente';
import {CardModule} from 'primeng/card';
import {Button, ButtonDirective} from 'primeng/button';
import {ButtonGroupModule} from 'primeng/buttongroup';
import {CurrencyPipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Producto} from '../models/producto';
import {Ripple} from 'primeng/ripple';
import {ProductoService} from '../services/producto.service';
import {DropdownModule} from 'primeng/dropdown';
import {Tipoventa} from '../models/tipoventa';
import {TipoventaService} from '../services/tipoventa.service';
import {Formapago} from '../models/formapago';
import {FormapagoService} from '../services/formapago.service';
import {Venta} from '../models/venta';
import {VentaService} from '../services/venta.service';
import {forkJoin} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DetalleVenta} from '../models/detalleventa';
import {DetalleVentaService} from '../services/detalleventa.service';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-main-ventas',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ButtonDirective,
    ButtonGroupModule,
    CurrencyPipe,
    TableModule,
    Ripple,
    NgForOf,
    NgIf,
    DecimalPipe,
    Button,
    DropdownModule
  ],
  templateUrl: './main-ventas.component.html',
  styleUrl: './main-ventas.component.css',
  providers: [MessageService]
})
export class MainVentasComponent implements OnInit {

  searchDni: string = '';
  foundCliente: Cliente | null = null;
  form: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private tipoventaservice: TipoventaService,
    private formapagoservice:FormapagoService,
    private ventaService:VentaService,
    private http: HttpClient,
    private detalleVentaService:DetalleVentaService,
    private messageService: MessageService,
  ) {
    this.form = this.formBuilder.group({
      dni: ['', Validators.required],
      nombre: ['']
    });
  }

  tipoventa: Tipoventa[] = [];
  formapago: Formapago[] = [];
  ngOnInit(): void {
    this.loadmenus();
    this.calcularTotales();
  }
  loadmenus(): void {
    this.tipoventaservice.getAll().subscribe(data => {
      this.tipoventa = data;
      console.log(data);
    })
    this.formapagoservice.getAll().subscribe(data => {
      this.formapago = data;
      console.log(data);
    })
  }

  onSearch(): void {
    if (!this.searchDni.trim()) {
      this.resetSearch();
      return;
    }

    this.clienteService.getCliente().subscribe({
      next: (clientes: Cliente[]) => {
        this.foundCliente = clientes.find(cliente => cliente.dni === this.searchDni) || null;
        this.form.patchValue({
          nombre: this.foundCliente ? this.foundCliente.nombre : 'El cliente no existe'
        });
      },
      error: (err) => {
        console.error('Error al buscar clientes:', err);
      }
    });
  }

  resetSearch(): void {
    this.foundCliente = null;
    this.form.reset();
  }

  //PRODUCTOS-------------------------------------------------
  filteredProductos: Producto[] = [];
  mensajeTabla: string = 'Busca un producto';

  buscarProductos(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (!input) {
      this.filteredProductos = [];
      this.mensajeTabla = 'Busca un producto';
      return;
    }

    this.productoService.getProductos().subscribe({
      next: (productos: Producto[]) => {
        this.filteredProductos = productos.filter((producto) =>
          producto.producto.toLowerCase().includes(input)
        );

        this.mensajeTabla = this.filteredProductos.length > 0
          ? ''
          : 'Producto Inexistente';
      },
      error: (err) => {
        console.error('Error al buscar productos:', err);
        this.filteredProductos = [];
        this.mensajeTabla = 'Error al cargar productos';
      },
    });
  }


  seleccionarProducto(producto: Producto): void {
    const existente = this.carrito.find((item) => item.id === producto.id);

    if (existente) {
      if (existente.cantidad < producto.stock) {
        existente.cantidad++;
        existente.importe = existente.cantidad * producto.precioventa;
      }
    } else {
      this.carrito.push({
        ...producto,
        cantidad: 1,
        importe: producto.precioventa,
      });
    }

    this.calcularTotales();
    this.filterCarrito();
  }
  //-------------------------------------------------CARRITO DE COMPRAS
  carrito: any[] = [];
  subtotal: number = 0;
  igv: number = 0;
  total: number = 0;
  ajustarCantidad(producto: any, delta: number): void {
    const index = this.carrito.findIndex((item) => item.id === producto.id);
    if (index >= 0) {
      const item = this.carrito[index];
      item.cantidad = Math.max(0, Math.min(item.cantidad + delta, item.stock));
      item.importe = item.cantidad * item.precioventa;

      if (item.cantidad === 0) {
        this.carrito.splice(index, 1);
      }

      this.calcularTotales();
    }
  }
  calcularTotales(): void {
    this.total = this.carrito.reduce((sum, item) => sum + item.importe, 0);
    this.igv = this.total * 0.18;
    this.subtotal = this.total - this.igv;
  }

  cancelarVenta(): void {
    this.carrito = [];
    this.calcularTotales();
  }


//METODO PARA GENERAR VENTA Y  LOS DETALLES DE LA VENTA TMABIEN...
  seleccionarTipoVenta: any;
  seleccionarFormaPago: any;
  generarVenta(): void {
    if (this.carrito.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El carrito está vacío' });
      return;
    }

    // Paso 1: Crear la venta
    const venta: Venta = {
      cliente: this.foundCliente!,
      tipoventa: this.seleccionarTipoVenta,
      formapago: this.seleccionarFormaPago,
      subtotal: this.subtotal,
      igv: this.igv,
      total: this.total,
    };

    this.ventaService.create(venta).subscribe({
      next: (createdVenta) => {

        const ventaId = createdVenta.id;
        const detalles = this.carrito.map(item => ({
          idVenta: ventaId || 0,
          cantidad: item.cantidad,
          descripcion: `${item.producto} (${item.marca?.marca}, ${item.genero?.genero}, ${item.color?.color})`,
          preciounitario: item.precioventa,
          importe: item.importe,
        }));

        this.registrarDetallesVenta(detalles, () => {
          this.actualizarStockProductos(() => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Venta generada con éxito' });
            this.cancelarVenta();

            this.limpiarCampos();
            this.generarBoletaPDF(createdVenta, detalles);
          });
        });
      },
      error: (err) => {
        console.error('Error al crear la venta:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar la venta' });
      }
    });

  }

  limpiarCampos(): void {
    // Limpiar los valores de los campos de búsqueda y dropdown
    this.searchDni = '';
    this.seleccionarTipoVenta = null;
    this.seleccionarFormaPago = null;
    this.form.reset();
    this.foundCliente = null;
    this.carrito = [];
  }


  registrarDetallesVenta(detalles: DetalleVenta[], callback: () => void): void {
    const observables = detalles.map(detalle =>
      this.detalleVentaService.create(detalle).pipe()
    );

    forkJoin(observables).subscribe({
      next: () => {
        console.log('Todos los detalles de venta fueron registrados con éxito.');
        callback();
      },
      error: (err) => {
        console.error('Error al registrar los detalles de la venta:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar los detalles' });
      },
    });
  }
  actualizarStockProductos(callback: () => void): void {
    const observables = this.carrito.map(item => {
      const nuevoStock = item.stock - item.cantidad;
      return this.http.put(`http://localhost:8080/producto/stock/${item.id}`, { stock: nuevoStock });
    });

    forkJoin(observables).subscribe({
      next: () => callback(),
      error: (err) => {
        console.error('Error al actualizar stock:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el stock' });
      },
    });
  }

  //Buscador dentro del carrito
  searchTerm: string = '';
  filteredCarrito = [...this.carrito];

  // Método para filtrar el carrito
  filterCarrito(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredCarrito = [...this.carrito]; // Si no hay búsqueda, muestra todos los productos
    } else {
      this.filteredCarrito = this.carrito.filter(item =>
        item.producto.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }





//BOLETA
  generarBoletaPDF(venta: Venta, detalles: DetalleVenta[]): void {
    const doc = new jsPDF();

    doc.setFontSize(23);
    doc.text(`MODA 3.0`, 80, 18);
    doc.text(` ${venta.tipoventa?.tipoventa}`, 14, 30);

    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 90, 30);

    doc.text(`Cliente: ${venta.cliente?.nombre}`, 14, 50);
    doc.text(`DNI: ${venta.cliente?.dni}`, 14, 60);
    doc.text(`Forma de Pago: ${venta.formapago?.formapago}`, 14, 70);

    let yOffset = 90;

    // Títulos de la tabla
    doc.text('Producto', 14, yOffset);
    doc.text('Cantidad', 100, yOffset);
    doc.text('Precio Unit.', 140, yOffset);
    doc.text('Importe', 180, yOffset);

    yOffset += 10;

    detalles.forEach(detalle => {
      doc.text(detalle.descripcion, 14, yOffset);
      doc.text(detalle.cantidad.toString(), 100, yOffset);
      doc.text(detalle.preciounitario.toFixed(2), 140, yOffset);
      doc.text(detalle.importe.toFixed(2), 180, yOffset);
      yOffset += 10;
    });

    doc.text(`Subtotal: S/. ${venta.subtotal.toFixed(2)}`, 14, yOffset);
    doc.text(`IGV: S/.  ${venta.igv.toFixed(2)}`, 14, yOffset + 10);
    doc.text(`Total: S/. ${venta.total.toFixed(2)}`, 14, yOffset + 20);

    doc.output('dataurlnewwindow');
  }

}
