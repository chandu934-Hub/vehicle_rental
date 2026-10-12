package vehicle_rental_system.maintenance;

import jakarta.persistence.*;
import vehicle_rental_system.vehicle.Vehicle;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_records")
public class MaintenanceRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) private Vehicle vehicle;
    @Column(nullable = false) private LocalDate startDate;
    @Column(nullable = false) private LocalDate endDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private MaintenanceStatus status;
    @Column(nullable = false, length = 500) private String description;

    protected MaintenanceRecord() { }
    public MaintenanceRecord(Vehicle vehicle, LocalDate startDate, LocalDate endDate, MaintenanceStatus status, String description) {
        this.vehicle = vehicle; this.startDate = startDate; this.endDate = endDate; this.status = status; this.description = description;
    }
    public Long getId() { return id; }
    public Vehicle getVehicle() { return vehicle; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public MaintenanceStatus getStatus() { return status; }
    public String getDescription() { return description; }
    public void update(LocalDate startDate, LocalDate endDate, MaintenanceStatus status, String description) {
        this.startDate = startDate; this.endDate = endDate; this.status = status; this.description = description;
    }
}