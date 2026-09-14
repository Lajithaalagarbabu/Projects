package com.trizenai.photoshare.service;

import com.trizenai.photoshare.dto.AuthResponse;
import com.trizenai.photoshare.dto.LoginRequest;
import com.trizenai.photoshare.dto.RegisterRequest;
import com.trizenai.photoshare.entity.User;
import com.trizenai.photoshare.exception.BadRequestException;
import com.trizenai.photoshare.exception.UnauthorizedException;
import com.trizenai.photoshare.repository.UserRepository;
import com.trizenai.photoshare.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name());

        return new AuthResponse(
                token,
                savedUser.getRole(),
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        return new AuthResponse(
                token,
                user.getRole(),
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
