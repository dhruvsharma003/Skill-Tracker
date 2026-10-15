package com.skilltrack.config;

import com.skilltrack.model.Graduate;
import com.skilltrack.model.TrainingModule;
import com.skilltrack.model.TrainingProgress;
import com.skilltrack.model.enums.LabStatus;
import com.skilltrack.model.enums.Role;
import com.skilltrack.model.enums.TrainingStatus;
import com.skilltrack.repository.GraduateRepository;
import com.skilltrack.repository.TrainingModuleRepository;
import com.skilltrack.repository.TrainingProgressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final GraduateRepository graduateRepository;
    private final TrainingModuleRepository moduleRepository;
    private final TrainingProgressRepository progressRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(GraduateRepository graduateRepository,
                           TrainingModuleRepository moduleRepository,
                           TrainingProgressRepository progressRepository,
                           PasswordEncoder passwordEncoder) {
        this.graduateRepository = graduateRepository;
        this.moduleRepository = moduleRepository;
        this.progressRepository = progressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (graduateRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial data population.");
            return;
        }

        logger.info("Initializing SkillTrack Capstone seed data...");

        String defaultEncodedPassword = passwordEncoder.encode("password123");

        // 1. Seed Mentors
        Graduate mentor1 = new Graduate("Sarah Jenkins", "sarah.jenkins@example.com", defaultEncodedPassword, Role.MENTOR, null);
        Graduate mentor2 = new Graduate("David Miller", "david.miller@example.com", defaultEncodedPassword, Role.MENTOR, null);
        mentor1 = graduateRepository.save(mentor1);
        mentor2 = graduateRepository.save(mentor2);

        // 2. Seed Training Modules
        List<TrainingModule> modules = new ArrayList<>();
        modules.add(new TrainingModule(
                "AWS Cloud Practitioner & Well-Architected Framework",
                "Cloud Fundamentals",
                1,
                false,
                "Overview of AWS core global infrastructure, Well-Architected 6 pillars, and cost optimization fundamentals.",
                8
        ));
        modules.add(new TrainingModule(
                "Amazon VPC Networking, Subnets & Routing",
                "Networking",
                2,
                true,
                "Designing multi-AZ VPC architecture with public and private subnets, security groups, route tables, and NAT gateway rules.",
                12
        ));
        modules.add(new TrainingModule(
                "AWS IAM Policies, Roles & Principle of Least Privilege",
                "Security",
                3,
                true,
                "Configuring IAM users, groups, role delegation, KMS customer-managed keys, and least-privilege security policies.",
                10
        ));
        modules.add(new TrainingModule(
                "Amazon S3 Static Hosting & CloudFront CDN",
                "Storage & CDN",
                4,
                true,
                "Hosting modern single-page applications on Amazon S3 with private origin access control (OAC) via CloudFront distribution.",
                10
        ));
        modules.add(new TrainingModule(
                "Amazon RDS PostgreSQL & Relational DB Design",
                "Databases",
                5,
                true,
                "Provisioning multi-AZ Amazon RDS PostgreSQL instances in private subnets, Secrets Manager credentials rotation, and JPA entity mapping.",
                14
        ));
        modules.add(new TrainingModule(
                "AWS Lambda Serverless Functions & Event Handlers",
                "Serverless & Compute",
                6,
                true,
                "Developing Java/Node serverless business logic, VPC ENI attachments, cold start optimization, and execution role boundaries.",
                12
        ));
        modules.add(new TrainingModule(
                "Amazon API Gateway REST APIs & JWT Authorizers",
                "API Integration",
                7,
                true,
                "Building RESTful API endpoints, request validation models, CORS configuration, and JWT authentication authorizers.",
                12
        ));
        modules.add(new TrainingModule(
                "CloudWatch, X-Ray & Observability Troubleshooting",
                "Observability",
                8,
                true,
                "Configuring structured application logging, CloudWatch alarms for 5XX errors, distributed tracing with AWS X-Ray, and audit trails.",
                8
        ));

        modules = moduleRepository.saveAll(modules);

        // 3. Seed 20 Graduates
        String[][] gradData = {
                {"Alex Chen", "alex.chen@example.com"},
                {"Priya Patel", "priya.patel@example.com"},
                {"Marcus Vance", "marcus.vance@example.com"},
                {"Elena Rostova", "elena.rostova@example.com"},
                {"James Wilson", "james.wilson@example.com"},
                {"Aisha Al-Mansoor", "aisha.mansoor@example.com"},
                {"Liam O'Connor", "liam.oconnor@example.com"},
                {"Sofia Rodriguez", "sofia.rodriguez@example.com"},
                {"Daniel Kim", "daniel.kim@example.com"},
                {"Fatima Zahra", "fatima.zahra@example.com"},
                {"Ethan Wright", "ethan.wright@example.com"},
                {"Maya Lin", "maya.lin@example.com"},
                {"Carlos Mendoza", "carlos.mendoza@example.com"},
                {"Zara Khan", "zara.khan@example.com"},
                {"Noah Taylor", "noah.taylor@example.com"},
                {"Chloe Bennett", "chloe.bennett@example.com"},
                {"Lucas Santos", "lucas.santos@example.com"},
                {"Ananya Sharma", "ananya.sharma@example.com"},
                {"Oliver Davies", "oliver.davies@example.com"},
                {"Jessica Lee", "jessica.lee@example.com"}
        };

        List<Graduate> graduates = new ArrayList<>();
        for (int i = 0; i < gradData.length; i++) {
            Long mentorId = (i % 2 == 0) ? mentor1.getId() : mentor2.getId();
            Graduate g = new Graduate(gradData[i][0], gradData[i][1], defaultEncodedPassword, Role.GRADUATE, mentorId);
            graduates.add(g);
        }
        graduates = graduateRepository.saveAll(graduates);

        // 4. Seed Training Progress records for each graduate
        List<TrainingProgress> progressRecords = new ArrayList<>();

        for (int i = 0; i < graduates.size(); i++) {
            Graduate grad = graduates.get(i);
            // Distribute completion levels realistically
            int completedModulesCount;
            if (i < 3) {
                completedModulesCount = 8; // fully complete
            } else if (i < 8) {
                completedModulesCount = 6; // high progress
            } else if (i < 14) {
                completedModulesCount = 4; // midway
            } else if (i < 18) {
                completedModulesCount = 2; // starting
            } else {
                completedModulesCount = 0; // brand new
            }

            for (int m = 0; m < modules.size(); m++) {
                TrainingModule mod = modules.get(m);
                TrainingStatus tStatus;
                LabStatus lStatus;
                String evidenceUrl = null;
                String evidenceNotes = null;

                if (m < completedModulesCount) {
                    tStatus = TrainingStatus.COMPLETED;
                    if (Boolean.TRUE.equals(mod.getLabRequired())) {
                        lStatus = LabStatus.COMPLETED;
                        evidenceUrl = "https://github.com/skilltrack-capstone/grad-" + (i + 1) + "-mod-" + (m + 1) + "-evidence";
                        evidenceNotes = "Completed lab exercise and validated VPC/CloudWatch test cases with passing verification logs.";
                    } else {
                        lStatus = LabStatus.WAIVED;
                        evidenceNotes = "Conceptual module reading & knowledge assessment passed.";
                    }
                } else if (m == completedModulesCount && completedModulesCount < modules.size()) {
                    tStatus = TrainingStatus.IN_PROGRESS;
                    lStatus = Boolean.TRUE.equals(mod.getLabRequired()) ? LabStatus.IN_PROGRESS : LabStatus.WAIVED;
                    evidenceNotes = "Currently reviewing documentation and working through the architecture lab workbook.";
                } else {
                    tStatus = TrainingStatus.NOT_STARTED;
                    lStatus = Boolean.TRUE.equals(mod.getLabRequired()) ? LabStatus.NOT_STARTED : LabStatus.WAIVED;
                }

                TrainingProgress tp = new TrainingProgress(grad, mod, tStatus, lStatus, evidenceUrl, evidenceNotes);
                tp.setUpdatedAt(LocalDateTime.now().minusDays(graduates.size() - i).plusHours(m));
                progressRecords.add(tp);
            }
        }

        progressRepository.saveAll(progressRecords);
        logger.info("Successfully seeded 2 mentors, 20 graduates, 8 training modules, and {} progress records.", progressRecords.size());
    }
}
