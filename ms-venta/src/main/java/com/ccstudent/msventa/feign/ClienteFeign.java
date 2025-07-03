package com.ccstudent.msventa.feign;

import com.ccstudent.msventa.dto.ClienteDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-clientes", path = "/cliente")
public interface ClienteFeign {
    @GetMapping("/{id}")
    @CircuitBreaker(name = "categoriaListarPorIdCB", fallbackMethod = "fallbackClienteListarById")
    public ResponseEntity<ClienteDTO> buscarCliente(@PathVariable Integer id);

    default ResponseEntity<ClienteDTO> fallbackClienteListarById(Integer id, Exception e) {
        ClienteDTO clienteDto = new ClienteDTO();
        clienteDto.setNombre("Servicio no disponible de cliente");
        return ResponseEntity.ok(clienteDto);
    }
}