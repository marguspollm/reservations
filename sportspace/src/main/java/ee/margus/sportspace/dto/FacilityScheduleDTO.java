package ee.margus.sportspace.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record FacilityScheduleDTO(Long id,
                                  DayOfWeek dayOfWeek,
                                  @JsonFormat(pattern = "HH:mm") LocalTime openTime,
                                  @JsonFormat(pattern = "HH:mm") LocalTime closeTime
) {
}
