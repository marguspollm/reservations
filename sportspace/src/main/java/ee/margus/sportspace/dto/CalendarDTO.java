package ee.margus.sportspace.dto;

import java.util.List;

public record CalendarDTO(
    Long id,
    String title,
    Long roomId,
    String roomName,
    Long facilityId,
    String facilityName,
    Long price,
    List<ReservationInstanceDTO> instances
) {
}
