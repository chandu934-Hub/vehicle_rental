package vehicle_rental_system.payment;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings/{bookingId}/payment")
public class PaymentController {
    private final PaymentService service;
    public PaymentController(PaymentService service) { this.service = service; }
    @PostMapping
    public PaymentResponse pay(@AuthenticationPrincipal UserDetails user, @PathVariable Long bookingId,
                               @Valid @RequestBody PaymentRequest request) {
        return service.pay(user.getUsername(), bookingId, request, user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }
    @GetMapping
    public PaymentResponse get(@AuthenticationPrincipal UserDetails user, @PathVariable Long bookingId) {
        return service.forBooking(user.getUsername(), bookingId, user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }
}