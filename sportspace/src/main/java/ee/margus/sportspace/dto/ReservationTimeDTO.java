package ee.margus.sportspace.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationTimeDTO(
    Long id,
    LocalDate date,
    @JsonFormat(pattern = "HH:mm")
    LocalTime startTime,
    @JsonFormat(pattern = "HH:mm")
    LocalTime endTime,
    DayOfWeek dayOfWeek) {
}
