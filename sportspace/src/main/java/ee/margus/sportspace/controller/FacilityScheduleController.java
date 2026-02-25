package ee.margus.sportspace.controller;

import ee.margus.sportspace.dto.FacilityScheduleDTO;
import ee.margus.sportspace.service.FacilityScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class FacilityScheduleController {
    @Autowired
    private FacilityScheduleService service;

    @GetMapping("facilities/{id}/schedule")
    public ResponseEntity<List<FacilityScheduleDTO>> getSchedules(@PathVariable Long id) {
        List<FacilityScheduleDTO> schedules = service.getSchedule(id);
        return ResponseEntity.ok().body(schedules);
    }

}
