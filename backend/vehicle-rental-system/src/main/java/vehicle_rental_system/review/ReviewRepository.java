package vehicle_rental_system.review;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByBookingId(Long bookingId);
    List<Review> findByBookingVehicleIdOrderByCreatedAtDesc(Long vehicleId);
}