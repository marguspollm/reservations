package ee.margus.sportspace.dto;

import java.util.List;

public record FacilityUpdateDTO(Long id, String name, String address, boolean active, List<RoomDTO> rooms,
                                List<FacilityScheduleDTO> schedules) {
}
