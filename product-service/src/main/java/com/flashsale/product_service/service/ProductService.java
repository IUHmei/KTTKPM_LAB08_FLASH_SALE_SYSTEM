package com.flashsale.product_service.service;

import com.flashsale.product_service.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public List<Product> getAll() {
        return (List<Product>) redisTemplate.opsForValue().get("products");
    }

    public Product getById(int id) {
        return (Product) redisTemplate.opsForValue().get("product:" + id);
    }
}
