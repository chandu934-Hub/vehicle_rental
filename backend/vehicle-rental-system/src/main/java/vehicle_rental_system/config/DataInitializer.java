package vehicle_rental_system.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vehicle_rental_system.user.Role;
import vehicle_rental_system.user.User;
import vehicle_rental_system.user.UserRepository;
import vehicle_rental_system.vehicle.Vehicle;
import vehicle_rental_system.vehicle.VehicleRepository;
import vehicle_rental_system.vehicle.VehicleStatus;
import vehicle_rental_system.vehicle.VehicleType;

import java.math.BigDecimal;
import java.util.List;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, VehicleRepository vehicleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!userRepository.existsByEmailIgnoreCase("admin@roamrentals.com")) {
            log.info("Seeding default admin user for Roam Rentals...");
            userRepository.save(new User("admin@roamrentals.com", passwordEncoder.encode("Admin@12345"), Role.ADMIN, "Roam Administrator", "+91 98765 43210"));
            log.info("Default admin created: admin@roamrentals.com / Admin@12345 (ADMIN)");
        } else {
            userRepository.findByEmailIgnoreCase("admin@roamrentals.com").ifPresent(admin -> {
                if (admin.getFullName() == null || admin.getFullName().isBlank()) {
                    admin.setFullName("Roam Administrator");
                    admin.setPhoneNumber("+91 98765 43210");
                    userRepository.save(admin);
                }
            });
        }

        if (!userRepository.existsByEmailIgnoreCase("customer@roamrentals.com")) {
            log.info("Seeding default customer user for Roam Rentals...");
            userRepository.save(new User("customer@roamrentals.com", passwordEncoder.encode("Customer@12345"), Role.CUSTOMER, "Alex Rivera", "+91 91234 56789"));
            log.info("Default customer created: customer@roamrentals.com / Customer@12345 (CUSTOMER)");
        } else {
            userRepository.findByEmailIgnoreCase("customer@roamrentals.com").ifPresent(cust -> {
                if (cust.getFullName() == null || cust.getFullName().isBlank()) {
                    cust.setFullName("Alex Rivera");
                    cust.setPhoneNumber("+91 91234 56789");
                    userRepository.save(cust);
                }
            });
        }

        if (vehicleRepository.count() == 0) {
            log.info("Seeding initial fleet for Roam Rentals...");
            List<Vehicle> initialFleet = List.of(
                    new Vehicle("Tesla", "Model 3 Long Range", 2024, "DL-01-AB-1234", VehicleType.SEDAN, VehicleStatus.AVAILABLE, new BigDecimal("4500.00")),
                    new Vehicle("BMW", "3 Series Gran Limousine", 2023, "MH-02-CD-5678", VehicleType.SEDAN, VehicleStatus.AVAILABLE, new BigDecimal("6200.00")),
                    new Vehicle("Toyota", "RAV4 Hybrid AWD", 2024, "KA-03-EF-9012", VehicleType.SUV, VehicleStatus.AVAILABLE, new BigDecimal("4800.00")),
                    new Vehicle("Mercedes-Benz", "GLC 300 4MATIC", 2024, "MH-01-PQ-6789", VehicleType.SUV, VehicleStatus.AVAILABLE, new BigDecimal("8900.00")),
                    new Vehicle("Hyundai", "Ioniq 5 Electric", 2024, "DL-04-LM-2345", VehicleType.HATCHBACK, VehicleStatus.AVAILABLE, new BigDecimal("3900.00")),
                    new Vehicle("Volkswagen", "Golf GTI Performance", 2023, "KA-05-RS-1122", VehicleType.HATCHBACK, VehicleStatus.AVAILABLE, new BigDecimal("3400.00")),
                    new Vehicle("Honda", "Odyssey Elite Touring", 2024, "KL-07-JK-7890", VehicleType.VAN, VehicleStatus.AVAILABLE, new BigDecimal("5200.00")),
                    new Vehicle("Ford", "F-150 Lariat SuperCrew", 2023, "TS-09-GH-3456", VehicleType.TRUCK, VehicleStatus.AVAILABLE, new BigDecimal("7500.00"))
            );
            vehicleRepository.saveAll(initialFleet);
            log.info("Seeded {} vehicles into Roam Rentals fleet.", initialFleet.size());
        }
    }
}
