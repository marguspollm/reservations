package ee.margus.sportspace.service.reservation;

import ee.margus.sportspace.dto.*;
import ee.margus.sportspace.entity.*;
import ee.margus.sportspace.event.ReservationCreatedEvent;
import ee.margus.sportspace.event.ReservationStatusUpdatedEvent;
import ee.margus.sportspace.exception.NotFoundException;
import ee.margus.sportspace.mapper.ReservationInstanceMapper;
import ee.margus.sportspace.mapper.ReservationMapper;
import ee.margus.sportspace.model.ReservationStatus;
import ee.margus.sportspace.repository.*;
import ee.margus.sportspace.utils.SecurityUtils;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private ReservationTimeRepository reservationTimeRepository;
    @Autowired
    private ReservationInstanceRepository instanceRepository;
    @Autowired
    private ReservationMapper reservationMapper;
    @Autowired
    private ReservationValidationService validationService;
    @Autowired
    private ReservationCreator reservationCreator;
    @Autowired
    private ApplicationEventPublisher publisher;
    @Autowired
    private ReservationInstanceMapper instanceMapper;

    @Transactional
    public ReservationDTO create(ReservationRequestDTO dto) {

        validationService.validate(dto);

        Reservation reservation = setReservation(dto);
        reservation.setType(dto.type());
        
        switch (dto.type()) {
            case SINGLE_DAY -> reservationCreator.createSingleDay(reservation,dto);
            case WEEKLY -> reservationCreator.createWeekly(reservation, dto);
            case MULTI_DAY -> reservationCreator.createMultiDay(reservation, dto);
        }

        repository.save(reservation);

        publisher.publishEvent(
            new ReservationCreatedEvent(reservation.getId())
        );

        return reservationMapper.toDTO((reservation));
    }

    @Transactional
    public ReservationDTO cancel(Long id) {
        Reservation dbReservation = getReservation(id);
        dbReservation.setStatus(ReservationStatus.CANCELLED);
        return reservationMapper.toDTO(dbReservation);
    }

    @Transactional
    public ReservationDTO changeStatus(Long id, ReservationStatusUpdateDTO dto) {
        Reservation dbReservation = getReservation(id);
        if(!dto.status().equals(dbReservation.getStatus())){
            reservationMapper.updateStatusFromDto(dto, dbReservation);
            publisher.publishEvent(
                new ReservationStatusUpdatedEvent(dbReservation.getId())
            );
        }


        return reservationMapper.toDTO(dbReservation);
    }

    @Transactional
    public ReservationDTO update(Long id, ReservationUpdateDTO dto) {
        Reservation dbReservation = getReservation(id);
        reservationMapper.updateReservationFromDto(dto, dbReservation);

        return reservationMapper.toDTO(dbReservation);
    }

    @Transactional
    public ReservationDTO deleteSingleReservationTime(Long id) {
        Reservation dbReservation = repository.findByInstances_Times_Id(id);

        dbReservation.getInstances()
            .forEach(inst ->
                inst.getTimes()
                    .removeIf(time ->
                        time.getId().equals(id)
                    )
            );

        dbReservation.getInstances()
            .removeIf(inst ->
                inst.getTimes().isEmpty()
            );

        return reservationMapper.toDTO(dbReservation);
    }

    @Transactional
    public ReservationDTO deleteReservationInstance(Long instanceId) {
        Reservation dbReservation = repository.findByInstances_Id(instanceId);

        dbReservation.getInstances()
            .removeIf(inst ->
                inst.getId().equals(instanceId)
            );
        return reservationMapper.toDTO(dbReservation);
    }

    private @NonNull Reservation getReservation(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new NotFoundException("Reservation doesn't exist"));
    }

    private @NonNull Reservation setReservation(ReservationRequestDTO dto){
        Long userId = SecurityUtils.getAuthenticatedUserId();

        Reservation reservation = reservationMapper.toEntity(dto);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException(("User not found")));

        Room room = roomRepository.findById(dto.roomId())
            .orElseThrow(() -> new NotFoundException("Room not found"));

        reservation.setUser(user);
        reservation.setRoom(room);

        return reservation;
    }
}