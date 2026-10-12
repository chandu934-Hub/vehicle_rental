package vehicle_rental_system.vehicle;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record VehicleRequest(
        @NotBlank @Size(max = 80) String make,
        @NotBlank @Size(max = 80) String model,
        @NotNull @Min(1900) @Max(2100) Integer year,
        @NotBlank @Size(max = 30) String registrationNumber,
        @NotNull VehicleType type,
        VehicleStatus status,
        @NotNull @DecimalMin(value = "0.01") @Digits(integer = 8, fraction = 2) BigDecimal dailyRate) {
}