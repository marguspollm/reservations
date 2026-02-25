package ee.margus.sportspace.dto;

import java.util.List;

public record FacilityDTO(Long id, String name, String address, List<RoomDTO> rooms, Boolean active,
                          List<FacilityScheduleDTO> schedules) {
}
