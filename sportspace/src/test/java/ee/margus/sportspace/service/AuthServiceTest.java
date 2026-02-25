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
import ee.margus.sportspace.model.UserClaims;
import ee.margus.sportspace.repository.AuthRepository;
import ee.margus.sportspace.security.JWTService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserMapper userMapper;
    @Mock
    private BCryptPasswordEncoder passwordEncoder;
    @Mock
    private AuthRepository authRepository;
    @Mock
    private JWTService jwtService;
    @Mock
    private UserService userService;

    @Test
    void givenValidCredentials_whenLogin_thenLoginSuccessful() {
        LoginDTO dto = new LoginDTO("test@mail.com", "password");

        User user = new User();
        user.setId(1L);

        AuthCredential credential = new AuthCredential();
        credential.setPasswordHash("hashed");
        credential.setUser(user);

        UserClaims claims = new UserClaims(1L, "mail@test.com", Set.of());
        AuthToken token = new AuthToken("jwt-token", 12334L);

        when(authRepository.findByEmailIgnoreCase("test@mail.com"))
            .thenReturn(Optional.of(credential));
        when(passwordEncoder.matches("password", "hashed"))
            .thenReturn(true);
        when(userService.getClaims(1L)).thenReturn(claims);
        when(jwtService.getToken(claims)).thenReturn(token);

        AuthToken result = authService.login(dto);

        assertNotNull(result);
        assertEquals("jwt-token", result.token());
    }

    @Test
    void givenInvalidEmail_whenLogin_thenThrowException() {
        LoginDTO dto = new LoginDTO(null, "pass");

        assertThrows(BadCredentialsException.class,
            () -> authService.login(dto));
    }

    @Test
    void givenInvalidPassword_whenLogin_thenThrowException() {
        LoginDTO dto = new LoginDTO("mail@test.com", null);

        assertThrows(BadCredentialsException.class,
            () -> authService.login(dto));
    }

    @Test
    void givenNotExistingUser_whenLogin_thenThrowException() {
        LoginDTO dto = new LoginDTO("mail@test.com", "pass");

        when(authRepository.findByEmailIgnoreCase("mail@test.com"))
            .thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class,
            () -> authService.login(dto));
    }

    @Test
    void givenWrongPassword_whenLogin_thenThrowException() {
        LoginDTO dto = new LoginDTO("mail@test.com", "wrong");

        User user = new User();
        user.setId(1L);

        AuthCredential credential = new AuthCredential();
        credential.setPasswordHash("hashed");
        credential.setUser(user);

        when(authRepository.findByEmailIgnoreCase("mail@test.com"))
            .thenReturn(Optional.of(credential));
        when(passwordEncoder.matches("wrong", "hashed"))
            .thenReturn(false);

        assertThrows(BadCredentialsException.class,
            () -> authService.login(dto));
    }

    @Test
    void givenValidCredentials_whenSignup_thenSignupSuccessful() {
        SignupDTO dto = new SignupDTO("mail@test.com", "John", "Doe", "password", "12345678");

        User mappedUser = new User();
        mappedUser.setId(1L);

        when(userMapper.toEntityFromSignup(dto)).thenReturn(mappedUser);
        when(passwordEncoder.encode("password")).thenReturn("hashed");
        when(userMapper.toDTO(any(User.class)))
            .thenReturn(new UserDTO(1L, "mail@test.com", "John", "Doe", "12345678", Set.of()));

        UserDTO result = authService.signup(dto);

        assertNotNull(result);
        assertEquals(1L, result.id());
        verify(passwordEncoder).encode("password");
    }

    @Test
    void givenPasswordIsNull_whenSignup_thenThrowException() {
        SignupDTO dto = new SignupDTO("mail@test.com", "John", "Doe", null, null);

        assertThrows(ValidationException.class,
            () -> authService.signup(dto));
    }

    @Test
    void givenEmailIsNull_whenSignup_thenThrowException() {
        SignupDTO dto = new SignupDTO(null, "John", "Doe", "password", null);

        assertThrows(ValidationException.class,
            () -> authService.signup(dto));
    }

    @Test
    void givenInvalidEmail_whenSignup_thenThrowException() {
        SignupDTO dto = new SignupDTO("invalid-email", "John", "Doe", "password", null);

        assertThrows(ValidationException.class,
            () -> authService.signup(dto));
    }

    @Test
    void givenEmailExists_whenSignup_thenThrowException() {
        SignupDTO dto = new SignupDTO("mail@test.com", "John", "Doe", "password", null);

        when(authRepository.existsByEmailIgnoreCase("mail@test.com"))
            .thenReturn(true);

        assertThrows(ConflictException.class,
            () -> authService.signup(dto));
    }
}
