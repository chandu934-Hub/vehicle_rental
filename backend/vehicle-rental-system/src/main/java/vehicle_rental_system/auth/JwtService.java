package vehicle_rental_system.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-ms}") long expirationMs) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 bytes");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserDetails user) {
        Date now = new Date();
        return Jwts.builder().subject(user.getUsername()).issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .claim("role", user.getAuthorities().iterator().next().getAuthority())
                .signWith(signingKey).compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token)
                .getPayload().getSubject();
    }

    public boolean isValid(String token, UserDetails user) {
        try {
            return extractEmail(token).equalsIgnoreCase(user.getUsername());
        } catch (RuntimeException exception) {
            return false;
        }
    }
}