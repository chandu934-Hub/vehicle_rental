package vehicle_rental_system.review;

import jakarta.persistence.*;
import vehicle_rental_system.booking.Booking;
import vehicle_rental_system.user.User;
import java.time.Instant;

@Entity
@Table(name = "reviews", uniqueConstraints = @UniqueConstraint(name = "uk_review_booking", columnNames = "booking_id"))
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "booking_id", nullable = false) private Booking booking;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) private User user;
    @Column(nullable = false) private Integer rating;
    @Column(length = 1000) private String comment;
    @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
    protected Review() { }
    public Review(Booking booking, User user, Integer rating, String comment) { this.booking = booking; this.user = user; this.rating = rating; this.comment = comment; }
    public Long getId() { return id; }
    public Booking getBooking() { return booking; }
    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public Instant getCreatedAt() { return createdAt; }
}