package ee.margus.sportspace.service.reservation;

import ee.margus.sportspace.dto.ReservationRequestDTO;
import ee.margus.sportspace.dto.ReservationTimeDTO;
import ee.margus.sportspace.entity.FacilitySchedule;
import ee.margus.sportspace.entity.Reservation;
import ee.margus.sportspace.entity.ReservationInstance;
import ee.margus.sportspace.entity.ReservationTime;
import ee.margus.sportspace.exception.ConflictException;
import ee.margus.sportspace.mapper.ReservationTimeMapper;
import ee.margus.sportspace.repository.FacilityScheduleRepository;
import ee.margus.sportspace.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReservationCreator {
    @Value("${slot-length}")
    private int SLOT_LENGTH_MINUTES;
    @Autowired
    private ReservationTimeMapper reservationTimeMapper;
    @Autowired
    private FacilityScheduleRepository facilityScheduleRepository;
    @Autowired
    private ReservationValidationService validationService;
    @Autowired
    private AvailabilityService availabilityService;

    @Transactional
    public void createSingleDay(Reservation reservation, ReservationRequestDTO dto) {

        List<ReservationTimeDTO> sortedTimes = validationService.getContiguousTimes(dto.reservationTimes());

        ReservationInstance reservationInstance = new ReservationInstance();
        reservationInstance.setDate(dto.startDate());
        reservationInstance.setReservation(reservation);

        for (ReservationTimeDTO time : sortedTimes) {
            availabilityService.checkAvailability(
                dto.roomId(),
                time.date(),
                time.startTime(),
                time.endTime()
            );
            ReservationTime rt = reservationTimeMapper.toEntity(time);
            rt.setInstance(reservationInstance);
            rt.setDate(dto.startDate());
            rt.setDayOfWeek(dto.startDate().getDayOfWeek());

            reservationInstance.getTimes().add(rt);
        }

        reservation.getInstances().add(reservationInstance);
    }

    @Transactional
    public void createWeekly(Reservation reservation, ReservationRequestDTO dto) {
        List<ReservationTimeDTO> sortedTimes = validationService.getContiguousTimes(dto.reservationTimes());

        LocalDate date = dto.startDate();

        while (date.getDayOfWeek() != dto.dayOfWeek()) {
            date = date.plusDays(1);
        }

        while (!date.isAfter(dto.endDate())) {
            ReservationInstance reservationInstance = new ReservationInstance();
            reservationInstance.setDate(date);
            reservationInstance.setReservation(reservation);

            for (ReservationTimeDTO time : sortedTimes) {
                availabilityService.checkAvailability(
                    dto.roomId(),
                    date,
                    time.startTime(),
                    time.endTime()
                );
                ReservationTime rt = reservationTimeMapper.toEntity(time);
                rt.setInstance(reservationInstance);
                rt.setDate(date);

                reservationInstance.getTimes().add(rt);
            }

            reservation.getInstances().add(reservationInstance);

            date = date.plusWeeks(1);
        }
    }

    @Transactional
    public void createMultiDay(Reservation reservation, ReservationRequestDTO dto) {

        LocalDate date = dto.startDate();

        while (!date.isAfter(dto.endDate())) {

            FacilitySchedule fs = facilityScheduleRepository.findByFacility_Rooms_IdAndDayOfWeek(dto.roomId(), date.getDayOfWeek())
                .orElseThrow(() -> new ConflictException("Facility is closed "));

            LocalTime start = fs.getOpenTime();

            ReservationInstance reservationInstance = new ReservationInstance();
            reservationInstance.setDate(date);
            reservationInstance.setReservation(reservation);

            while (start.isBefore(fs.getCloseTime())) {
                LocalTime end = start.plusMinutes(SLOT_LENGTH_MINUTES);

                availabilityService.checkAvailability(dto.roomId(), date, start, end);

                ReservationTime rt = new ReservationTime();
                rt.setDate(date);
                rt.setDayOfWeek(date.getDayOfWeek());
                rt.setStartTime(start);
                rt.setEndTime(end);
                rt.setInstance(reservationInstance);

                reservationInstance.getTimes().add(rt);

                start = end;
            }

            reservation.getInstances().add((reservationInstance));

            date = date.plusDays(1);
        }
    }
}
