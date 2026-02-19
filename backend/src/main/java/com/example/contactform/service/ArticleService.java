package com.example.contactform.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.contactform.model.Article;
import com.example.contactform.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private Cloudinary cloudinary;

    public Article saveArticle(Article article) {
        if (article.getSummary() != null && article.getSummary().length() > 80) {
            article.setSummary(article.getSummary().substring(0, 80));
        }
        return articleRepository.save(article);
    }



    public Page<Article> getArticles(Pageable pageable) {
        return articleRepository.findAll(pageable);
    }

    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    public boolean imageFilenameExists(String filename) {

        return articleRepository.existsByImageUrl(filename);
    }


    public String uploadImageToCloudinary(MultipartFile image) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("secure_url").toString();
        // zwraca bezpieczny link HTTPS
    }
}
