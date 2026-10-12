package vehicle_rental_system.booking;

import org.junit.jupiter.api.Test;
import vehicle_rental_system.user.User;
import vehicle_rental_system.user.UserRepository;
import vehicle_rental_system.vehicle.Vehicle;
import vehicle_rental_system.vehicle.VehicleService;
import vehicle_rental_system.vehicle.VehicleStatus;
import vehicle_rental_system.vehicle.VehicleType;
import vehicle_rental_system.maintenance.MaintenanceRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookingServiceTest {
    private final BookingRepository bookingRepository = mock(BookingRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final VehicleService vehicleService = mock(VehicleService.class);
    private final BookingService service = new BookingService(bookingRepository, userRepository, vehicleService);

    @Test
    void createCalculatesPriceFromDailyRateAndRentalDays() {
        User user = new User("person@example.com", "hash", vehicle_rental_system.user.Role.USER);
        Vehicle vehicle = new Vehicle("Toyota", "Corolla", 2024, "ABC-123", VehicleType.SEDAN,
                VehicleStatus.AVAILABLE, new BigDecimal("50.00"));
        when(userRepository.findByEmailIgnoreCase("person@example.com")).thenReturn(Optional.of(user));
        when(vehicleService.find(1L)).thenReturn(vehicle);
        when(bookingRepository.existsOverlapping(any(), any(), any(), any())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = service.create("person@example.com",
                new BookingRequest(1L, LocalDate.of(2030, 1, 10), LocalDate.of(2030, 1, 13)));

        assertThat(response.totalPrice()).isEqualByComparingTo("150.00");
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createRejectsOverlappingBooking() {
        User user = new User("person@example.com", "hash", vehicle_rental_system.user.Role.USER);
        Vehicle vehicle = new Vehicle("Toyota", "Corolla", 2024, "ABC-123", VehicleType.SEDAN,
                VehicleStatus.AVAILABLE, new BigDecimal("50.00"));
        when(userRepository.findByEmailIgnoreCase("person@example.com")).thenReturn(Optional.of(user));
        when(vehicleService.find(1L)).thenReturn(vehicle);
        when(bookingRepository.existsOverlapping(any(), any(), any(), any())).thenReturn(true);

        assertThatThrownBy(() -> service.create("person@example.com",
                new BookingRequest(1L, LocalDate.of(2030, 1, 10), LocalDate.of(2030, 1, 13))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Vehicle is already booked for those dates");
        verify(bookingRepository, never()).save(any());
    }

        @Test
        void customerCanCancelOnlyTheirConfirmedBooking() {
                User user = new User("person@example.com", "hash", vehicle_rental_system.user.Role.CUSTOMER);
                Vehicle vehicle = new Vehicle("Toyota", "Corolla", 2024, "ABC-123", VehicleType.SEDAN, VehicleStatus.AVAILABLE, new BigDecimal("50.00"));
                Booking booking = new Booking(user, vehicle, LocalDate.of(2030, 1, 10), LocalDate.of(2030, 1, 13), new BigDecimal("150.00"));
                when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

                assertThat(service.cancel("person@example.com", 1L).status()).isEqualTo(BookingStatus.CANCELLED);
                assertThatThrownBy(() -> service.cancel("other@example.com", 1L)).isInstanceOf(vehicle_rental_system.common.ResourceNotFoundException.class);
        }

        @Test
        void maintenanceDatesBlockBooking() {
                MaintenanceRepository maintenanceRepository = mock(MaintenanceRepository.class);
                BookingService maintenanceAwareService = new BookingService(bookingRepository, userRepository, vehicleService, maintenanceRepository);
                User user = new User("person@example.com", "hash", vehicle_rental_system.user.Role.CUSTOMER);
                Vehicle vehicle = new Vehicle("Toyota", "Corolla", 2024, "ABC-123", VehicleType.SEDAN, VehicleStatus.AVAILABLE, new BigDecimal("50.00"));
                when(userRepository.findByEmailIgnoreCase("person@example.com")).thenReturn(Optional.of(user));
                when(vehicleService.find(1L)).thenReturn(vehicle);
                when(maintenanceRepository.existsOverlapping(any(), any(), any())).thenReturn(true);

                assertThatThrownBy(() -> maintenanceAwareService.create("person@example.com", new BookingRequest(1L, LocalDate.of(2030, 1, 10), LocalDate.of(2030, 1, 13))))
                                .isInstanceOf(IllegalArgumentException.class).hasMessage("Vehicle is unavailable due to maintenance");
        }

    @Test
    void getByIdReturnsBookingForOwnerOrAdmin() {
        User user = new User("person@example.com", "hash", vehicle_rental_system.user.Role.CUSTOMER);
        Vehicle vehicle = new Vehicle("Toyota", "Corolla", 2024, "ABC-123", VehicleType.SEDAN, VehicleStatus.AVAILABLE, new BigDecimal("50.00"));
        Booking booking = new Booking(user, vehicle, LocalDate.of(2030, 1, 10), LocalDate.of(2030, 1, 13), new BigDecimal("150.00"));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        assertThat(service.getById("person@example.com", 1L, false).vehicleName()).contains("Toyota");
        assertThat(service.getById("admin@roam.com", 1L, true).vehicleName()).contains("Toyota");
        assertThatThrownBy(() -> service.getById("stranger@example.com", 1L, false))
                .isInstanceOf(vehicle_rental_system.common.ResourceNotFoundException.class);
    }
}