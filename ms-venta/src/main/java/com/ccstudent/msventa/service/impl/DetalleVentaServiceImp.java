package com.ccstudent.msventa.service.impl;

import com.ccstudent.msventa.entity.DetalleVenta;
import com.ccstudent.msventa.repository.DetalleVentaRepository;
import com.ccstudent.msventa.service.DetalleVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleVentaServiceImp implements DetalleVentaService {
    @Autowired
    DetalleVentaRepository repository;

    @Override
    public List<DetalleVenta> findAll() {
        return repository.findAll();
    }
    @Override
    public DetalleVenta create(DetalleVenta detalleventa) {
        return repository.save(detalleventa);
    }
}
