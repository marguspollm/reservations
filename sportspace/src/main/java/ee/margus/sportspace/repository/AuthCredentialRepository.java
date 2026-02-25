package ee.margus.sportspace.repository;

import ee.margus.sportspace.entity.AuthCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthCredentialRepository extends JpaRepository<AuthCredential, Long> {
    Optional<AuthCredential> findByEmail(String email);
}
