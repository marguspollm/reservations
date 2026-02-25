package ee.margus.sportspace.repository;

import ee.margus.sportspace.entity.ReservationTime;
import ee.margus.sportspace.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationTimeRepository extends JpaRepository<ReservationTime, Long> {

    List<ReservationTime> findByDateAndInstance_Reservation_Room_IdAndInstance_Reservation_StatusNot(LocalDate date, Long id, ReservationStatus status);

    List<ReservationTime> findByInstance_Reservation_Room_IdAndDateAndStartTimeAndEndTimeAndInstance_Reservation_StatusNot(Long id, LocalDate date, LocalTime startTime, LocalTime endTime,ReservationStatus status);
}
