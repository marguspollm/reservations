package ee.margus.sportspace.dto;

import ee.margus.sportspace.model.ReservationStatus;

import java.util.List;

public record ReservationUpdateDTO(Long id,
                                   String title,
                                   List<ReservationInstanceDTO> instances,
                                   ReservationStatus status
) {
}
