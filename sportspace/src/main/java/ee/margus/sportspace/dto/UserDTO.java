package ee.margus.sportspace.dto;

import ee.margus.sportspace.model.Role;

import java.util.Set;

public record UserDTO(Long id, String email, String firstname, String lastname, String phoneNumber, Set<Role> roles) {
}
