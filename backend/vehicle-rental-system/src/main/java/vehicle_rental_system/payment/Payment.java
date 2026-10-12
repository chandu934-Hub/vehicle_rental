package vehicle_rental_system.payment;

import jakarta.persistence.*;
import vehicle_rental_system.booking.Booking;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments", uniqueConstraints = @UniqueConstraint(name = "uk_payment_booking", columnNames = "booking_id"))
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "booking_id", nullable = false) private Booking booking;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal amount;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private PaymentMethod method;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private PaymentStatus status;
    @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
    protected Payment() { }
    public Payment(Booking booking, BigDecimal amount, PaymentMethod method) {
        this.booking = booking; this.amount = amount; this.method = method; this.status = PaymentStatus.PENDING;
    }
    public Long getId() { return id; }
    public Booking getBooking() { return booking; }
    public BigDecimal getAmount() { return amount; }
    public PaymentMethod getMethod() { return method; }
    public PaymentStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setStatus(PaymentStatus status) { this.status = status; }
}