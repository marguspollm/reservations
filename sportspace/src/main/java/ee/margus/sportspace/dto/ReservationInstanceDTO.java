package ee.margus.sportspace.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record ReservationInstanceDTO(
    Long id,
    LocalDate date,
    Long reservationId,
    List<ReservationTimeDTO> times,
    @JsonFormat(pattern = "HH:mm")
    LocalTime earliestStart,
    @JsonFormat(pattern = "HH:mm")
    LocalTime latestEnd
) {
}
