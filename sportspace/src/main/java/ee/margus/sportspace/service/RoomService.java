package ee.margus.sportspace.service;

import ee.margus.sportspace.dto.RoomDTO;
import ee.margus.sportspace.dto.RoomUpdateDTO;
import ee.margus.sportspace.entity.Facility;
import ee.margus.sportspace.entity.Room;
import ee.margus.sportspace.exception.NotFoundException;
import ee.margus.sportspace.mapper.RoomMapper;
import ee.margus.sportspace.repository.FacilityRepository;
import ee.margus.sportspace.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomService {
    @Autowired
    private RoomMapper roomMapper;
    @Autowired
    private RoomRepository repository;
    @Autowired
    private FacilityRepository facilityRepository;

    @Transactional
    public RoomDTO create(Long facilityId, RoomDTO roomDTO) {
        Facility dbFacility = facilityRepository.findById(facilityId)
            .orElseThrow(() -> new NotFoundException("Facility doesn't exist"));

        Room newRoom = roomMapper.toEntity(roomDTO);
        newRoom.setFacility(dbFacility);
        Room savedRoom = repository.save(newRoom);

        return roomMapper.toDTO(savedRoom);
    }

    @Transactional
    public void delete(Long roomId) {
        if(!repository.existsById(roomId)) throw new NotFoundException("Room not found");
        repository.deleteById(roomId);
    }

    @Transactional
    public RoomDTO update(Long roomId, RoomUpdateDTO dto) {
        Room dbRoom = repository.findById(roomId)
            .orElseThrow(() -> new NotFoundException("Room doesn't exist!"));
        roomMapper.updateRoomFromDto(dto, dbRoom);

        return roomMapper.toDTO(dbRoom);
    }

    @Transactional(readOnly = true)
    public List<RoomDTO> getFacilityRooms(Long facilityId) {
        List<Room> dbRooms =  repository.findByFacility_IdAndActiveTrueOrderByIdAsc(facilityId);

        return roomMapper.toDTO(dbRooms);
    }
}
