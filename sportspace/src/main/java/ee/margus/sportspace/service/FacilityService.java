package ee.margus.sportspace.service;

import ee.margus.sportspace.dto.FacilityDTO;
import ee.margus.sportspace.dto.FacilityScheduleDTO;
import ee.margus.sportspace.dto.FacilityUpdateDTO;
import ee.margus.sportspace.dto.RoomDTO;
import ee.margus.sportspace.entity.Facility;
import ee.margus.sportspace.entity.FacilitySchedule;
import ee.margus.sportspace.entity.Room;
import ee.margus.sportspace.exception.ConflictException;
import ee.margus.sportspace.exception.NotFoundException;
import ee.margus.sportspace.exception.ValidationException;
import ee.margus.sportspace.mapper.FacilityMapper;
import ee.margus.sportspace.mapper.FacilityScheduleMapper;
import ee.margus.sportspace.mapper.RoomMapper;
import ee.margus.sportspace.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class FacilityService {
    @Autowired
    private RoomMapper roomMapper;
    @Autowired
    private FacilityMapper facilityMapper;
    @Autowired
    private FacilityScheduleMapper facilityScheduleMapper;
    @Autowired
    private FacilityRepository facilityRepository;

    private static void validateFacility(Long id, FacilityUpdateDTO dto) {
        if (!Objects.equals(dto.id(), id)) throw new ConflictException("Mismatching ids");
        if (dto.name() == null || dto.name().isBlank()) throw new ValidationException("Name is required");
        if (dto.address() == null || dto.address().isBlank()) throw new ValidationException("Address is required");
    }

    @Transactional(readOnly = true)
    public List<FacilityDTO> getAllActive() {
        List<Facility> facilities = facilityRepository.findByActiveTrueOrderByIdAsc();

        return facilityMapper.toDTO(facilities);
    }

    @Transactional(readOnly = true)
    public List<FacilityDTO> getAll() {
        List<Facility> facilities = facilityRepository.findAll();

        return facilityMapper.toDTO(facilities);
    }

    @Transactional(readOnly = true)
    public FacilityDTO get(Long id) {
        Facility dbFacility = facilityRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Facility not found"));

        return facilityMapper.toDTO(dbFacility);
    }
    @Transactional
    public FacilityDTO create(FacilityDTO dto) {
        if (dto.id() != null) throw new ValidationException("Cant create facility with ID");

        Facility newFacility = facilityMapper.toEntity(dto);

        if (newFacility.getSchedules() != null && !newFacility.getSchedules().isEmpty()) {
            newFacility.getSchedules().forEach(schedule -> schedule.setFacility(newFacility));
        }
        if(newFacility.getRooms() != null && !newFacility.getRooms().isEmpty()){
            newFacility.getRooms().forEach(room -> room.setFacility(newFacility));
        }

        Facility savedFacility = facilityRepository.save(newFacility);

        return facilityMapper.toDTO(savedFacility);
    }

    @Transactional
    public FacilityDTO update(Long id, FacilityUpdateDTO dto) {
        Facility dbFacility = facilityRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Facility doesn't exist!"));

        validateFacility(id, dto);

        facilityMapper.updateFacilityFromDto(dto, dbFacility);

        updateRooms(dbFacility, dto.rooms());

        updateFacilitySchedules(dbFacility, dto.schedules());

        return facilityMapper.toDTO(dbFacility);
    }

    private void updateFacilitySchedules(Facility facility, List<FacilityScheduleDTO> schedules) {
        Map<Long, FacilitySchedule> existingSchedules = facility.getSchedules().stream()
            .collect(Collectors.toMap(FacilitySchedule::getId, fs -> fs));

        schedules.forEach(fs -> {
            if (fs.openTime().isAfter(fs.closeTime())) throw new ValidationException("Open hours has a open time before close");
        });

        for (FacilityScheduleDTO fsDTO : schedules) {
            if (fsDTO.id() != null && existingSchedules.containsKey(fsDTO.id())) {
                FacilitySchedule fs = existingSchedules.get(fsDTO.id());
                facilityScheduleMapper.updateFacilityScheduleFromDto(fsDTO, fs);
                existingSchedules.remove(fsDTO.id());
            } else {
                FacilitySchedule newFacilitySchedule = facilityScheduleMapper.toEntity(fsDTO, facility);
                newFacilitySchedule.setFacility(facility);
                facility.getSchedules().add(newFacilitySchedule);
            }
        }
        existingSchedules.values()
            .forEach(
                facilitySchedule -> facility.getSchedules().remove(facilitySchedule)
            );
    }

    private void updateRooms(Facility facility, List<RoomDTO> roomDTOList) {
        Map<Long, Room> existingRooms = facility.getRooms().stream()
            .collect(Collectors.toMap(Room::getId, r -> r));

        roomDTOList.forEach(roomDTO -> {
            if (roomDTO.name() == null || roomDTO.name().isBlank())
                throw new ValidationException("Rooms require a name");
        });

        for (RoomDTO roomDTO : roomDTOList) {
            if (roomDTO.id() != null && existingRooms.containsKey(roomDTO.id())) {
                Room room = existingRooms.get(roomDTO.id());
                roomMapper.updateRoomFromDto(roomDTO, room);
                existingRooms.remove(roomDTO.id());
            } else {
                Room newRoom = roomMapper.toEntity(roomDTO);
                newRoom.setFacility(facility);
                facility.getRooms().add(newRoom);
            }
        }
        existingRooms.values().forEach(r -> facility.getRooms().remove(r));
    }

    @Transactional
    public void delete(Long id) {
        facilityRepository.deleteById(id);
    }
}
