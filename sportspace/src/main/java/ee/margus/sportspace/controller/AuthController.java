package ee.margus.sportspace.controller;

import ee.margus.sportspace.dto.LoginDTO;
import ee.margus.sportspace.dto.SignupDTO;
import ee.margus.sportspace.dto.UserDTO;
import ee.margus.sportspace.model.AuthToken;
import ee.margus.sportspace.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthToken> login(@RequestBody LoginDTO loginDTO) {
        AuthToken authToken = authService.login(loginDTO);
        return ResponseEntity.ok().body(authToken);
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@RequestBody SignupDTO signupDTO) {
        UserDTO userDTO = authService.signup(signupDTO);
        return ResponseEntity.ok().body(userDTO);
    }
}
