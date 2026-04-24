package com.ffolch.portfolio.service;

import com.ffolch.portfolio.dto.ContactRequest;
import com.ffolch.portfolio.model.ContactMessage;
import com.ffolch.portfolio.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public void submit(ContactRequest req) {
        ContactMessage msg = new ContactMessage();
        msg.setName(req.getName());
        msg.setEmail(req.getEmail());
        msg.setMessage(req.getMessage());
        contactMessageRepository.save(msg);
    }

    public List<ContactMessage> getUnread() {
        return contactMessageRepository.findByReadFalseOrderByCreatedAtDesc();
    }

    public List<ContactMessage> getAll() {
        return contactMessageRepository.findAll();
    }
}
