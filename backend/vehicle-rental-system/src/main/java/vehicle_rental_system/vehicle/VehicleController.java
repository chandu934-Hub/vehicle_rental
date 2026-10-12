package vehicle_rental_system.vehicle;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final VehicleService vehicleService;
    public VehicleController(VehicleService vehicleService) { this.vehicleService = vehicleService; }

    @GetMapping
    public List<VehicleResponse> search(@RequestParam(required = false) String make,
                                        @RequestParam(required = false) String model,
                                        @RequestParam(required = false) VehicleType type,
                                        @RequestParam(required = false) VehicleStatus status) {
        return vehicleService.search(make, model, type, status);
    }

    @GetMapping("/page")
    public Page<VehicleResponse> searchPage(@RequestParam(required = false) String make,
                                            @RequestParam(required = false) String model,
                                            @RequestParam(required = false) VehicleType type,
                                            @RequestParam(required = false) VehicleStatus status,
                                            Pageable pageable) {
        return vehicleService.searchPage(make, model, type, status, pageable);
    }

    @GetMapping("/{id}")
    public VehicleResponse getById(@PathVariable Long id) {
        return VehicleResponse.from(vehicleService.find(id));
    }
}