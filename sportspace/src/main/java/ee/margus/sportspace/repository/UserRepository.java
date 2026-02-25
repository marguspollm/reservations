package ee.margus.sportspace.repository;

import ee.margus.sportspace.entity.User;
import ee.margus.sportspace.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
      List<User> findByRolesIn(Collection<Role> roles);
}
