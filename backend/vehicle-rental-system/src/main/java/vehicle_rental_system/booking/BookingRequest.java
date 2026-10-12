package vehicle_rental_system.booking;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record BookingRequest(@NotNull Long vehicleId, @NotNull @Future LocalDate startDate,
                             @NotNull @Future LocalDate endDate) { }