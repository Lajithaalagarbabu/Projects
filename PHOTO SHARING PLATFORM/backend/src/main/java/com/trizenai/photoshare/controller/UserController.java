package com.trizenai.photoshare.controller;

import com.trizenai.photoshare.dto.UserResponse;
import com.trizenai.photoshare.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/team-members")
    public ResponseEntity<List<UserResponse>> getTeamMembers() {
        List<UserResponse> teamMembers = userService.getAllTeamMembers();
        return ResponseEntity.ok(teamMembers);
    }
}
