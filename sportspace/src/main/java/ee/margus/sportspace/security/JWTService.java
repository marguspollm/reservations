package ee.margus.sportspace.security;

import ee.margus.sportspace.config.JwtProperties;
import ee.margus.sportspace.entity.User;
import ee.margus.sportspace.model.AuthToken;
import ee.margus.sportspace.model.UserClaims;
import ee.margus.sportspace.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class JWTService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProperties jwtProperties;

    @Autowired
    private SecretKey secretKey;

    public AuthToken getToken(UserClaims userClaims) {
        Date expirationTime = Date.from(Instant.now().plus(jwtProperties.expiration(), ChronoUnit.MINUTES));

        String token = Jwts.builder()
            .id(UUID.randomUUID().toString())
            .subject(userClaims.userId().toString())
            .claim("email", userClaims.email())
            .claim("roles", userClaims.roles())
            .issuedAt(Date.from(Instant.now()))
            .expiration(expirationTime)
            .signWith(secretKey)
            .compact();

        return new AuthToken(token, expirationTime.getTime());
    }

    public User validateToken(String token) {
        Claims claims = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
        Long userId = Long.parseLong(claims.getSubject());

        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User doesn't exist"));
    }
}
