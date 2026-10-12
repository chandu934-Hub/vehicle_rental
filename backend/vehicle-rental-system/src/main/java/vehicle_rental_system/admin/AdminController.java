package vehicle_rental_system.admin;

import org.springframework.web.bind.annotation.*;
import vehicle_rental_system.booking.*;
import vehicle_rental_system.user.UserRepository;
import vehicle_rental_system.vehicle.VehicleRepository;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    public AdminController(UserRepository userRepository, VehicleRepository vehicleRepository, BookingRepository bookingRepository, BookingService bookingService) {
        this.userRepository = userRepository; this.vehicleRepository = vehicleRepository; this.bookingRepository = bookingRepository; this.bookingService = bookingService;
    }
    @GetMapping("/users") public List<AdminUserResponse> users() { return userRepository.findAll().stream().map(AdminUserResponse::from).toList(); }
    @GetMapping("/bookings") public List<BookingResponse> bookings() { return bookingService.all(); }
    @PatchMapping("/bookings/{id}/status") public BookingResponse status(@PathVariable Long id, @RequestParam BookingStatus status) { return bookingService.updateStatus(id, status); }
    @GetMapping("/dashboard") public DashboardResponse dashboard() {
        return new DashboardResponse(userRepository.count(), vehicleRepository.count(), bookingRepository.count(),
                bookingRepository.countByStatus(BookingStatus.CONFIRMED), bookingRepository.countByStatus(BookingStatus.COMPLETED));
    }
}