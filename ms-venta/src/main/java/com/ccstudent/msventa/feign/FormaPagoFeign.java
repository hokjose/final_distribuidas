package com.ccstudent.msventa.feign;


import com.ccstudent.msventa.dto.FormaPagoDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-formapago")
public interface FormaPagoFeign {
    @GetMapping("/formapago/{id}")
    @CircuitBreaker(name = "formapagoListarPorIdCB", fallbackMethod = "fallbackFormapagoListarById")
    public ResponseEntity<FormaPagoDTO> buscarformapago(@PathVariable Integer id);

    default ResponseEntity<FormaPagoDTO> fallbackFormapagoListarById(Integer id, Exception e) {
        FormaPagoDTO formaPagoDto = new FormaPagoDTO();
        formaPagoDto.setFormapago("Servicio no disponible de formapago");
        return ResponseEntity.ok(formaPagoDto);
    }
}