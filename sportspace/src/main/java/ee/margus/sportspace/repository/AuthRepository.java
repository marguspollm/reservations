package ee.margus.sportspace.repository;

import ee.margus.sportspace.entity.AuthCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<AuthCredential, Long> {

    Optional<AuthCredential> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
