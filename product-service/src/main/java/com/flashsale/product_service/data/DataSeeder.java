package com.flashsale.product_service.data;

import com.flashsale.product_service.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public void run(String... args) {

        List<Product> products = List.of(
                new Product(1, "iPhone 15", 2000, 10),
                new Product(2, "Samsung S24", 1800, 8),
                new Product(3, "MacBook M3", 3000, 5)
        );

        redisTemplate.opsForValue().set("products", products);

        for (Product p : products) {
            redisTemplate.opsForValue().set("product:" + p.getId(), p);
        }

        System.out.println("Seed data done");
    }
}
