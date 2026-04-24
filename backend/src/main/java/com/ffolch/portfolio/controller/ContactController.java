package com.ffolch.portfolio.controller;

import com.ffolch.portfolio.dto.ContactRequest;
import com.ffolch.portfolio.model.ContactMessage;
import com.ffolch.portfolio.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    // Public
    @PostMapping("/api/contact")
    public ResponseEntity<Void> submit(@Valid @RequestBody ContactRequest req) {
        contactService.submit(req);
        return ResponseEntity.ok().build();
    }

    // Admin
    @GetMapping("/api/admin/messages")
    public List<ContactMessage> getAll() {
        return contactService.getAll();
    }
}
