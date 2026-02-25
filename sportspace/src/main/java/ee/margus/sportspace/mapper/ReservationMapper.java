package ee.margus.sportspace.mapper;

import ee.margus.sportspace.dto.*;
import ee.margus.sportspace.entity.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ReservationInstanceMapper.class})
public interface ReservationMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "instances", ignore = true)
    Reservation toEntity(ReservationDTO dto);

    @Mapping(target = "status", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "instances", ignore = true)
    Reservation toEntity(ReservationRequestDTO dto);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "roomId", source = "room.id")
    ReservationDTO toDTO(Reservation reservation);

    List<ReservationDTO> toDTO(List<Reservation> reservations);

    @Mapping(target = "price", source = "room.pricePerHour")
    @Mapping(target = "roomName", source = "room.name")
    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "facilityName", source = "room.facility.name")
    @Mapping(target = "facilityId", source = "room.facility.id")
    CalendarDTO toCalendarReservation(Reservation reservation);

    List<CalendarDTO> toCalendarReservation(List<Reservation> reservation);

    @Mapping(target = "title", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "instances", ignore = true)
    void updateStatusFromDto(ReservationStatusUpdateDTO dto, @MappingTarget Reservation reservation);

    @Mapping(target = "type", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "instances", ignore = true)
    void updateReservationFromDto(ReservationUpdateDTO dto, @MappingTarget Reservation reservation);
}
