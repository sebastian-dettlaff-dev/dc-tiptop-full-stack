package com.example.contactform.controller;

import com.example.contactform.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SitemapController {

    private final ArticleService articleService;

    @Autowired
    public SitemapController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping(value = "/sitemap.xml", produces = "application/xml")
    public String getSitemap() {
        String today = java.time.LocalDate.now().toString();

        StringBuilder sitemap = new StringBuilder();

        // 👇 ważne: NIE może być pustej linii przed <?xml ...>
        sitemap.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sitemap.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        List<String> staticPages = List.of(
                "/", "/ourservices/index.html",
                "/image-Gallery.html",
                "/frequently-questions.html",
                "/contact.html",
                "/blog.html",
                "/our-services/tr19-certificate-of-cleanliness.html",
                "/our-services/kitchen-deep-cleans.html",
                "/our-services/grease-trap-cleaning.html",
                "/our-services/grease-extraction-cleaning.html",
                "/our-services/equipment-deep-cleaning.html",
                "/our-services/access-door-installation.html"
        );

        for (String page : staticPages) {
            sitemap.append("  <url>\n");
            sitemap.append("    <loc>https://www.dctiptop.co.uk").append(page).append("</loc>\n");
            sitemap.append("    <lastmod>").append(today).append("</lastmod>\n");
            sitemap.append("    <priority>0.8</priority>\n");
            sitemap.append("  </url>\n");
        }

        articleService.getArticles(org.springframework.data.domain.PageRequest.of(0, 1000))
                .forEach(article -> {
                    sitemap.append("  <url>\n");
                    sitemap.append("    <loc>https://www.dctiptop.co.uk/article.html?id=").append(article.getId()).append("</loc>\n");
                    sitemap.append("    <lastmod>");
                    if (article.getCreatedAt() != null) {
                        sitemap.append(article.getCreatedAt().toLocalDate());
                    } else {
                        sitemap.append(today);
                    }
                    sitemap.append("</lastmod>\n");
                    sitemap.append("    <priority>0.6</priority>\n");
                    sitemap.append("  </url>\n");
                });

        sitemap.append("</urlset>");
        return sitemap.toString();
    }

}
