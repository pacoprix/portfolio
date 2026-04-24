package com.ffolch.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectRequest {
    @NotBlank private String title;
    private String description;
    private String techStack;
    private String githubUrl;
    private String demoUrl;
    private String imageUrl;
    private boolean featured;
}
