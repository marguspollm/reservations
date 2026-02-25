package ee.margus.sportspace.controller;

import ee.margus.sportspace.dto.UserDTO;
import ee.margus.sportspace.dto.UserUpdateDTO;
import ee.margus.sportspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("users")
    public ResponseEntity<List<UserDTO>> getAll() {
        List<UserDTO> users = userService.getAll();
        return ResponseEntity.ok().body(users);
    }

    @GetMapping("users/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUser(id);
        return ResponseEntity.ok().body(user);
    }

    @PutMapping("users/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Long id, @RequestBody UserUpdateDTO dto) {
        UserDTO user = userService.update(id, dto);
        return ResponseEntity.ok().body(user);
    }

    @DeleteMapping("users/{id}")
    public ResponseEntity<List<UserDTO>> delete(@PathVariable Long id) {
        userService.delete(id);
        List<UserDTO> response = userService.getAll();
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("change-role")
    public ResponseEntity<UserDTO> changeRole(@RequestParam Long userId) {
        userService.changeRole(userId);
        UserDTO response = userService.getUser(userId);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("me")
    public ResponseEntity<UserDTO> getMe() {
        UserDTO user = userService.getMe();
        return ResponseEntity.ok().body(user);
    }

    @PutMapping("update-me")
    public ResponseEntity<UserDTO> update(@RequestBody UserUpdateDTO dto) {
        UserDTO user = userService.updateMe(dto);
        return ResponseEntity.ok().body(user);
    }

}
