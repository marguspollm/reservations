package ee.margus.sportspace.service.reservation;

import ee.margus.sportspace.dto.CalendarDTO;
import ee.margus.sportspace.dto.ReservationDTO;
import ee.margus.sportspace.entity.Reservation;
import ee.margus.sportspace.exception.NotFoundException;
import ee.margus.sportspace.mapper.ReservationMapper;
import ee.margus.sportspace.model.ReservationStatus;
import ee.margus.sportspace.model.Role;
import ee.margus.sportspace.repository.ReservationRepository;
import ee.margus.sportspace.repository.UserRepository;
import ee.margus.sportspace.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ReservationQueryService {
    @Autowired
    private ReservationRepository repository;
    @Autowired
    private ReservationMapper mapper;
    @Autowired
    private UserRepository userRepository;

    public List<ReservationDTO> getAll() {
        List<Reservation> reservations = repository.findAll();
        reservations.sort(Comparator.comparing(Reservation::getStatus));
        return mapper.toDTO(reservations);
    }

    @Transactional(readOnly = true)
    public ReservationDTO get(Long id) {
        if (SecurityUtils.hasRole(Role.ADMIN, Role.SUPERADMIN))
            return mapper.toDTO(
                repository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Reservation doesn't exist!"))
            );

        return mapper.toDTO(
            repository.findByUser_IdAndId(SecurityUtils.getAuthenticatedUserId(), id)
                .orElseThrow(() -> new NotFoundException("Reservation doesn't belong to the user!"))
        );
    }

    @Transactional(readOnly = true)
    public List<ReservationDTO> getActive() {
        List<Reservation> active = repository.findByStatusAndInstances_DateAndInstances_Times_StartTimeLessThanEqualAndInstances_Times_EndTimeGreaterThanEqualOrderByInstances_Times_StartTimeAsc
            (ReservationStatus.CONFIRMED, LocalDate.now(), LocalTime.now(), LocalTime.now());
        return mapper.toDTO(active);
    }

    @Transactional(readOnly = true)
    public List<CalendarDTO> getReservationsForCalendar(LocalDate startDate, LocalDate endDate, Long facilityId) {
        List<Reservation> reservations = repository
            .findByRoom_Facility_IdAndInstances_DateBetweenAndStatus(
                facilityId, startDate, endDate, ReservationStatus.CONFIRMED
            );

        return mapper.toCalendarReservation(reservations);
    }

    @Transactional(readOnly = true)
    public List<ReservationDTO> getMyReservations() {
        Long userId = SecurityUtils.getAuthenticatedUserId();
        if (!userRepository.existsById(userId)) throw new NotFoundException("User doesn't exist");

        List<Reservation> userReservations = repository.findByUser_IdOrderByIdAsc(userId);
        userReservations.sort(Comparator.comparing(Reservation::getStatus));
        return mapper.toDTO(userReservations);
    }
}
