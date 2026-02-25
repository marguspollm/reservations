package ee.margus.sportspace.model;

import java.util.Set;

public record UserClaims(Long userId, String email, Set<String> roles) {
}
