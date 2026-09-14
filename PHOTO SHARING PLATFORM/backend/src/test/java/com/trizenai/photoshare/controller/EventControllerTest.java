package com.trizenai.photoshare.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trizenai.photoshare.dto.EventRequest;
import com.trizenai.photoshare.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("Admin can create an event")
    public void testAdminCanCreateEvent() throws Exception {
        String adminToken = jwtService.generateToken("admin@demo.com", 1L, "ADMIN");
        EventRequest request = new EventRequest("New Gala Event", "Gala description", LocalDate.now());

        mockMvc.perform(post("/api/admin/events")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Gala Event"));
    }

    @Test
    @DisplayName("Team Member cannot create an event")
    public void testTeamMemberCannotCreateEvent() throws Exception {
        String memberToken = jwtService.generateToken("member@demo.com", 2L, "TEAM_MEMBER");
        EventRequest request = new EventRequest("Unauthorized Event", "Description", LocalDate.now());

        mockMvc.perform(post("/api/admin/events")
                        .header("Authorization", "Bearer " + memberToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
