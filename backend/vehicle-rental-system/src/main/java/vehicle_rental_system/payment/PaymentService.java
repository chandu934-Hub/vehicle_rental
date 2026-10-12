package vehicle_rental_system.payment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vehicle_rental_system.booking.Booking;
import vehicle_rental_system.booking.BookingRepository;
import vehicle_rental_system.booking.BookingStatus;
import vehicle_rental_system.common.ResourceNotFoundException;
import vehicle_rental_system.user.Role;
import vehicle_rental_system.user.UserRepository;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.paymentRepository = paymentRepository; this.bookingRepository = bookingRepository; this.userRepository = userRepository;
    }
    @Transactional
    public PaymentResponse pay(String email, Long bookingId, PaymentRequest request, boolean admin) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!admin && !booking.getUser().getEmail().equalsIgnoreCase(email)) throw new ResourceNotFoundException("Booking not found");
        if (booking.getStatus() == BookingStatus.CANCELLED) throw new IllegalArgumentException("Cancelled bookings cannot be paid");
        if (paymentRepository.findByBookingId(bookingId).isPresent()) throw new IllegalArgumentException("Booking already has a payment");
        Payment payment = new Payment(booking, booking.getTotalPrice(), request.method());
        payment.setStatus(PaymentStatus.SUCCESS);
        return PaymentResponse.from(paymentRepository.save(payment));
    }
    @Transactional(readOnly = true)
    public PaymentResponse forBooking(String email, Long bookingId, boolean admin) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!admin && !booking.getUser().getEmail().equalsIgnoreCase(email)) throw new ResourceNotFoundException("Booking not found");
        return paymentRepository.findByBookingId(bookingId).map(PaymentResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }
}