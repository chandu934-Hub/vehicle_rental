package vehicle_rental_system.review;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {
    private final ReviewService service;
    public ReviewController(ReviewService service) { this.service = service; }
    @PostMapping("/bookings/{bookingId}/review")
    public ReviewResponse create(@AuthenticationPrincipal UserDetails user, @PathVariable Long bookingId, @Valid @RequestBody ReviewRequest request) { return service.create(user.getUsername(), bookingId, request); }
    @GetMapping("/vehicles/{vehicleId}/reviews")
    public List<ReviewResponse> forVehicle(@PathVariable Long vehicleId) { return service.forVehicle(vehicleId); }
}