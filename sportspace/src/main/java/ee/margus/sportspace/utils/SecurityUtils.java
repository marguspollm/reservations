package ee.margus.sportspace.utils;

import ee.margus.sportspace.model.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public final class SecurityUtils {

    public static Authentication getAuthentication() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            throw new RuntimeException("Auth problem");
        return auth;
    }

    public static boolean hasRole(Role... roles) {
        Authentication auth = getAuthentication();

        Set<String> roleSet = Arrays.stream(roles)
                .map(role -> "ROLE_" + role)
                .collect(Collectors.toSet());

        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(roleSet::contains);
    }

    public static Long getAuthenticatedUserId() {
        Authentication auth = getAuthentication();

        Long authUserId = (Long) auth.getPrincipal();
        if (authUserId == null)
            throw new RuntimeException("Couldn't get user id");

        return authUserId;
    }
}
