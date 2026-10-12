package vehicle_rental_system.user;

public enum Role {
    CUSTOMER,
    ADMIN,
    /** Legacy database value; new registrations use CUSTOMER. */
    USER
}