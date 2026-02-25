package ee.margus.sportspace.service.reservation;

import ee.margus.sportspace.dto.ReservationRequestDTO;
import ee.margus.sportspace.dto.ReservationTimeDTO;
import ee.margus.sportspace.exception.ValidationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class ReservationValidationService {

    @Transactional(readOnly = true)
    public List<ReservationTimeDTO> getContiguousTimes(List<ReservationTimeDTO> times) {
        List<ReservationTimeDTO> sortedTimes = times.stream()
            .sorted(Comparator.comparing(ReservationTimeDTO::startTime))
            .toList();

        for (int i = 1; i < sortedTimes.size(); i++) {
            if (!sortedTimes.get(i - 1).endTime().equals(sortedTimes.get(i).startTime())) {
                throw new ValidationException("Time slots must be contiguous");
            }
        }

        return sortedTimes;
    }

    public void validate(ReservationRequestDTO dto) {
        if (dto.type() == null)
            throw new ValidationException("Reservation needs a type!");

        switch (dto.type()) {
            case SINGLE_DAY -> validateSingleDay(dto);
            case MULTI_DAY -> validateMultiDay(dto);
            case WEEKLY -> validateWeekly(dto);
        }
    }


    private void validateWeekly(ReservationRequestDTO dto) {
        if (dto.dayOfWeek() == null ||
            dto.reservationTimes() == null || dto.reservationTimes().isEmpty()) {
            throw new ValidationException("Weekly reservation requires dayOfWeek and time");
        }
        if (dto.startDate().isAfter(dto.endDate())) {
            throw new ValidationException("Weekly invalid date range");
        }
    }

    private void validateMultiDay(ReservationRequestDTO dto) {
        if (dto.startDate() == null || dto.endDate() == null) {
            throw new ValidationException("Multi-day reservation requires date range");
        }
        if (dto.reservationTimes() != null && !dto.reservationTimes().isEmpty()/*TODO*/) {
            throw new ValidationException("Multi-day reservation cannot have time");
        }
    }

    private void validateSingleDay(ReservationRequestDTO dto) {
        if (dto.startDate() == null ||
            dto.reservationTimes() == null ||
            dto.reservationTimes().isEmpty()) {
            throw new ValidationException("Single-day reservation requires date and time");
        }
        if (!dto.startDate().equals(dto.endDate())) {
            throw new ValidationException("Single-day reservation must start and end on same date");
        }
    }
}
