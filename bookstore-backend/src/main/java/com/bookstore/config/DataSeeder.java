package com.bookstore.config;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;

    @Autowired
    public DataSeeder(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) {
        if (bookRepository.count() == 0) {
            List<Book> books = List.of(
                new Book(null, "The Great Gatsby", "F. Scott Fitzgerald",
                    "A story of decadence and excess, exploring the American Dream.",
                    12.99, "https://covers.openlibrary.org/b/id/8432851-L.jpg", "Classic", 50, 4.5),

                new Book(null, "To Kill a Mockingbird", "Harper Lee",
                    "A gripping tale about racial injustice and moral growth in the American South.",
                    14.99, "https://covers.openlibrary.org/b/id/8810494-L.jpg", "Classic", 35, 4.8),

                new Book(null, "1984", "George Orwell",
                    "A dystopian novel about totalitarianism, surveillance, and thought control.",
                    11.99, "https://covers.openlibrary.org/b/id/8575708-L.jpg", "Science Fiction", 60, 4.7),

                new Book(null, "Harry Potter and the Philosopher's Stone", "J.K. Rowling",
                    "A young wizard discovers his magical heritage and begins his journey at Hogwarts.",
                    15.99, "https://covers.openlibrary.org/b/id/8228691-L.jpg", "Fantasy", 100, 4.9),

                new Book(null, "The Alchemist", "Paulo Coelho",
                    "A philosophical novel about following one's dreams and Personal Legend.",
                    10.99, "https://covers.openlibrary.org/b/id/8231684-L.jpg", "Philosophy", 45, 4.6),

                new Book(null, "Dune", "Frank Herbert",
                    "An epic science fiction novel set in a distant future amidst a feudal interstellar society.",
                    16.99, "https://covers.openlibrary.org/b/id/8771178-L.jpg", "Science Fiction", 30, 4.7),

                new Book(null, "The Hitchhiker's Guide to the Galaxy", "Douglas Adams",
                    "A comedic science fiction series following the misadventures of Arthur Dent.",
                    9.99, "https://covers.openlibrary.org/b/id/8227634-L.jpg", "Science Fiction", 55, 4.6),

                new Book(null, "Pride and Prejudice", "Jane Austen",
                    "A romantic novel depicting life in the British landed gentry at the early 19th century.",
                    8.99, "https://covers.openlibrary.org/b/id/8739161-L.jpg", "Romance", 40, 4.8),

                new Book(null, "The Catcher in the Rye", "J.D. Salinger",
                    "A coming-of-age novel narrated by the iconic Holden Caulfield.",
                    11.49, "https://covers.openlibrary.org/b/id/8231232-L.jpg", "Classic", 25, 4.3),

                new Book(null, "Brave New World", "Aldous Huxley",
                    "A dystopian novel set in a futuristic World State of genetically modified citizens.",
                    12.49, "https://covers.openlibrary.org/b/id/8231990-L.jpg", "Science Fiction", 20, 4.4),

                new Book(null, "The Lord of the Rings", "J.R.R. Tolkien",
                    "An epic high-fantasy novel that follows the quest to destroy the One Ring.",
                    24.99, "https://covers.openlibrary.org/b/id/8406786-L.jpg", "Fantasy", 70, 4.9),

                new Book(null, "Atomic Habits", "James Clear",
                    "A practical guide about how tiny changes in behavior can lead to remarkable results.",
                    18.99, "https://covers.openlibrary.org/b/id/10521270-L.jpg", "Self-Help", 80, 4.8)
            );

            bookRepository.saveAll(books);
            System.out.println("Seeded " + books.size() + " books to MongoDB");
        } else {
            System.out.println("Books already exist, skipping seeding.");
        }
    }
}
