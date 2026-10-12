package vehicle_rental_system.payment;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(@NotNull PaymentMethod method) { }