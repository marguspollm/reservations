package ee.margus.sportspace.config;

import ee.margus.sportspace.security.CustomUserDetailsService;
import ee.margus.sportspace.security.JWTFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {
    @Autowired
    private JWTFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) {
        httpSecurity
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/calendar").permitAll()
                .requestMatchers(HttpMethod.GET, "/facilities/active").permitAll()
                .requestMatchers(HttpMethod.GET, "/facilities/*/rooms").permitAll()
                .requestMatchers(HttpMethod.GET, "/facilities/*/schedule").permitAll()
                .requestMatchers(HttpMethod.GET, "/rooms/*/availability").permitAll()
                .requestMatchers(HttpMethod.POST, "/reservations/**").hasAnyRole("USER", "ADMIN", "SUPERADMIN")
                .requestMatchers(HttpMethod.GET, "/reservations/**").hasAnyRole("USER", "ADMIN", "SUPERADMIN")
                .requestMatchers(HttpMethod.PUT, "/reservations/**").hasAnyRole("USER", "ADMIN", "SUPERADMIN")
                .requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
                .requestMatchers("/active-reservations").hasAnyRole("ADMIN", "SUPERADMIN")
                .requestMatchers("/reservation-times/**").hasAnyRole("ADMIN", "SUPERADMIN")
                .requestMatchers("/reservations/**").hasAnyRole("ADMIN", "SUPERADMIN")
                .requestMatchers("/facilities/**").hasAnyRole("ADMIN", "SUPERADMIN")
                .requestMatchers("/users/**").hasRole("SUPERADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(frontendUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
