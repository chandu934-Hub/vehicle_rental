package vehicle_rental_system.vehicle;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/vehicles")
public class AdminVehicleController {
    private final VehicleService vehicleService;
    public AdminVehicleController(VehicleService vehicleService) { this.vehicleService = vehicleService; }

    @GetMapping
    public List<VehicleResponse> all() { return vehicleService.search(null, null, null, null); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse create(@Valid @RequestBody VehicleRequest request) { return vehicleService.create(request); }
    @PutMapping("/{id}")
    public VehicleResponse update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) { return vehicleService.update(id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { vehicleService.delete(id); }
}