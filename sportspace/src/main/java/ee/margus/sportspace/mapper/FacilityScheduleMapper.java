package ee.margus.sportspace.mapper;

import ee.margus.sportspace.dto.FacilityScheduleDTO;
import ee.margus.sportspace.entity.Facility;
import ee.margus.sportspace.entity.FacilitySchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FacilityScheduleMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "facility", ignore = true)
    FacilitySchedule toEntity(FacilityScheduleDTO dto, Facility facility);

    List<FacilityScheduleDTO> toTDO(List<FacilitySchedule> facilitySchedules);


    @Mapping(target = "facility", ignore = true)
    void updateFacilityScheduleFromDto(FacilityScheduleDTO dto, @MappingTarget FacilitySchedule facilitySchedule);
}
