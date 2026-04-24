package com.ffolch.portfolio.controller;

import com.ffolch.portfolio.dto.SkillRequest;
import com.ffolch.portfolio.model.Skill;
import com.ffolch.portfolio.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    // Public
    @GetMapping("/api/skills")
    public List<Skill> getAll() {
        return skillService.findAll();
    }

    // Admin
    @PostMapping("/api/admin/skills")
    public Skill create(@Valid @RequestBody SkillRequest req) {
        return skillService.create(req);
    }

    @PutMapping("/api/admin/skills/{id}")
    public Skill update(@PathVariable Long id, @Valid @RequestBody SkillRequest req) {
        return skillService.update(id, req);
    }

    @DeleteMapping("/api/admin/skills/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        skillService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
