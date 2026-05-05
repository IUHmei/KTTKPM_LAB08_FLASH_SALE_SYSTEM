package org.example.service;

import org.example.repository.RedisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.Map;
import java.util.Objects;

public class OrderService {
    @Autowired
    private RedisRepository redisRepository;

    @Autowired
    private StringRedisTemplate redisTemplate;

    public String checkout(String userId) {
        Map<Object, Object> cart = redisRepository.getCart(userId);
        if(cart.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        //giam so luong san pham trong kho
        for(Object productid : cart.keySet()) {
            Long stock = redisRepository.decrementStock((String) productid);
            if(Objects.isNull(stock) || stock < 0) {
                redisTemplate.opsForValue().increment("stock:" + productid); // rollback
                throw new RuntimeException("Product " + productid + " is out of stock");
            }
        }

        //tao order
        String orderId = "order:" + System.currentTimeMillis();
        redisTemplate.opsForValue().set(
            orderId, "userId:" + userId + ", items:" + cart.toString()
        );

        //Xoa gio hang
        redisTemplate.delete("cart:" + userId);

        return orderId;
    }
}
