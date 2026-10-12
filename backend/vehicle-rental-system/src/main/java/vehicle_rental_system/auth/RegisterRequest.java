package vehicle_rental_system.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 100) String fullName,
        @NotBlank @Size(min = 7, max = 20) String phoneNumber,
        @NotBlank @Email @Size(max = 120) String email,
        @NotBlank @Size(min = 6, max = 100) String password) {

    public RegisterRequest(String email, String password) {
        this(null, null, email, password);
    }
}