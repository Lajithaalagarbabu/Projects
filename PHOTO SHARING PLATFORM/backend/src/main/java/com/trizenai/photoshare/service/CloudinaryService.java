package com.trizenai.photoshare.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.trizenai.photoshare.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final boolean isCloudinaryConfigured;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );

    public CloudinaryService(
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret
    ) {
        if (cloudName != null && !cloudName.isBlank() 
                && apiKey != null && !apiKey.isBlank() 
                && apiSecret != null && !apiSecret.isBlank()) {
            Map<String, String> config = new HashMap<>();
            config.put("cloud_name", cloudName);
            config.put("api_key", apiKey);
            config.put("api_secret", apiSecret);
            this.cloudinary = new Cloudinary(config);
            this.isCloudinaryConfigured = true;
        } else {
            this.cloudinary = null;
            this.isCloudinaryConfigured = false;
        }
    }

    public Map<String, String> uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }

        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            // Also check file extension
            if (originalFilename == null || !isValidExtension(originalFilename)) {
                throw new BadRequestException("Invalid file type. Allowed formats: JPG, JPEG, PNG, WEBP");
            }
        }

        // 10 MB Limit
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds maximum limit of 10MB");
        }

        Map<String, String> result = new HashMap<>();

        if (isCloudinaryConfigured && cloudinary != null) {
            try {
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                        "folder", "photo_sharing_platform",
                        "resource_type", "image"
                ));
                result.put("url", (String) uploadResult.get("secure_url"));
                result.put("publicId", (String) uploadResult.get("public_id"));
            } catch (IOException e) {
                throw new BadRequestException("Cloudinary upload failed: " + e.getMessage());
            }
        } else {
            // Fallback for offline/local demonstration mode
            String fakePublicId = "mock_" + UUID.randomUUID().toString().substring(0, 8);
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                String mime = contentType != null ? contentType : "image/jpeg";
                String dataUrl = "data:" + mime + ";base64," + base64Image;
                result.put("url", dataUrl);
                result.put("publicId", fakePublicId);
            } catch (IOException e) {
                result.put("url", "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop");
                result.put("publicId", fakePublicId);
            }
        }

        return result;
    }

    private boolean isValidExtension(String filename) {
        String lower = filename.toLowerCase();
        return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp");
    }
}
