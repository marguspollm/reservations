package ee.margus.sportspace.mapper;

import ee.margus.sportspace.dto.RoomDTO;
import ee.margus.sportspace.dto.RoomUpdateDTO;
import ee.margus.sportspace.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(target = "price", source = "pricePerHour")
    RoomDTO toDTO(Room room);

    List<RoomDTO> toDTO(List<Room> rooms);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pricePerHour", source = "price")
    @Mapping(target = "facility", ignore = true)
    Room toEntity(RoomDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "facility", ignore = true)
    @Mapping(target = "pricePerHour", source = "price")
    void updateRoomFromDto(RoomUpdateDTO dto, @MappingTarget Room room);

    @Mapping(target = "pricePerHour", source = "price")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "facility", ignore = true)
    void updateRoomFromDto(RoomDTO dto, @MappingTarget Room room);
}
