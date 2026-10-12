package vehicle_rental_system.admin;

public record DashboardResponse(long users, long vehicles, long bookings, long confirmedBookings, long completedBookings) { }