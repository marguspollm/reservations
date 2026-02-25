package ee.margus.sportspace.repository;

import ee.margus.sportspace.entity.ReservationInstance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationInstanceRepository extends JpaRepository<ReservationInstance, Long> {

    ReservationInstance findByTimes_Id(Long id);
}
