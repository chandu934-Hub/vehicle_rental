package vehicle_rental_system.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import vehicle_rental_system.user.User;
import vehicle_rental_system.user.UserRepository;
import vehicle_rental_system.user.UserService;
import vehicle_rental_system.user.Role;

@Service
public class AuthService {
    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserService userService, UserRepository userRepository,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        User user = userService.register(request);
        return tokenFor(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmailIgnoreCase(request.email()).orElseThrow();
        return tokenFor(user);
    }

    private AuthResponse tokenFor(User user) {
        var details = userService.loadUserByUsername(user.getEmail());
        Role effectiveRole = user.getRole() == Role.USER ? Role.CUSTOMER : user.getRole();
        return new AuthResponse(jwtService.generateToken(details), user.getEmail(), effectiveRole.name(), user.getFullName(), user.getPhoneNumber());
    }
}