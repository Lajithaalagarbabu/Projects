package com.pgmanagement.service;

import com.pgmanagement.dto.AuthRequest;
import com.pgmanagement.dto.AuthResponse;
import com.pgmanagement.entity.User;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.repository.UserRepository;
import com.pgmanagement.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginRequest.getEmail()));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getEmail().split("@")[0],
                user.getRole().name()
        );
    }
}
