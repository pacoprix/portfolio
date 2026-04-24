package com.ffolch.portfolio.service;

import com.ffolch.portfolio.dto.ProjectRequest;
import com.ffolch.portfolio.model.Project;
import com.ffolch.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
    }

    public Project create(ProjectRequest req) {
        Project p = new Project();
        return save(p, req);
    }

    public Project update(Long id, ProjectRequest req) {
        Project p = findById(id);
        return save(p, req);
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }

    private Project save(Project p, ProjectRequest req) {
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setTechStack(req.getTechStack());
        p.setGithubUrl(req.getGithubUrl());
        p.setDemoUrl(req.getDemoUrl());
        p.setImageUrl(req.getImageUrl());
        p.setFeatured(req.isFeatured());
        return projectRepository.save(p);
    }
}
