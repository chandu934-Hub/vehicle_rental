package vehicle_rental_system.auth;

public record AuthResponse(String token, String email, String role, String fullName, String phoneNumber) {
    public AuthResponse(String token, String email, String role) {
        this(token, email, role, null, null);
    }
}