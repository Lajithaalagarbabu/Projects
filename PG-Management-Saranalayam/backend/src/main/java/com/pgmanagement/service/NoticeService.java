package com.pgmanagement.service;

import com.pgmanagement.entity.Notice;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByIdDesc();
    }

    public List<Notice> getNoticesForRole(String role) {
        return noticeRepository.findByTargetRoleInOrderByIdDesc(Arrays.asList("ALL", role.toUpperCase()));
    }

    @Transactional
    public Notice createNotice(String title, String content, String targetRole, String postedBy) {
        Notice notice = new Notice(title, content, targetRole != null ? targetRole : "ALL", postedBy);
        return noticeRepository.save(notice);
    }

    @Transactional
    public void deleteNotice(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notice not found with id: " + id);
        }
        noticeRepository.deleteById(id);
    }
}
