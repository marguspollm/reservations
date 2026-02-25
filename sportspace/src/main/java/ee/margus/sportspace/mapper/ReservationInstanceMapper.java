package ee.margus.sportspace.mapper;

import ee.margus.sportspace.dto.ReservationInstanceDTO;
import ee.margus.sportspace.entity.ReservationInstance;
import ee.margus.sportspace.entity.ReservationTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalTime;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservationInstanceMapper {
    @Mapping(target = "reservation", ignore = true)
    @Mapping(target = "attendees", ignore = true)
    ReservationInstance toEntity(ReservationInstanceDTO dto);

    @Mapping(target = "latestEnd", source = "times", qualifiedByName = "latestEnd")
    @Mapping(target = "earliestStart", source = "times", qualifiedByName = "earliestStart")
    @Mapping(target = "reservationId", source = "reservation.id")
    ReservationInstanceDTO toDTO(ReservationInstance reservationInstance);

    @Named("earliestStart")
    default LocalTime getEarliestStart(List<ReservationTime> times) {
        if (times == null || times.isEmpty()) return null;

        return times.stream()
            .map(ReservationTime::getStartTime)
            .min(LocalTime::compareTo)
            .orElse(null);
    }

    @Named("latestEnd")
    default LocalTime getLatestEnd(List<ReservationTime> times) {
        if (times == null || times.isEmpty()) return null;

        return times.stream()
            .map(ReservationTime::getEndTime)
            .max(LocalTime::compareTo)
            .orElse(null);
    }
}
