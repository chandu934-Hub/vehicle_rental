package vehicle_rental_system.booking;

import jakarta.persistence.*;
import vehicle_rental_system.user.User;
import vehicle_rental_system.vehicle.Vehicle;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) private Vehicle vehicle;
    @Column(nullable = false) private LocalDate startDate;
    @Column(nullable = false) private LocalDate endDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private BookingStatus status;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal totalPrice;

    protected Booking() { }
    public Booking(User user, Vehicle vehicle, LocalDate startDate, LocalDate endDate, BigDecimal totalPrice) {
        this.user = user; this.vehicle = vehicle; this.startDate = startDate; this.endDate = endDate;
        this.totalPrice = totalPrice; this.status = BookingStatus.CONFIRMED;
    }
    public Long getId() { return id; }
    public User getUser() { return user; }
    public Vehicle getVehicle() { return vehicle; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public BookingStatus getStatus() { return status; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setStatus(BookingStatus status) { this.status = status; }
}