package com.skilltrack;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skilltrack.dto.AuthRequest;
import com.skilltrack.dto.ProgressUpdateRequest;
import com.skilltrack.model.enums.LabStatus;
import com.skilltrack.model.enums.TrainingStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SkillTrackApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("SkillTrack AWS Capstone Backend"));
    }

    @Test
    void testMentorLoginAndAccessCohort() throws Exception {
        AuthRequest loginRequest = new AuthRequest("sarah.jenkins@example.com", "password123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.role").value("MENTOR"))
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        Map<?, ?> responseMap = objectMapper.readValue(responseBody, Map.class);
        String token = (String) responseMap.get("token");

        // Mentor can access /api/mentor/graduates
        mockMvc.perform(get("/api/mentor/graduates")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(20)));

        // Mentor can access /api/mentor/stats
        mockMvc.perform(get("/api/mentor/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalGraduates").value(20));

        // Mentor can export CSV
        mockMvc.perform(get("/api/mentor/export")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString("attachment; filename=\"skilltrack_cohort_progress.csv\"")))
                .andExpect(content().contentType("text/csv;charset=UTF-8"));
    }

    @Test
    void testGraduateLoginAndCannotAccessMentorApi() throws Exception {
        AuthRequest loginRequest = new AuthRequest("alex.chen@example.com", "password123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.role").value("GRADUATE"))
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        Map<?, ?> responseMap = objectMapper.readValue(responseBody, Map.class);
        String token = (String) responseMap.get("token");

        // Graduate CAN access own progress
        mockMvc.perform(get("/api/graduate/progress")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.graduate.email").value("alex.chen@example.com"))
                .andExpect(jsonPath("$.modules", hasSize(8)));

        // Graduate CANNOT access mentor cohort API (Role Enforcement - Requirement 2)
        mockMvc.perform(get("/api/mentor/graduates")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void testGraduateUpdateProgress() throws Exception {
        AuthRequest loginRequest = new AuthRequest("alex.chen@example.com", "password123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> responseMap = objectMapper.readValue(loginResult.getResponse().getContentAsString(), Map.class);
        String token = (String) responseMap.get("token");

        ProgressUpdateRequest updateRequest = new ProgressUpdateRequest(
                TrainingStatus.COMPLETED,
                LabStatus.COMPLETED,
                "https://github.com/alexchen/aws-capstone-lab-updated",
                "Successfully verified DynamoDB and CloudWatch alarm."
        );

        mockMvc.perform(put("/api/graduate/progress/2")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trainingStatus").value("COMPLETED"))
                .andExpect(jsonPath("$.labStatus").value("COMPLETED"))
                .andExpect(jsonPath("$.evidenceUrl").value("https://github.com/alexchen/aws-capstone-lab-updated"));
    }
}
