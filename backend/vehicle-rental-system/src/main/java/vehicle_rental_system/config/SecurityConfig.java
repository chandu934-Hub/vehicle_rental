package vehicle_rental_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import vehicle_rental_system.auth.JwtAuthenticationFilter;
import vehicle_rental_system.user.UserService;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @org.springframework.beans.factory.annotation.Value("${cors.allowed-origins:http://localhost:*,http://127.0.0.1:*,https://*.vercel.app,https://*.onrender.com}")
    private String corsAllowedOrigins;

    @org.springframework.beans.factory.annotation.Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    AuthenticationProvider authenticationProvider(UserService userService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter,
                                            AuthenticationProvider provider) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(provider)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**", "/api/vehicles", "/api/vehicles/**", "/error").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    org.springframework.web.filter.CorsFilter corsFilter() {
        return new org.springframework.web.filter.CorsFilter(corsConfigurationSource());
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        java.util.List<String> origins = new java.util.ArrayList<>();
        if (corsAllowedOrigins != null && !corsAllowedOrigins.isBlank()) {
            for (String origin : corsAllowedOrigins.split(",")) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty()) {
                    origins.add(trimmed);
                }
            }
        }
        if (frontendUrl != null && !frontendUrl.isBlank() && !origins.contains(frontendUrl.trim())) {
            origins.add(frontendUrl.trim());
        }
        java.util.List<String> defaults = java.util.List.of(
                "https://vehicle-rental-two-pi.vercel.app",
                "https://*.vercel.app",
                "https://*.onrender.com",
                "http://localhost:*",
                "http://127.0.0.1:*"
        );
        for (String d : defaults) {
            if (!origins.contains(d)) {
                origins.add(d);
            }
        }
        if (!origins.contains("*")) {
            origins.add("*");
        }
        configuration.setAllowedOriginPatterns(origins);
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setExposedHeaders(java.util.List.of("Authorization", "Content-Type", "Access-Control-Allow-Origin"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}