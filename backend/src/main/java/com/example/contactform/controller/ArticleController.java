package com.example.contactform.controller;

import com.example.contactform.model.Article;
import com.example.contactform.service.ArticleService;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpSession;


import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(
        origins = {
                "https://www.dctiptop.co.uk",
                "https://dctiptop.co.uk"
        },
        allowCredentials = "true"
)
public class ArticleController {

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/webp", "image/png", "image/svg+xml");

    @Autowired
    private ArticleService articleService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createArticle(@RequestParam("title") String title, @RequestParam("content") String content, @RequestParam("summary") @Size(max = 80) String summary, @RequestParam(value = "image", required = false) MultipartFile image, HttpSession session) {
        System.out.println("Received request to create article with title: " + title);
        Boolean isAdmin = (Boolean) session.getAttribute("admin");
        if (isAdmin == null || !isAdmin) {
            return ResponseEntity.status(403).body("Forbidden: Admin only");
        }
        if (summary != null) {
            String[] words = summary.trim().split("\\s+");
            if (words.length > 80) {
                return ResponseEntity.badRequest().body("Summary cannot exceed 80 words.");
            }
        }
        if (image != null && !image.isEmpty()) {
            String contentType = image.getContentType();
            if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
                return ResponseEntity.badRequest().body("Unsupported image format. Only WEBP, PNG, or SVG are allowed.");
            }

            // duplicates
            if (articleService.imageFilenameExists(image.getOriginalFilename())) {
                return ResponseEntity.badRequest().body("Image with this filename already exists. Please rename the file.");
            }
        }

        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setSummary(summary);


        if (image != null && !image.isEmpty()) {
            try {
                // REALNY UPLOAD DO CLOUDINARY:
                String imageUrl = articleService.uploadImageToCloudinary(image);
                article.setImageUrl(imageUrl);
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Failed to upload image to Cloudinary.");
            }
        }

        Article saved = articleService.saveArticle(article);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<Page<Article>> getArticles(@RequestParam int page, @RequestParam int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Article> articlesPage = articleService.getArticles(pageRequest);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
        // no cache
        headers.add(HttpHeaders.PRAGMA, "no-cache");
       
        headers.add(HttpHeaders.EXPIRES, "0");
        
        return new ResponseEntity<>(articlesPage, headers, HttpStatus.OK);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        Optional<Article> articleOptional = articleService.getArticleById(id);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
        //no cache
         headers.add(HttpHeaders.PRAGMA, "no-cache");
         
        headers.add(HttpHeaders.EXPIRES, "0");
        
        return articleOptional.map(article -> new ResponseEntity<>(article, headers, HttpStatus.OK))
                .orElseGet(() -> ResponseEntity.notFound().build());}

        //Method for updating articles by admin
        @PutMapping("/{id}")
        public ResponseEntity<?> updateArticle (@PathVariable Long id, @RequestParam("title") String
        title, @RequestParam("content") String content, @RequestParam("summary") @Size(max = 80) String
        summary, @RequestParam(value = "image", required = false) MultipartFile image, HttpSession session){
            Boolean isAdmin = (Boolean) session.getAttribute("admin");
            if (isAdmin == null || !isAdmin) {
                return ResponseEntity.status(403).body("Forbidden: Admin only");
            }
            Optional<Article> existingArticle = articleService.getArticleById(id);

            if (existingArticle.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Article article = existingArticle.get();
            article.setTitle(title);
            article.setContent(content);
            article.setSummary(summary);
            if (image != null && !image.isEmpty()) {
                try {
                    String imageUrl = articleService.uploadImageToCloudinary(image);
                    article.setImageUrl(imageUrl);
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Failed to upload image to Cloudinary.");
                }
            }
            Article updatedArticle = articleService.saveArticle(article);
            return ResponseEntity.ok(updatedArticle);
        }
    }

