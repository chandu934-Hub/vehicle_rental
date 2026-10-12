package vehicle_rental_system.payment;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentResponse(Long id, Long bookingId, BigDecimal amount, PaymentMethod method,
                              PaymentStatus status, Instant createdAt) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(payment.getId(), payment.getBooking().getId(), payment.getAmount(), payment.getMethod(),
                payment.getStatus(), payment.getCreatedAt());
    }
}