package ee.margus.sportspace.controller;

import ee.margus.sportspace.dto.FacilityDTO;
import ee.margus.sportspace.dto.FacilityUpdateDTO;
import ee.margus.sportspace.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FacilityController {
    @Autowired
    private FacilityService facilityService;

    @GetMapping("facilities")
    public ResponseEntity<List<FacilityDTO>> getAllFacilities() {
        List<FacilityDTO> facilities = facilityService.getAll();
        return ResponseEntity.ok().body(facilities);
    }

    @GetMapping("facilities/active")
    public ResponseEntity<List<FacilityDTO>> getAllActiveFacilities() {
        List<FacilityDTO> facilities = facilityService.getAllActive();
        return ResponseEntity.ok().body(facilities);
    }

    @GetMapping("facilities/{id}")
    public ResponseEntity<FacilityDTO> getFacility(@PathVariable Long id) {
        FacilityDTO facility = facilityService.get(id);
        return ResponseEntity.ok().body(facility);
    }

    @PostMapping("facilities")
    public ResponseEntity<FacilityDTO> create(@RequestBody FacilityDTO dto) {
        FacilityDTO facility = facilityService.create(dto);
        return ResponseEntity.ok().body(facility);
    }

    @PutMapping("facilities/{id}")
    public ResponseEntity<FacilityDTO> update(@PathVariable Long id, @RequestBody FacilityUpdateDTO dto) {
        FacilityDTO facility = facilityService.update(id, dto);
        return ResponseEntity.ok().body(facility);
    }

    @DeleteMapping("facilities/{id}")
    public ResponseEntity<List<FacilityDTO>> delete(@PathVariable Long id) {
        facilityService.delete(id);
        List<FacilityDTO> response = facilityService.getAll();
        return ResponseEntity.ok().body(response);
    }
}
