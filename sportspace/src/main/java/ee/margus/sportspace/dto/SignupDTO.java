package ee.margus.sportspace.dto;

public record SignupDTO(
    String email,
    String firstname,
    String lastname,
    String password,
    String phoneNumber
) {
}
