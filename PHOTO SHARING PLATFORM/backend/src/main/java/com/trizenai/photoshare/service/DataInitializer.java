package com.trizenai.photoshare.service;

import com.trizenai.photoshare.entity.Event;
import com.trizenai.photoshare.entity.EventMember;
import com.trizenai.photoshare.entity.Photo;
import com.trizenai.photoshare.entity.User;
import com.trizenai.photoshare.enums.Role;
import com.trizenai.photoshare.repository.EventMemberRepository;
import com.trizenai.photoshare.repository.EventRepository;
import com.trizenai.photoshare.repository.PhotoRepository;
import com.trizenai.photoshare.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final PhotoRepository photoRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            EventRepository eventRepository,
            EventMemberRepository eventMemberRepository,
            PhotoRepository photoRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.eventMemberRepository = eventMemberRepository;
        this.photoRepository = photoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Seed Admin User
        User admin = userRepository.findByEmail("admin@demo.com").orElseGet(() -> {
            User u = new User();
            u.setName("Admin User");
            u.setEmail("admin@demo.com");
            u.setPassword(passwordEncoder.encode("Admin@123"));
            u.setRole(Role.ADMIN);
            return userRepository.save(u);
        });

        // Seed Team Member User
        User member = userRepository.findByEmail("member@demo.com").orElseGet(() -> {
            User u = new User();
            u.setName("Rahul Sharma (Team Lead)");
            u.setEmail("member@demo.com");
            u.setPassword(passwordEncoder.encode("Member@123"));
            u.setRole(Role.TEAM_MEMBER);
            return userRepository.save(u);
        });

        // Seed Sample Event
        if (eventRepository.findByCreatedBy(admin.getId()).isEmpty()) {
            Event weddingEvent = new Event();
            weddingEvent.setName("Arjun & Priya Wedding");
            weddingEvent.setDescription("Grand Royal Destination Wedding at City Palace, Udaipur.");
            weddingEvent.setEventDate(LocalDate.now().minusDays(2));
            weddingEvent.setCreatedBy(admin.getId());
            Event savedEvent = eventRepository.save(weddingEvent);

            // Assign Team Member
            if (!eventMemberRepository.existsByEventIdAndUserId(savedEvent.getId(), member.getId())) {
                eventMemberRepository.save(new EventMember(savedEvent.getId(), member.getId()));
            }

            // Seed Sample Photos
            if (photoRepository.findByEventId(savedEvent.getId()).isEmpty()) {
                createSamplePhoto(savedEvent.getId(), member.getId(), "wedding_ceremony_01.jpg", 
                        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop", true);
                createSamplePhoto(savedEvent.getId(), member.getId(), "couple_portrait_02.jpg", 
                        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop", true);
                createSamplePhoto(savedEvent.getId(), member.getId(), "sangeet_dance_03.jpg", 
                        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop", false);
            }
        }
    }

    private void createSamplePhoto(Long eventId, Long uploadedBy, String filename, String url, boolean selected) {
        Photo photo = new Photo();
        photo.setEventId(eventId);
        photo.setUploadedBy(uploadedBy);
        photo.setFilename(filename);
        photo.setStorageUrl(url);
        photo.setStoragePublicId("demo_" + filename);
        photo.setFileSize(2457600L);
        photo.setSelected(selected);
        photoRepository.save(photo);
    }
}
