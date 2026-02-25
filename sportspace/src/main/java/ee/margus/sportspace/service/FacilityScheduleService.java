package ee.margus.sportspace.service;

import ee.margus.sportspace.dto.FacilityScheduleDTO;
import ee.margus.sportspace.entity.Facility;
import ee.margus.sportspace.entity.FacilitySchedule;
import ee.margus.sportspace.exception.NotFoundException;
import ee.margus.sportspace.mapper.FacilityScheduleMapper;
import ee.margus.sportspace.repository.FacilityRepository;
import ee.margus.sportspace.repository.FacilityScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FacilityScheduleService {
    @Autowired
    private FacilityScheduleMapper mapper;
    @Autowired
    private FacilityScheduleRepository repository;
    @Autowired
    private FacilityRepository facilityRepository;

    @Transactional
    public void updateSchedule(Long facilityId, List<FacilityScheduleDTO> request) {
        Facility facility = facilityRepository.findById(facilityId)
            .orElseThrow(() -> new NotFoundException("Facility not found"));

        facility.getSchedules().clear();

        request.forEach(dto -> {
            FacilitySchedule fs = mapper.toEntity(dto, facility);
            facility.getSchedules().add(fs);
        });
    }

    @Transactional(readOnly = true)
    public List<FacilityScheduleDTO> getSchedule(Long id) {
        facilityRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Facility not found"));

        List<FacilitySchedule> dbSchedules = repository.findByFacility_IdOrderByDayOfWeekAscOpenTimeAsc(id);

        return mapper.toTDO(dbSchedules);
    }
}
