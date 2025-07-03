package com.ccstudent.msventa.feign;

import com.ccstudent.msventa.dto.TipoVentaDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-tipoventa", path = "/tipoventa")
public interface TipoVentaFeign {
    @GetMapping("/{id}")
    @CircuitBreaker(name = "tipoventaListarPorIdCB", fallbackMethod = "fallbackTipoventaListarById")
    public ResponseEntity<TipoVentaDTO> buscarTipoventa(@PathVariable Integer id);

    default ResponseEntity<TipoVentaDTO> fallbackTipoventaListarById(Integer id, Exception e) {
        TipoVentaDTO tipoVentaDto = new TipoVentaDTO();
        tipoVentaDto.setTipoventa("Servicio no disponible de tipoventa");
        return ResponseEntity.ok(tipoVentaDto);
    }
}