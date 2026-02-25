package ee.margus.sportspace.security;

import ee.margus.sportspace.repository.AuthCredentialRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AuthCredentialRepository repository;


    @Override
    public UserDetails loadUserByUsername(@NonNull String username)
        throws UsernameNotFoundException {

        return repository.findByEmail(username)
            .orElseThrow(() ->
                new UsernameNotFoundException("User not found"));
    }
}
