package vehicle_rental_system.booking;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookingResponse(Long id, Long vehicleId, String vehicleName, LocalDate startDate, LocalDate endDate,
                              BookingStatus status, BigDecimal totalPrice) {
    public static BookingResponse from(Booking booking) {
        return new BookingResponse(booking.getId(), booking.getVehicle().getId(),
                booking.getVehicle().getMake() + " " + booking.getVehicle().getModel(), booking.getStartDate(),
                booking.getEndDate(), booking.getStatus(), booking.getTotalPrice());
    }
}