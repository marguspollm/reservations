package ee.margus.sportspace.dto;

public record RoomUpdateDTO(
    String name,
    String sportType,
    Double price,
    Boolean active
) {
}
