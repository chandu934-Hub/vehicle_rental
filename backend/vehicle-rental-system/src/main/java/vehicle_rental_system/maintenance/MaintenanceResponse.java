package vehicle_rental_system.maintenance;

import java.time.LocalDate;

public record MaintenanceResponse(Long id, Long vehicleId, LocalDate startDate, LocalDate endDate,
                                  MaintenanceStatus status, String description) {
    public static MaintenanceResponse from(MaintenanceRecord record) {
        return new MaintenanceResponse(record.getId(), record.getVehicle().getId(), record.getStartDate(), record.getEndDate(),
                record.getStatus(), record.getDescription());
    }
}