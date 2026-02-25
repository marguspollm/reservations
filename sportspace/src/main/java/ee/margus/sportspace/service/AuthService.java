package ee.margus.sportspace.service;

import ee.margus.sportspace.dto.LoginDTO;
import ee.margus.sportspace.dto.SignupDTO;
import ee.margus.sportspace.dto.UserDTO;
import ee.margus.sportspace.entity.AuthCredential;
import ee.margus.sportspace.entity.User;
import ee.margus.sportspace.exception.ConflictException;
import ee.margus.sportspace.exception.ValidationException;
import ee.margus.sportspace.mapper.UserMapper;
import ee.margus.sportspace.model.AuthToken;
import ee.margus.sportspace.model.Role;
import ee.margus.sportspace.repository.AuthRepository;
import ee.margus.sportspace.repository.UserRepository;
import ee.margus.sportspace.security.JWTService;
import ee.margus.sportspace.utils.Validations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private AuthRepository authRepository;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public AuthToken login(LoginDTO loginDTO) {
        if (loginDTO.email() == null || loginDTO.password() == null) {
            throw new BadCredentialsException("Invalid credentials");
        }

        AuthCredential dbAuthCreds = authRepository.findByEmailIgnoreCase(loginDTO.email())
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(loginDTO.password(), dbAuthCreds.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        var claims = userService.getClaims(dbAuthCreds.getUser().getId());

        return jwtService.getToken(claims);
    }

    @Transactional
    public UserDTO signup(SignupDTO signupDTO) {
        validateSignup(signupDTO);

        User user = userMapper.toEntityFromSignup(signupDTO);

        AuthCredential authUser = new AuthCredential();
        authUser.setEmail(signupDTO.email());
        authUser.setPasswordHash(passwordEncoder.encode(signupDTO.password()));
        authUser.setUser(user);

        user.setAuthCredentials(authUser);
        user.getRoles().add(Role.USER);

        userRepository.save(user);

        return userMapper.toDTO(user);
    }

    private void validateSignup(SignupDTO dto) {
        if (dto.password() == null) {
            throw new ValidationException("Cannot signup without password!");
        }
        if (dto.email() == null) {
            throw new ValidationException("Cannot signup without email!");
        }
        if (Validations.validateEmail(dto.email())) {
            throw new ValidationException("Email is not valid!");
        }
        if (authRepository.existsByEmailIgnoreCase(dto.email())) {
            throw new ConflictException("Email already exists!");
        }
    }
}
