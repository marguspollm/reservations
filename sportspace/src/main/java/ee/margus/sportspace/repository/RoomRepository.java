package ee.margus.sportspace.repository;

import ee.margus.sportspace.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByFacility_IdAndActiveTrueOrderByIdAsc(Long id);
}
