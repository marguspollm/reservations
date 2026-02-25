package ee.margus.sportspace.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import ee.margus.sportspace.model.TimeSlot;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record RoomAvailabilityDTO(
    Long roomId,
    LocalDate date,
    @JsonFormat(pattern = "HH:mm")
    LocalTime openTime,
    @JsonFormat(pattern = "HH:mm")
    LocalTime endTime,
    List<TimeSlot> availableSlots
) {
}
