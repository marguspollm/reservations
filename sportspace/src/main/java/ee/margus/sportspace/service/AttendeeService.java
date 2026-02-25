package ee.margus.sportspace.service;

import ee.margus.sportspace.dto.AttendeeDTO;
import ee.margus.sportspace.entity.Attendee;
import ee.margus.sportspace.entity.ReservationInstance;
import ee.margus.sportspace.entity.User;
import ee.margus.sportspace.exception.ConflictException;
import ee.margus.sportspace.exception.NotFoundException;
import ee.margus.sportspace.exception.ValidationException;
import ee.margus.sportspace.mapper.AttendeeMapper;
import ee.margus.sportspace.repository.AttendeeRepository;
import ee.margus.sportspace.repository.ReservationInstanceRepository;
import ee.margus.sportspace.repository.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AttendeeService {
    @Autowired
    private AttendeeMapper attendeeMapper;
    @Autowired
    private ReservationInstanceRepository instanceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AttendeeRepository attendeeRepository;

    @Transactional
    public AttendeeDTO addAttendee(Long id, AttendeeDTO dto) {
        validateDto(dto);
        ReservationInstance instance = getInstance(id);

        boolean exists = instance.getAttendees()
                .stream()
                .anyMatch(a -> a.getUser() != null && a.getUser().getId().equals(dto.userId()));

        if (exists)
            throw new ConflictException("Attendee already exists on instance");

        Attendee attendee;

        if (dto.userId() != null) {
            attendee = createAttendeeFromUser(dto);
        } else {
            attendee = createAttendeeFromDto(dto);
        }

        attendee.setInstance(instance);
        instance.getAttendees().add(attendee);

        attendeeRepository.save(attendee);

        return attendeeMapper.toDTO(attendee);
    }

    @Transactional(readOnly = true)
    public List<AttendeeDTO> getAttendees(Long id) {
        ReservationInstance instance = getInstance(id);

        return attendeeMapper.toDTO(instance.getAttendees());
    }

    @Transactional
    public void removeAttendee(Long id, Long attendeeId) {
        ReservationInstance instance = getInstance(id);

        boolean removed = instance.getAttendees()
                .removeIf(a -> a.getId().equals(attendeeId));

        if (!removed)
            throw new NotFoundException("Attendee doesn't exist");
    }

    private void validateDto(AttendeeDTO dto) {
        if (dto.userId() == null) {
            if (dto.fullName() == null || dto.fullName().isBlank())
                throw new ValidationException("Attendee needs at least a name!");
        }
    }

    private @NonNull ReservationInstance getInstance(Long id) {
        return instanceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation instance doesn't exist"));
    }

    private @NonNull Attendee createAttendeeFromDto(AttendeeDTO dto) {
        Attendee attendee;
        attendee = attendeeMapper.toEntity(dto);
        attendee.setEmail(dto.email());
        attendee.setFullName(dto.fullName());
        return attendee;
    }

    private @NonNull Attendee createAttendeeFromUser(AttendeeDTO dto) {
        Attendee attendee;
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new NotFoundException("User doesn't exist"));

        attendee = attendeeMapper.toEntity(user);
        attendee.setUser(user);
        return attendee;
    }
}
