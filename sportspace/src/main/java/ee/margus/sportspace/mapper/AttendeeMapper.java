package ee.margus.sportspace.mapper;

import ee.margus.sportspace.dto.AttendeeDTO;
import ee.margus.sportspace.entity.Attendee;
import ee.margus.sportspace.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttendeeMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "fullName", source = "fullName")
    AttendeeDTO toDTO(Attendee attendees);

    List<AttendeeDTO> toDTO(List<Attendee> attendees);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instance", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Attendee toEntity(AttendeeDTO dto);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instance", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Attendee toEntity(User user);
}
