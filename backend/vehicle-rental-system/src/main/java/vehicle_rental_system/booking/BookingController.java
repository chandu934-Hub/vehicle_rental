package vehicle_rental_system.booking;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;
    public BookingController(BookingService bookingService) { this.bookingService = bookingService; }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse create(@AuthenticationPrincipal UserDetails user, @Valid @RequestBody BookingRequest request) {
        return bookingService.create(user.getUsername(), request);
    }
    @GetMapping
    public List<BookingResponse> mine(@AuthenticationPrincipal UserDetails user) { return bookingService.forUser(user.getUsername()); }
    @GetMapping("/{id}")
    public BookingResponse getById(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        boolean isAdmin = user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return bookingService.getById(user.getUsername(), id, isAdmin);
    }
    @DeleteMapping("/{id}")
    public BookingResponse cancel(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        return bookingService.cancel(user.getUsername(), id);
    }
}