package ee.margus.sportspace.mapper;

import ee.margus.sportspace.dto.ReservationTimeDTO;
import ee.margus.sportspace.entity.ReservationTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservationTimeMapper {

    ReservationTimeDTO toDTO(ReservationTime time);

    List<ReservationTimeDTO> toDTO(List<ReservationTime> times);

    @Mapping(target = "instance", ignore = true)
    ReservationTime toEntity(ReservationTimeDTO dto);
}
