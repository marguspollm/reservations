package ee.margus.sportspace.dto;

import ee.margus.sportspace.model.ReservationStatus;
import ee.margus.sportspace.model.ReservationType;

import java.util.List;

public record ReservationDTO(
    Long id,
    String title,
    Long userId,
    Long roomId,
    ReservationStatus status,
    ReservationType type,
    List<ReservationInstanceDTO> instances
) {
}