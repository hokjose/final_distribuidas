package com.ccstudent.msventa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name="ventadetalle")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DetalleVenta {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idventa", nullable = false)
    private Venta venta;

    public Long getIdVenta() {
        return venta != null ? venta.getId() : null;
    }

    private Integer cantidad;
    private String descripcion;
    private BigDecimal preciounitario;
    private BigDecimal importe;

}
