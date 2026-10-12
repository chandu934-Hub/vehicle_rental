package vehicle_rental_system.maintenance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRecord, Long> {
    @Query("select count(m) > 0 from MaintenanceRecord m where m.vehicle.id = :vehicleId "
            + "and m.status in (vehicle_rental_system.maintenance.MaintenanceStatus.SCHEDULED, vehicle_rental_system.maintenance.MaintenanceStatus.IN_PROGRESS) "
            + "and m.startDate < :endDate and m.endDate > :startDate")
    boolean existsOverlapping(@Param("vehicleId") Long vehicleId, @Param("startDate") LocalDate startDate,
                              @Param("endDate") LocalDate endDate);
    List<MaintenanceRecord> findByVehicleIdOrderByStartDateDesc(Long vehicleId);
}