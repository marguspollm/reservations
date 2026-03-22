package ee.margus.sportspace.service;

import ee.margus.sportspace.dto.AttendeeDTO;
import ee.margus.sportspace.entity.Attendee;
import ee.margus.sportspace.entity.ReservationInstance;
import ee.margus.sportspace.entity.User;
import ee.margus.sportspace.exception.ConflictException;
import ee.margus.sportspace.exception.NotFoundException;
import ee.margus.sportspace.exception.ValidationException;
import ee.margus.sportspace.mapper.AttendeeMapper;
import ee.margus.sportspace.mapper.ReservationInstanceMapper;
import ee.margus.sportspace.repository.AttendeeRepository;
import ee.margus.sportspace.repository.ReservationInstanceRepository;
import ee.margus.sportspace.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AttendeeServiceTest {

    @InjectMocks
    private AttendeeService service;

    @Mock
    private AttendeeMapper attendeeMapper;
    @Mock
    private ReservationInstanceMapper reservationInstanceMapper;
    @Mock
    private ReservationInstanceRepository instanceRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AttendeeRepository attendeeRepository;

    private ReservationInstance instance;
    private User user;
    private Attendee attendee;

    @BeforeEach
    void setup() {
        instance = new ReservationInstance();
        instance.setId(1L);
        instance.setAttendees(new ArrayList<>());

        user = new User();
        user.setId(1L);

        attendee = new Attendee();
        attendee.setId(1L);
        attendee.setUser(user);
        attendee.setInstance(instance);
    }

    @Test
    void givenExistingUser_whenAddAttendee_thenAddSuccessful() {
        AttendeeDTO dto = new AttendeeDTO(null, null, null, 1L);

        when(instanceRepository.findById(1L)).thenReturn(Optional.of(instance));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(attendeeMapper.toEntity(user)).thenReturn(attendee);
        when(attendeeMapper.toDTO(attendee))
                .thenReturn(new AttendeeDTO(1L, null, null, 1L));

        AttendeeDTO result = service.addAttendee(1L, dto);

        assertNotNull(result);
        assertEquals(1, instance.getAttendees().size());
        verify(userRepository).findById(1L);
    }

    @Test
    void givenManualAttendee_whenAddAttendee_thenAddSuccessful() {
        AttendeeDTO dto = new AttendeeDTO(null, "john@mail.com", "John Doe", null);

        when(instanceRepository.findById(1L)).thenReturn(Optional.of(instance));
        when(attendeeMapper.toEntity(dto)).thenReturn(attendee);
        when(attendeeMapper.toDTO(attendee))
                .thenReturn(new AttendeeDTO(1L, "john@mail.com", "John Doe", null));

        AttendeeDTO result = service.addAttendee(1L, dto);

        assertNotNull(result);
        assertEquals(1, instance.getAttendees().size());
        assertEquals("John Doe", attendee.getFullName());
    }

    @Test
    void givenUserAlreadyExistsInList_whenAddAttendee_thenThrowException() {
        instance.getAttendees().add(attendee);

        AttendeeDTO dto = new AttendeeDTO(null, null, null, 1L);

        when(instanceRepository.findById(1L)).thenReturn(Optional.of(instance));

        assertThrows(ConflictException.class, () -> service.addAttendee(1L, dto));
    }

    @Test
    void givenNotExistingInstanceId_whenAddAttendee_thenThrowException() {
        AttendeeDTO dto = new AttendeeDTO(null, null, null, 1L);

        when(instanceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.addAttendee(1L, dto));
    }

    @Test
    void givenNotExistingUserId_whenAddAttendee_thenThrowException() {
        AttendeeDTO dto = new AttendeeDTO(null, null, null, 1L);

        when(instanceRepository.findById(1L)).thenReturn(Optional.of(instance));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.addAttendee(1L, dto));
    }

    @Test
    void givenNoFullName_whenAddAttendeeManually_thenThrowException() {
        AttendeeDTO dto = new AttendeeDTO(null, "mail@test.com", "", null);

        assertThrows(ValidationException.class, () -> service.addAttendee(1L, dto));
    }

    @Test
    void whenGetAllAttendees__ThenReturnAttendees() {
        instance.getAttendees().add(attendee);

        when(instanceRepository.findById(1L)).thenReturn(Optional.of(instance));
        when(attendeeMapper.toDTO(instance.getAttendees()))
                .thenReturn(List.of(new AttendeeDTO(1L, "mail@test.com", "John Doe", 1L)));

        List<AttendeeDTO> result = service.getAttendees(1L);

        assertEquals(1, result.size());
    }

    @Test
    void givenNotExistingInstanceId_whenGetAttendees_thenThrowException() {
        when(instanceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.getAttendees(1L));
    }

    @Test
    void whenRemoveAttendee_thenSuccess() {
        instance.getAttendees().add(attendee);

        when(instanceRepository.findById(1L)).thenReturn(Optional.of(instance));

        service.removeAttendee(1L, 1L);

        assertTrue(instance.getAttendees().isEmpty());
    }

    @Test
    void givenNotExistingAttendeeId_whenRemoveAttendee_thenThrowException() {
        when(instanceRepository.findById(1L)).thenReturn(Optional.of(instance));

        assertThrows(NotFoundException.class, () -> service.removeAttendee(1L, 2L));
    }

    @Test
    void givenNotExistingInstanceId_whenRemoveAttendee_thenThrowException() {
        when(instanceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.removeAttendee(1L, 2L));
    }
}
