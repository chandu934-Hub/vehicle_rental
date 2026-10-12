package vehicle_rental_system.vehicle;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class VehicleServiceTest {
    private final VehicleRepository repository = mock(VehicleRepository.class);
    private final VehicleService service = new VehicleService(repository);

    @Test
    void createRejectsDuplicateRegistrationNumber() {
        when(repository.existsByRegistrationNumberIgnoreCase("ABC-123")).thenReturn(true);
        VehicleRequest request = new VehicleRequest("Toyota", "Corolla", 2024, "ABC-123", VehicleType.SEDAN,
                VehicleStatus.AVAILABLE, new BigDecimal("50.00"));

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Registration number is already in use");
        verify(repository, never()).save(any());
    }
}