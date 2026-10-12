package vehicle_rental_system.vehicle;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vehicle_rental_system.common.ResourceNotFoundException;

import java.util.List;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) { this.vehicleRepository = vehicleRepository; }

    @Transactional(readOnly = true)
    public List<VehicleResponse> search(String make, String model, VehicleType type, VehicleStatus status) {
        Specification<Vehicle> specification = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        if (make != null && !make.isBlank()) specification = specification.and((root, query, cb) ->
                cb.like(cb.lower(root.get("make")), "%" + make.toLowerCase() + "%"));
        if (model != null && !model.isBlank()) specification = specification.and((root, query, cb) ->
                cb.like(cb.lower(root.get("model")), "%" + model.toLowerCase() + "%"));
        if (type != null) specification = specification.and((root, query, cb) -> cb.equal(root.get("type"), type));
        if (status != null) specification = specification.and((root, query, cb) -> cb.equal(root.get("status"), status));
        return vehicleRepository.findAll(specification, Sort.by("make", "model")).stream().map(VehicleResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Page<VehicleResponse> searchPage(String make, String model, VehicleType type, VehicleStatus status, Pageable pageable) {
        Specification<Vehicle> specification = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        if (make != null && !make.isBlank()) specification = specification.and((root, query, cb) -> cb.like(cb.lower(root.get("make")), "%" + make.toLowerCase() + "%"));
        if (model != null && !model.isBlank()) specification = specification.and((root, query, cb) -> cb.like(cb.lower(root.get("model")), "%" + model.toLowerCase() + "%"));
        if (type != null) specification = specification.and((root, query, cb) -> cb.equal(root.get("type"), type));
        if (status != null) specification = specification.and((root, query, cb) -> cb.equal(root.get("status"), status));
        return vehicleRepository.findAll(specification, pageable).map(VehicleResponse::from);
    }

    @Transactional
    public VehicleResponse create(VehicleRequest request) {
        ensureUniqueRegistration(request.registrationNumber(), null);
        Vehicle vehicle = new Vehicle(request.make().trim(), request.model().trim(), request.year(),
                request.registrationNumber().trim().toUpperCase(), request.type(),
                request.status() == null ? VehicleStatus.AVAILABLE : request.status(), request.dailyRate());
        return VehicleResponse.from(vehicleRepository.save(vehicle));
    }

    @Transactional
    public VehicleResponse update(Long id, VehicleRequest request) {
        Vehicle vehicle = find(id);
        ensureUniqueRegistration(request.registrationNumber(), id);
        vehicle.update(request.make().trim(), request.model().trim(), request.year(), request.registrationNumber().trim().toUpperCase(),
                request.type(), request.status() == null ? vehicle.getStatus() : request.status(), request.dailyRate());
        return VehicleResponse.from(vehicle);
    }

    @Transactional
    public void delete(Long id) { vehicleRepository.delete(find(id)); }

    @Transactional(readOnly = true)
    public Vehicle find(Long id) { return vehicleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vehicle not found")); }

    private void ensureUniqueRegistration(String registration, Long currentId) {
        if (vehicleRepository.existsByRegistrationNumberIgnoreCase(registration)
                && (currentId == null || !find(currentId).getRegistrationNumber().equalsIgnoreCase(registration))) {
            throw new IllegalArgumentException("Registration number is already in use");
        }
    }
}