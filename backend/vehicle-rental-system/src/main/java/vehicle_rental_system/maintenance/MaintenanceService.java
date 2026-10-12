package vehicle_rental_system.maintenance;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vehicle_rental_system.common.ResourceNotFoundException;
import vehicle_rental_system.vehicle.VehicleService;
import java.util.List;

@Service
public class MaintenanceService {
    private final MaintenanceRepository repository;
    private final VehicleService vehicleService;
    public MaintenanceService(MaintenanceRepository repository, VehicleService vehicleService) {
        this.repository = repository; this.vehicleService = vehicleService;
    }
    @Transactional(readOnly = true)
    public List<MaintenanceResponse> all() { return repository.findAll().stream().map(MaintenanceResponse::from).toList(); }
    @Transactional
    public MaintenanceResponse create(MaintenanceRequest request) {
        validateDates(request);
        MaintenanceRecord record = new MaintenanceRecord(vehicleService.find(request.vehicleId()), request.startDate(), request.endDate(),
                request.status() == null ? MaintenanceStatus.SCHEDULED : request.status(), request.description().trim());
        return MaintenanceResponse.from(repository.save(record));
    }
    @Transactional
    public MaintenanceResponse update(Long id, MaintenanceRequest request) {
        validateDates(request);
        MaintenanceRecord record = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found"));
        if (!record.getVehicle().getId().equals(request.vehicleId())) throw new IllegalArgumentException("Vehicle cannot be changed");
        record.update(request.startDate(), request.endDate(), request.status() == null ? record.getStatus() : request.status(), request.description().trim());
        return MaintenanceResponse.from(record);
    }
    @Transactional
    public void delete(Long id) { repository.delete(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found"))); }
    private void validateDates(MaintenanceRequest request) {
        if (!request.endDate().isAfter(request.startDate())) throw new IllegalArgumentException("End date must be after start date");
    }
}