package ee.margus.sportspace.controller;

import ee.margus.sportspace.dto.RoomAvailabilityDTO;
import ee.margus.sportspace.dto.RoomDTO;
import ee.margus.sportspace.service.AvailabilityService;
import ee.margus.sportspace.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class RoomController {
    @Autowired
    private RoomService roomService;
    @Autowired
    private AvailabilityService availabilityService;

    @DeleteMapping("rooms/{roomId}")
    public ResponseEntity<Void> delete(@PathVariable Long roomId) {
        roomService.delete(roomId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("facilities/{facilityId}/rooms")
    public ResponseEntity<List<RoomDTO>> getFacilityRooms(@PathVariable Long facilityId) {
        List<RoomDTO> rooms = roomService.getFacilityRooms(facilityId);
        return ResponseEntity.ok().body(rooms);

    }

    @GetMapping("rooms/{roomId}/availability")
    public ResponseEntity<RoomAvailabilityDTO> getAvailability(@PathVariable Long roomId, @RequestParam LocalDate date) {
        RoomAvailabilityDTO roomAvailabilityDTO = availabilityService.getAvailability(roomId, date);
        return ResponseEntity.ok().body(roomAvailabilityDTO);
    }


}
