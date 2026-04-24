package com.ffolch.portfolio.controller;

import com.ffolch.portfolio.dto.ProjectRequest;
import com.ffolch.portfolio.model.Project;
import com.ffolch.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // Public
    @GetMapping("/api/projects")
    public List<Project> getAll() {
        return projectService.findAll();
    }

    @GetMapping("/api/projects/{id}")
    public Project getById(@PathVariable Long id) {
        return projectService.findById(id);
    }

    // Admin
    @PostMapping("/api/admin/projects")
    public Project create(@Valid @RequestBody ProjectRequest req) {
        return projectService.create(req);
    }

    @PutMapping("/api/admin/projects/{id}")
    public Project update(@PathVariable Long id, @Valid @RequestBody ProjectRequest req) {
        return projectService.update(id, req);
    }

    @DeleteMapping("/api/admin/projects/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
