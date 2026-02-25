package ee.margus.sportspace.repository;

import ee.margus.sportspace.entity.Reservation;
import ee.margus.sportspace.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByRoom_Facility_IdAndInstances_DateBetweenAndStatus(Long id, LocalDate dateStart, LocalDate dateEnd, ReservationStatus status);

    List<Reservation> findByStatusAndInstances_DateAndInstances_Times_StartTimeLessThanEqualAndInstances_Times_EndTimeGreaterThanEqualOrderByInstances_Times_StartTimeAsc(ReservationStatus status, LocalDate date, LocalTime startTime, LocalTime endTime);

    List<Reservation> findByUser_IdOrderByIdAsc(Long id);

    Optional<Reservation> findByUser_IdAndId(Long userId, Long id);

    Reservation findByInstances_Id(Long id);

    Reservation findByInstances_Times_Id(Long id);
}
