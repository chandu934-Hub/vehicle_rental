package vehicle_rental_system.admin;

import vehicle_rental_system.user.User;

public record AdminUserResponse(Long id, String email, String role, String fullName, String phoneNumber) {
    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(user.getId(), user.getEmail(), user.getRole().name(), user.getFullName(), user.getPhoneNumber());
    }
}