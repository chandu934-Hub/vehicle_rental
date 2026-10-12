package vehicle_rental_system.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByStartDateDesc(Long userId);
        List<Booking> findAllByOrderByStartDateDesc();
        long countByStatus(BookingStatus status);
    @Query("select count(b) > 0 from Booking b where b.vehicle.id = :vehicleId and b.status <> :cancelled "
            + "and b.startDate < :endDate and b.endDate > :startDate")
    boolean existsOverlapping(@Param("vehicleId") Long vehicleId, @Param("startDate") LocalDate startDate,
                              @Param("endDate") LocalDate endDate, @Param("cancelled") BookingStatus cancelled);
}