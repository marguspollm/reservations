package ee.margus.sportspace.security;

import ee.margus.sportspace.entity.User;
import ee.margus.sportspace.model.Role;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class JWTFilter extends OncePerRequestFilter {
    @Autowired
    private JWTService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        String header = request.getHeader(org.springframework.http.HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.replace("Bearer ", "");
            User user = jwtService.validateToken(token);
            if (user != null) {
                List<GrantedAuthority> authorities = new ArrayList<>();
                if(user.getRoles().stream().anyMatch(role -> role.equals(Role.USER))){
                    authorities.add(new SimpleGrantedAuthority(("ROLE_USER")));
                }
                if (user.getRoles().stream().anyMatch(role -> role.equals(Role.ADMIN))) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                }
                if (user.getRoles().stream().anyMatch(role -> role.equals(Role.SUPERADMIN))) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_SUPERADMIN"));
                }
                Authentication authentication = new UsernamePasswordAuthenticationToken(user.getId(),
                    null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
