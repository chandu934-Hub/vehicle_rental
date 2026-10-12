package vehicle_rental_system.booking;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vehicle_rental_system.common.ResourceNotFoundException;
import vehicle_rental_system.user.User;
import vehicle_rental_system.user.UserRepository;
import vehicle_rental_system.vehicle.Vehicle;
import vehicle_rental_system.vehicle.VehicleService;
import vehicle_rental_system.vehicle.VehicleStatus;
import vehicle_rental_system.maintenance.MaintenanceRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleService vehicleService;
    private final MaintenanceRepository maintenanceRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, VehicleService vehicleService) {
        this(bookingRepository, userRepository, vehicleService, null);
    }

    @org.springframework.beans.factory.annotation.Autowired
    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, VehicleService vehicleService,
                          MaintenanceRepository maintenanceRepository) {
        this.bookingRepository = bookingRepository; this.userRepository = userRepository; this.vehicleService = vehicleService;
        this.maintenanceRepository = maintenanceRepository;
    }

    @Transactional
    public BookingResponse create(String email, BookingRequest request) {
        if (!request.endDate().isAfter(request.startDate())) throw new IllegalArgumentException("End date must be after start date");
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Vehicle vehicle = vehicleService.find(request.vehicleId());
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) throw new IllegalArgumentException("Vehicle is unavailable");
        if (maintenanceRepository != null && maintenanceRepository.existsOverlapping(vehicle.getId(), request.startDate(), request.endDate())) {
            throw new IllegalArgumentException("Vehicle is unavailable due to maintenance");
        }
        if (bookingRepository.existsOverlapping(vehicle.getId(), request.startDate(), request.endDate(), BookingStatus.CANCELLED)) {
            throw new IllegalArgumentException("Vehicle is already booked for those dates");
        }
        long days = ChronoUnit.DAYS.between(request.startDate(), request.endDate());
        BigDecimal price = vehicle.getDailyRate().multiply(BigDecimal.valueOf(days)).setScale(2, RoundingMode.HALF_UP);
        return BookingResponse.from(bookingRepository.save(new Booking(user, vehicle, request.startDate(), request.endDate(), price)));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> all() {
        return bookingRepository.findAllByOrderByStartDateDesc().stream().map(BookingResponse::from).toList();
    }

    @Transactional
    public BookingResponse updateStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (status == BookingStatus.PENDING) throw new IllegalArgumentException("Pending is not an administrative booking status");
        booking.setStatus(status);
        return BookingResponse.from(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> forUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserIdOrderByStartDateDesc(user.getId()).stream().map(BookingResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getById(String email, Long id, boolean admin) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!admin && !booking.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new ResourceNotFoundException("Booking not found");
        }
        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse cancel(String email, Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getUser().getEmail().equalsIgnoreCase(email)) throw new ResourceNotFoundException("Booking not found");
        if (booking.getStatus() != BookingStatus.CONFIRMED) throw new IllegalArgumentException("Only confirmed bookings can be cancelled");
        booking.setStatus(BookingStatus.CANCELLED);
        return BookingResponse.from(booking);
    }
}