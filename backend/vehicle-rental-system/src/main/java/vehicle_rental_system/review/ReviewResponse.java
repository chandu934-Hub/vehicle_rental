package vehicle_rental_system.review;

import java.time.Instant;

public record ReviewResponse(Long id, Long bookingId, Long vehicleId, Integer rating, String comment, Instant createdAt) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(review.getId(), review.getBooking().getId(), review.getBooking().getVehicle().getId(),
                review.getRating(), review.getComment(), review.getCreatedAt());
    }
}