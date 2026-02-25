package ee.margus.sportspace.controller;

import ee.margus.sportspace.dto.AttendeeDTO;
import ee.margus.sportspace.service.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AttendeeController {
    @Autowired
    private AttendeeService attendeeService;

    @GetMapping("reservations/{id}/attendees")
    public ResponseEntity<List<AttendeeDTO>> getAttendees(@PathVariable Long id) {
        List<AttendeeDTO> attendees = attendeeService.getAttendees(id);
        return ResponseEntity.ok().body(attendees);
    }

    @PostMapping("reservations/{id}/attendees")
    public ResponseEntity<AttendeeDTO> addAttendee(@PathVariable Long id, @RequestBody AttendeeDTO dto) {
        AttendeeDTO updatedReservation = attendeeService.addAttendee(id, dto);
        return ResponseEntity.ok().body(updatedReservation);
    }

    @DeleteMapping("reservations/{id}/attendees/{attendeeId}")
    public ResponseEntity<List<AttendeeDTO>> removeAttendee(@PathVariable Long id, @PathVariable Long attendeeId) {
        attendeeService.removeAttendee(id, attendeeId);
        List<AttendeeDTO> response = attendeeService.getAttendees(id);
        return ResponseEntity.ok().body(response);
    }
}
