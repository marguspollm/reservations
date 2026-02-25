package ee.margus.sportspace.mapper;

import ee.margus.sportspace.dto.FacilityDTO;
import ee.margus.sportspace.dto.FacilityUpdateDTO;
import ee.margus.sportspace.entity.Facility;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {RoomMapper.class, FacilityScheduleMapper.class})
public interface FacilityMapper {
    FacilityDTO toDTO(Facility facility);

    List<FacilityDTO> toDTO(List<Facility> facilities);

    Facility toEntity(FacilityDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rooms", ignore = true)
    @Mapping(target = "schedules", ignore = true)
    void updateFacilityFromDto(FacilityUpdateDTO dto, @MappingTarget Facility facility);
}
