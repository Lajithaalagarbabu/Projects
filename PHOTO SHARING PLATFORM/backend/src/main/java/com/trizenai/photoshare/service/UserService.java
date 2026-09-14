package com.trizenai.photoshare.service;

import com.trizenai.photoshare.dto.UserResponse;
import com.trizenai.photoshare.entity.User;
import com.trizenai.photoshare.enums.Role;
import com.trizenai.photoshare.exception.ResourceNotFoundException;
import com.trizenai.photoshare.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllTeamMembers() {
        return userRepository.findByRole(Role.TEAM_MEMBER).stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
