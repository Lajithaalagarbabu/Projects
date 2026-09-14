package com.trizenai.photoshare.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trizenai.photoshare.dto.GalleryRequest;
import com.trizenai.photoshare.dto.PinVerificationRequest;
import com.trizenai.photoshare.entity.Event;
import com.trizenai.photoshare.entity.Photo;
import com.trizenai.photoshare.entity.User;
import com.trizenai.photoshare.repository.EventRepository;
import com.trizenai.photoshare.repository.PhotoRepository;
import com.trizenai.photoshare.repository.UserRepository;
import com.trizenai.photoshare.security.JwtService;
import com.trizenai.photoshare.service.GalleryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class GalleryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private GalleryService galleryService;

    private Long adminId;
    private Long memberId;
    private Long eventId;

    @BeforeEach
    public void setup() {
        User admin = userRepository.findByEmail("admin@demo.com").orElseThrow();
        adminId = admin.getId();

        User member = userRepository.findByEmail("member@demo.com").orElseThrow();
        memberId = member.getId();

        Event event = new Event();
        event.setName("Test Wedding");
        event.setDescription("Test Desc");
        event.setEventDate(LocalDate.now());
        event.setCreatedBy(adminId);
        Event savedEvent = eventRepository.save(event);
        eventId = savedEvent.getId();

        Photo photo = new Photo();
        photo.setEventId(eventId);
        photo.setUploadedBy(memberId);
        photo.setFilename("photo.jpg");
        photo.setStorageUrl("https://example.com/p.jpg");
        photo.setSelected(true);
        photoRepository.save(photo);
    }

    @Test
    @DisplayName("Admin can create gallery with PIN")
    public void testAdminCreateGallery() throws Exception {
        String adminToken = jwtService.generateToken("admin@demo.com", adminId, "ADMIN");
        GalleryRequest request = new GalleryRequest("482917");

        mockMvc.perform(post("/api/admin/events/" + eventId + "/gallery")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.galleryCode").exists())
                .andExpect(jsonPath("$.published").value(false));
    }

    @Test
    @DisplayName("Correct PIN works and Incorrect PIN fails")
    public void testPinVerification() throws Exception {
        String adminToken = jwtService.generateToken("admin@demo.com", adminId, "ADMIN");
        GalleryRequest galleryReq = new GalleryRequest("123456");

        MvcResult createResult = mockMvc.perform(post("/api/admin/events/" + eventId + "/gallery")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(galleryReq)))
                .andExpect(status().isCreated())
                .andReturn();

        String json = createResult.getResponse().getContentAsString();
        String galleryCode = objectMapper.readTree(json).get("galleryCode").asText();
        long galleryId = objectMapper.readTree(json).get("id").asLong();

        // Publish gallery
        mockMvc.perform(post("/api/admin/galleries/" + galleryId + "/publish")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.published").value(true));

        // Incorrect PIN -> 401 Unauthorized
        PinVerificationRequest wrongPin = new PinVerificationRequest("000000");
        mockMvc.perform(post("/api/public/gallery/" + galleryCode + "/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongPin)))
                .andExpect(status().isUnauthorized());

        // Correct PIN -> 200 OK with token
        PinVerificationRequest correctPin = new PinVerificationRequest("123456");
        MvcResult verifyResult = mockMvc.perform(post("/api/public/gallery/" + galleryCode + "/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(correctPin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verified").value(true))
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        String verifyJson = verifyResult.getResponse().getContentAsString();
        String galleryToken = objectMapper.readTree(verifyJson).get("token").asText();

        // Get public photos using token
        mockMvc.perform(get("/api/public/gallery/" + galleryCode + "/photos")
                        .header("X-Gallery-Token", galleryToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].filename").value("photo.jpg"));
    }
}
