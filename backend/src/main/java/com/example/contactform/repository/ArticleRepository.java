package com.example.contactform.repository;

import com.example.contactform.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    boolean existsByImageUrlContaining(String imageUrl);
    boolean existsByImageUrl(String imageUrl);

}