package com.ccstudent.msventa.service;

import com.ccstudent.msventa.entity.DetalleVenta;

import java.util.List;

public interface DetalleVentaService {
    List<DetalleVenta> findAll();
    DetalleVenta create(DetalleVenta detalleventa);
}
