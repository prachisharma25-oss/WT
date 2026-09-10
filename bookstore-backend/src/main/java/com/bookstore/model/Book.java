package com.bookstore.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Document(collection = "books")
public class Book {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    private String coverUrl;

    private String category;

    private Integer stock = 0;

    private Double rating = 0.0;

    // --- Constructors ---
    public Book() {}

    public Book(String id, String title, String author, String description,
                Double price, String coverUrl, String category, Integer stock, Double rating) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.price = price;
        this.coverUrl = coverUrl;
        this.category = category;
        this.stock = stock;
        this.rating = rating;
    }

    // --- Getters ---
    public String getId()          { return id; }
    public String getTitle()       { return title; }
    public String getAuthor()      { return author; }
    public String getDescription() { return description; }
    public Double getPrice()       { return price; }
    public String getCoverUrl()    { return coverUrl; }
    public String getCategory()    { return category; }
    public Integer getStock()      { return stock; }
    public Double getRating()      { return rating; }

    // --- Setters ---
    public void setId(String id)                { this.id = id; }
    public void setTitle(String title)          { this.title = title; }
    public void setAuthor(String author)        { this.author = author; }
    public void setDescription(String desc)     { this.description = desc; }
    public void setPrice(Double price)          { this.price = price; }
    public void setCoverUrl(String coverUrl)    { this.coverUrl = coverUrl; }
    public void setCategory(String category)    { this.category = category; }
    public void setStock(Integer stock)         { this.stock = stock; }
    public void setRating(Double rating)        { this.rating = rating; }

    @Override
    public String toString() {
        return "Book{id='" + id + "', title='" + title + "', author='" + author + "', price=" + price + "}";
    }
}
