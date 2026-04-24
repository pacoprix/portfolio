package com.ffolch.portfolio.repository;

import com.ffolch.portfolio.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByReadFalseOrderByCreatedAtDesc();
}
