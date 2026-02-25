package ee.margus.sportspace.controller;

import ee.margus.sportspace.dto.*;
import ee.margus.sportspace.service.reservation.ReservationQueryService;
import ee.margus.sportspace.service.reservation.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class ReservationController {
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private ReservationQueryService reservationQueryService;

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDTO>> getAll() {
        List<ReservationDTO> reservations = reservationQueryService.getAll();
        return ResponseEntity.ok().body(reservations);
    }

    @GetMapping("reservations/{id}")
    public ResponseEntity<ReservationDTO> get(@PathVariable Long id) {
        ReservationDTO reservation = reservationQueryService.get(id);
        return ResponseEntity.ok().body(reservation);
    }

    @PostMapping("create-reservations")
    public ResponseEntity<ReservationDTO> create(@RequestBody ReservationRequestDTO dto) {
        ReservationDTO reservation = reservationService.create(dto);
        return ResponseEntity.ok().body(reservation);
    }

    @DeleteMapping("reservations/{id}")
    public ResponseEntity<ReservationDTO> cancel(@PathVariable Long id) {
        ReservationDTO result = reservationService.cancel(id);
        return ResponseEntity.ok().body(result);
    }

    @PatchMapping("reservations/{id}")
    public ResponseEntity<ReservationDTO> changeStatus(
            @PathVariable Long id,
            @RequestBody ReservationStatusUpdateDTO dto) {
        ReservationDTO reservation = reservationService.changeStatus(id, dto);
        return ResponseEntity.ok().body(reservation);
    }

    @PutMapping("reservations/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(@PathVariable Long id, @RequestBody ReservationUpdateDTO dto) {
        ReservationDTO updated = reservationService.update(id, dto);
        return ResponseEntity.ok().body(updated);
    }

    @DeleteMapping("reservation-times/time/{timeId}")
    public ResponseEntity<ReservationDTO> deleteSingleReservationTime(@PathVariable Long timeId) {
        ReservationDTO updated = reservationService.deleteSingleReservationTime(timeId);
        return ResponseEntity.ok().body(updated);
    }

    @DeleteMapping("reservation-times/instance/{instanceId}")
    public ResponseEntity<ReservationDTO> deleteReservationInstance(@PathVariable Long instanceId) {
        ReservationDTO updated = reservationService.deleteReservationInstance(instanceId);
        return ResponseEntity.ok().body(updated);
    }

    @GetMapping("calendar")
    public ResponseEntity<List<CalendarDTO>> getSelectedDay(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam Long facilityId) {
        List<CalendarDTO> calendar = reservationQueryService.getReservationsForCalendar(startDate, endDate, facilityId);
        return ResponseEntity.ok().body(calendar);
    }

    @GetMapping("/active-reservations")
    public ResponseEntity<List<ReservationDTO>> getActiveReservations() {
        List<ReservationDTO> result = reservationQueryService.getActive();
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationDTO>> getMyReservations() {
        List<ReservationDTO> reservations = reservationQueryService.getMyReservations();
        return ResponseEntity.ok().body(reservations);
    }
}
