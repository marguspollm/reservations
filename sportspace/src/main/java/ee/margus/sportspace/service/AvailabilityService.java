package ee.margus.sportspace.service;

import ee.margus.sportspace.dto.RoomAvailabilityDTO;
import ee.margus.sportspace.entity.FacilitySchedule;
import ee.margus.sportspace.entity.ReservationTime;
import ee.margus.sportspace.exception.ConflictException;
import ee.margus.sportspace.exception.ValidationException;
import ee.margus.sportspace.model.ReservationStatus;
import ee.margus.sportspace.model.TimeSlot;
import ee.margus.sportspace.repository.FacilityScheduleRepository;
import ee.margus.sportspace.repository.ReservationTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityService {
    @Value("${slot-length}")
    private int SLOT_LENGTH_MINUTES;
    @Autowired
    private FacilityScheduleRepository facilityScheduleRepository;
    @Autowired
    private ReservationTimeRepository reservationTimeRepository;

    @Transactional(readOnly = true)
    public RoomAvailabilityDTO getAvailability(Long roomId, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();

        FacilitySchedule openHours = facilityScheduleRepository
            .findByFacility_Rooms_IdAndDayOfWeek(roomId, dayOfWeek)
            .orElseThrow(() -> new ValidationException("Room is closed on this day"));

        List<ReservationTime> reservationTimes = reservationTimeRepository
            .findByDateAndInstance_Reservation_Room_IdAndInstance_Reservation_StatusNot(date, roomId, ReservationStatus.CANCELLED);

        List<TimeSlot> availableTimes = generateTimes(openHours, reservationTimes);

        return new RoomAvailabilityDTO(
            roomId,
            date,
            openHours.getOpenTime(),
            openHours.getCloseTime(),
            availableTimes
        );
    }

    private List<TimeSlot> generateTimes(FacilitySchedule openHours, List<ReservationTime> reservationTimes) {
        List<TimeSlot> slots = new ArrayList<>();

        LocalTime openTime = openHours.getOpenTime();
        LocalTime closeTime = openHours.getCloseTime();

        int openMinutes = openTime.toSecondOfDay() / 60;
        int closeMinutes = closeTime.toSecondOfDay() / 60;

        if (openMinutes == closeMinutes) {
            closeMinutes = openMinutes + 24 * 60;
        } else if (closeMinutes < openMinutes) {
            closeMinutes += 24 * 60;
        }

        for (int start = openMinutes; start + SLOT_LENGTH_MINUTES <= closeMinutes; start += SLOT_LENGTH_MINUTES) {
            int end = start + SLOT_LENGTH_MINUTES;

            LocalTime slotStart = LocalTime.ofSecondOfDay((start * 60L) % (24 * 60 * 60));

            LocalTime slotEnd = LocalTime.ofSecondOfDay((end * 60L) % (24 * 60 * 60));

            if (isSlotFree(slotStart, slotEnd, reservationTimes)) {
                slots.add(new TimeSlot(slotStart, slotEnd));
            }
        }

        return slots;
    }

    private boolean isSlotFree(
        LocalTime slotStart,
        LocalTime slotEnd,
        List<ReservationTime> reservationTimes
    ) {
        for (ReservationTime r : reservationTimes) {
            boolean overlaps =
                slotStart.isBefore(r.getEndTime()) &&
                    slotEnd.isAfter(r.getStartTime());

            if (overlaps) {
                return false;
            }
        }
        return true;
    }

    @Transactional
    public void checkAvailability(
        Long roomId,
        LocalDate date,
        LocalTime start,
        LocalTime end
    ) {
        List<ReservationTime> conflicts = reservationTimeRepository.
            findByInstance_Reservation_Room_IdAndDateAndStartTimeAndEndTimeAndInstance_Reservation_StatusNot
                (roomId, date, start, end, ReservationStatus.CANCELLED);


        if (!conflicts.isEmpty()) {
            throw new ConflictException("Room already booked for this time");
        }
    }
}

