package vehicle_rental_system.vehicle;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 80) private String make;
    @Column(nullable = false, length = 80) private String model;
    @Column(name = "vehicle_year", nullable = false) private Integer year;
    @Column(nullable = false, unique = true, length = 30) private String registrationNumber;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private VehicleType type;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private VehicleStatus status;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal dailyRate;

    protected Vehicle() { }

    public Vehicle(String make, String model, Integer year, String registrationNumber,
                   VehicleType type, VehicleStatus status, BigDecimal dailyRate) {
        this.make = make; this.model = model; this.year = year; this.registrationNumber = registrationNumber;
        this.type = type; this.status = status; this.dailyRate = dailyRate;
    }

    public Long getId() { return id; }
    public String getMake() { return make; }
    public String getModel() { return model; }
    public Integer getYear() { return year; }
    public String getRegistrationNumber() { return registrationNumber; }
    public VehicleType getType() { return type; }
    public VehicleStatus getStatus() { return status; }
    public BigDecimal getDailyRate() { return dailyRate; }

    public void update(String make, String model, Integer year, String registrationNumber,
                       VehicleType type, VehicleStatus status, BigDecimal dailyRate) {
        this.make = make; this.model = model; this.year = year; this.registrationNumber = registrationNumber;
        this.type = type; this.status = status; this.dailyRate = dailyRate;
    }
}