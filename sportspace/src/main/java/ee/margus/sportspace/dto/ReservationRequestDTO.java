package ee.margus.sportspace.dto;

import ee.margus.sportspace.model.ReservationType;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

public record ReservationRequestDTO(
    String title,
    LocalDate startDate,
    LocalDate endDate,
    DayOfWeek dayOfWeek,
    Long roomId,
    ReservationType type,
    List<ReservationTimeDTO> reservationTimes
) {
}
