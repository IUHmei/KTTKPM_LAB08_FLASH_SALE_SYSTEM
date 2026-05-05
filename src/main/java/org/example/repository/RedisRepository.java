package org.example.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class RedisRepository {

    @Autowired
    private StringRedisTemplate redisTemplate;

    //Lay gio hang cua user
    public Map<Object, Object> getCart(String userId) {
        return redisTemplate.opsForHash().entries("cart:" + userId);
    }

    //Giam so luong san pham trong kho
    public Long decrementStock(String productId) {
        return redisTemplate.opsForValue().decrement("stock:" + productId);
    }

    //Tang so luong san pham trong kho (rollback)
    public void incrementStock(String productId) {
        redisTemplate.opsForValue().increment("stock:" + productId);
    }

    //Luu order
    public void saveOrder(String orderId, String orderData) {
        redisTemplate.opsForValue().set(orderId, orderData);
    }

    //Xoa gio hang
    public void deleteCart(String userId) {
        redisTemplate.delete("cart:" + userId);
    }
}
