package vehicle_rental_system.review;

import org.junit.jupiter.api.Test;
import vehicle_rental_system.booking.*;
import vehicle_rental_system.user.*;
import vehicle_rental_system.vehicle.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReviewServiceTest {
    private final ReviewRepository reviews = mock(ReviewRepository.class);
    private final BookingRepository bookings = mock(BookingRepository.class);
    private final UserRepository users = mock(UserRepository.class);
    private final ReviewService service = new ReviewService(reviews, bookings, users);

    @Test
    void reviewRequiresCompletedBookingAndCannotBeRepeated() {
        User user = new User("person@example.com", "hash", Role.CUSTOMER);
        Vehicle vehicle = new Vehicle("Toyota", "Corolla", 2024, "ABC-123", VehicleType.SEDAN, VehicleStatus.AVAILABLE, new BigDecimal("50.00"));
        Booking booking = new Booking(user, vehicle, LocalDate.of(2030, 1, 1), LocalDate.of(2030, 1, 3), new BigDecimal("100.00"));
        when(bookings.findById(1L)).thenReturn(Optional.of(booking));
        assertThatThrownBy(() -> service.create("person@example.com", 1L, new ReviewRequest(5, "good")))
                .isInstanceOf(IllegalArgumentException.class).hasMessage("Reviews require a completed booking");
        booking.setStatus(BookingStatus.COMPLETED);
        when(reviews.existsByBookingId(1L)).thenReturn(true);
        assertThatThrownBy(() -> service.create("person@example.com", 1L, new ReviewRequest(5, "good")))
                .isInstanceOf(IllegalArgumentException.class).hasMessage("Booking already has a review");
    }
}