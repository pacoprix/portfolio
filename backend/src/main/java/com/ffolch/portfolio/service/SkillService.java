package com.ffolch.portfolio.service;

import com.ffolch.portfolio.dto.SkillRequest;
import com.ffolch.portfolio.model.Skill;
import com.ffolch.portfolio.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<Skill> findAll() {
        return skillRepository.findAll();
    }

    public Skill create(SkillRequest req) {
        Skill s = new Skill();
        return save(s, req);
    }

    public Skill update(Long id, SkillRequest req) {
        Skill s = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found: " + id));
        return save(s, req);
    }

    public void delete(Long id) {
        skillRepository.deleteById(id);
    }

    private Skill save(Skill s, SkillRequest req) {
        s.setName(req.getName());
        s.setCategory(req.getCategory());
        s.setLevel(req.getLevel());
        return skillRepository.save(s);
    }
}
