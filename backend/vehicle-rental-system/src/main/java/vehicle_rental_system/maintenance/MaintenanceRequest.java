package vehicle_rental_system.maintenance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record MaintenanceRequest(@NotNull Long vehicleId, @NotNull LocalDate startDate, @NotNull LocalDate endDate,
                                 MaintenanceStatus status, @NotBlank @Size(max = 500) String description) { }