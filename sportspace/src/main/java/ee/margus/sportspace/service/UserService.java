package ee.margus.sportspace.service;

import ee.margus.sportspace.dto.UserDTO;
import ee.margus.sportspace.dto.UserUpdateDTO;
import ee.margus.sportspace.entity.User;
import ee.margus.sportspace.exception.ConflictException;
import ee.margus.sportspace.exception.NotFoundException;
import ee.margus.sportspace.exception.ValidationException;
import ee.margus.sportspace.mapper.UserMapper;
import ee.margus.sportspace.model.Role;
import ee.margus.sportspace.model.UserClaims;
import ee.margus.sportspace.repository.UserRepository;
import ee.margus.sportspace.utils.SecurityUtils;
import ee.margus.sportspace.utils.Validations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserRepository userRepository;

    public UserClaims getClaims(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return new UserClaims(
                user.getId(),
                user.getEmail(),
                user.getRoles()
                        .stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet()));
    }

    @Transactional
    public UserDTO update(Long id, UserUpdateDTO dto) {
        User dbUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User doesn't exist!"));

        validateUser(dto);

        userMapper.updateUserFromDto(dto, dbUser);

        return userMapper.toDTO(dbUser);
    }
    @Transactional(readOnly = true)
    public UserDTO getUser(Long id) {
        User dbUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User doesn't exist!"));
        return userMapper.toDTO(dbUser);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAll() {
        List<User> users = userRepository.findAll();
        return userMapper.toDTO(users);
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id))
            throw new NotFoundException("User doesn't exist");
        userRepository.deleteById(id);
    }

    @Transactional
    public void changeRole(Long userId) {
        Long authUserId = SecurityUtils.getAuthenticatedUserId();

        if (authUserId.equals(userId))
            throw new ConflictException("Cant change own role");

        User dbUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User doesn't exists"));
        Set<Role> userRoles = dbUser.getRoles();
        if (!userRoles.contains(Role.ADMIN)) {
            userRoles.add(Role.ADMIN);
        } else {
            userRoles.remove(Role.ADMIN);
        }
    }
    @Transactional(readOnly = true)
    public UserDTO getMe() {
        Long authUserId = SecurityUtils.getAuthenticatedUserId();

        User dbUser = userRepository.findById(authUserId)
                .orElseThrow(() -> new NotFoundException("User not found!"));

        return userMapper.toDTO(dbUser);
    }

    private static void validateUser(UserUpdateDTO dto) {
        if (Validations.validateEmail(dto.email()))
            throw new ValidationException("Email is not valid!");
        if (dto.firstname() == null || dto.firstname().isBlank())
            throw new ValidationException("Firstname is required");
    }

    @Transactional
    public UserDTO updateMe(UserUpdateDTO dto) {
        Long userId = SecurityUtils.getAuthenticatedUserId();
        return update(userId, dto);
    }
}
