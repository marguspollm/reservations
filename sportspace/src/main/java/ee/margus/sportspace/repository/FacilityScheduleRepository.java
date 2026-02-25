package ee.margus.sportspace.repository;

import ee.margus.sportspace.entity.FacilitySchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface FacilityScheduleRepository extends JpaRepository<FacilitySchedule, Long> {
    List<FacilitySchedule> findByFacility_IdOrderByDayOfWeekAscOpenTimeAsc(Long id);

    Optional<FacilitySchedule> findByFacility_Rooms_IdAndDayOfWeek(Long id, DayOfWeek dayOfWeek);

}
