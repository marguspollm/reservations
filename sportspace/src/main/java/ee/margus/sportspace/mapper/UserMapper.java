package ee.margus.sportspace.mapper;

import ee.margus.sportspace.dto.SignupDTO;
import ee.margus.sportspace.dto.UserDTO;
import ee.margus.sportspace.dto.UserUpdateDTO;
import ee.margus.sportspace.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(User user);

    List<UserDTO> toDTO(List<User> users);

    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "authCredentials", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntityFromSignup(SignupDTO dto);

    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "authCredentials", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateUserFromDto(UserUpdateDTO dto, @MappingTarget User user);
}
