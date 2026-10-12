package vehicle_rental_system.vehicle;

import java.math.BigDecimal;

public record VehicleResponse(Long id, String make, String model, Integer year, String registrationNumber,
                              VehicleType type, VehicleStatus status, BigDecimal dailyRate) {
    public static VehicleResponse from(Vehicle vehicle) {
        return new VehicleResponse(vehicle.getId(), vehicle.getMake(), vehicle.getModel(), vehicle.getYear(),
                vehicle.getRegistrationNumber(), vehicle.getType(), vehicle.getStatus(), vehicle.getDailyRate());
    }
}