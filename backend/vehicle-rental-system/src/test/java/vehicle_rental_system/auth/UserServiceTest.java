package vehicle_rental_system.auth;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import vehicle_rental_system.user.User;
import vehicle_rental_system.user.UserRepository;
import vehicle_rental_system.user.UserService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {
    private final UserRepository repository = mock(UserRepository.class);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final UserService service = new UserService(repository, encoder);

    @Test
    void registerStoresBcryptHashAndDefaultUserRole() {
        when(repository.existsByEmailIgnoreCase("person@example.com")).thenReturn(false);
        when(repository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = service.register(new RegisterRequest("Chandu Kumar", "+91 9876543210", "person@example.com", "password123"));

        assertThat(user.getEmail()).isEqualTo("person@example.com");
        assertThat(user.getFullName()).isEqualTo("Chandu Kumar");
        assertThat(user.getPhoneNumber()).isEqualTo("+91 9876543210");
        assertThat(user.getRole().name()).isEqualTo("CUSTOMER");
        assertThat(encoder.matches("password123", user.getPasswordHash())).isTrue();
        verify(repository).save(any(User.class));
    }
}