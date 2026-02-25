package ee.margus.sportspace.dto;

public record RoomDTO(
    Long id,
    String name,
    String sportType,
    Double price,
    Boolean active
) {
}
