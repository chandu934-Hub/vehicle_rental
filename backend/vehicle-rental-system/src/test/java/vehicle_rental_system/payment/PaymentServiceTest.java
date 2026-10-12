package vehicle_rental_system.payment;

import org.junit.jupiter.api.Test;
import vehicle_rental_system.booking.*;
import vehicle_rental_system.user.*;
import vehicle_rental_system.vehicle.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PaymentServiceTest {
    private final PaymentRepository payments = mock(PaymentRepository.class);
    private final BookingRepository bookings = mock(BookingRepository.class);
    private final UserRepository users = mock(UserRepository.class);
    private final PaymentService service = new PaymentService(payments, bookings, users);

    @Test
    void paymentUsesBookingTotalAndMarksSimulationSuccessful() {
        User user = new User("person@example.com", "hash", Role.CUSTOMER);
        Vehicle vehicle = new Vehicle("Toyota", "Corolla", 2024, "ABC-123", VehicleType.SEDAN, VehicleStatus.AVAILABLE, new BigDecimal("50.00"));
        Booking booking = new Booking(user, vehicle, LocalDate.of(2030, 1, 1), LocalDate.of(2030, 1, 3), new BigDecimal("100.00"));
        when(bookings.findById(1L)).thenReturn(Optional.of(booking));
        when(payments.findByBookingId(1L)).thenReturn(Optional.empty());
        when(payments.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = service.pay("person@example.com", 1L, new PaymentRequest(PaymentMethod.CARD), false);

        assertThat(response.amount()).isEqualByComparingTo("100.00");
        assertThat(response.status()).isEqualTo(PaymentStatus.SUCCESS);
    }

    @Test
    void customerCannotPayAnotherCustomersBooking() {
        User user = new User("person@example.com", "hash", Role.CUSTOMER);
        Vehicle vehicle = new Vehicle("Toyota", "Corolla", 2024, "ABC-123", VehicleType.SEDAN, VehicleStatus.AVAILABLE, new BigDecimal("50.00"));
        when(bookings.findById(1L)).thenReturn(Optional.of(new Booking(user, vehicle, LocalDate.of(2030, 1, 1), LocalDate.of(2030, 1, 3), new BigDecimal("100.00"))));
        assertThatThrownBy(() -> service.pay("other@example.com", 1L, new PaymentRequest(PaymentMethod.CARD), false))
                .isInstanceOf(vehicle_rental_system.common.ResourceNotFoundException.class);
    }
}