package com.trizenai.photoshare.security;

import com.trizenai.photoshare.entity.User;
import com.trizenai.photoshare.enums.Role;
import com.trizenai.photoshare.exception.UnauthorizedException;
import com.trizenai.photoshare.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private final UserRepository userRepository;

    public SecurityUtils(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User is not authenticated");
        }

        Object principal = authentication.getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        } else {
            throw new UnauthorizedException("Invalid authentication principal");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found in database"));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public Role getCurrentUserRole() {
        return getCurrentUser().getRole();
    }
}
