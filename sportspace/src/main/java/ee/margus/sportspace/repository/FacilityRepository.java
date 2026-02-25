package ee.margus.sportspace.repository;

import ee.margus.sportspace.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {

    List<Facility> findByActiveTrueOrderByIdAsc();
}
