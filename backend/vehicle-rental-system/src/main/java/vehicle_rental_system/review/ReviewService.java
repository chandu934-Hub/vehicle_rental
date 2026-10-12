package vehicle_rental_system.review;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vehicle_rental_system.booking.Booking;
import vehicle_rental_system.booking.BookingRepository;
import vehicle_rental_system.booking.BookingStatus;
import vehicle_rental_system.common.ResourceNotFoundException;
import vehicle_rental_system.user.User;
import vehicle_rental_system.user.UserRepository;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    public ReviewService(ReviewRepository reviewRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository; this.bookingRepository = bookingRepository; this.userRepository = userRepository;
    }
    @Transactional
    public ReviewResponse create(String email, Long bookingId, ReviewRequest request) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getUser().getEmail().equalsIgnoreCase(email)) throw new ResourceNotFoundException("Booking not found");
        if (booking.getStatus() != BookingStatus.COMPLETED) throw new IllegalArgumentException("Reviews require a completed booking");
        if (reviewRepository.existsByBookingId(bookingId)) throw new IllegalArgumentException("Booking already has a review");
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ReviewResponse.from(reviewRepository.save(new Review(booking, user, request.rating(), request.comment())));
    }
    @Transactional(readOnly = true)
    public List<ReviewResponse> forVehicle(Long vehicleId) { return reviewRepository.findByBookingVehicleIdOrderByCreatedAtDesc(vehicleId).stream().map(ReviewResponse::from).toList(); }
}