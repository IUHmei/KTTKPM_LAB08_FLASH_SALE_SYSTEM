package org.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class OrderController {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // API test Redis
    @GetMapping("/test")
    public String test() {
        redisTemplate.opsForValue().set("test", "ok");
        return redisTemplate.opsForValue().get("test");
    }

    // API checkout
    @PostMapping("/checkout")
    public OrderResponse checkout(@RequestParam String userId) {
        // 1. Lấy cart từ Redis
        String cartKey = "cart:" + userId;
        String cartJson = redisTemplate.opsForValue().get(cartKey);

        if (cartJson == null) {
            return new OrderResponse(false, null, "Cart is empty");
        }

        // 2. Tạo orderId
        String orderId = UUID.randomUUID().toString();

        // 3. Lưu order vào Redis (giả lập)
        String orderKey = "order:" + orderId;
        redisTemplate.opsForValue().set(orderKey, cartJson);

        // 4. Xóa cart sau khi đặt hàng
        redisTemplate.delete(cartKey);

        // 5. Trả về kết quả
        return new OrderResponse(true, orderId, "Order created successfully");
    }

    // DTO trả về kết quả order
    public static class OrderResponse {
        public boolean success;
        public String orderId;
        public String message;

        public OrderResponse(boolean success, String orderId, String message) {
            this.success = success;
            this.orderId = orderId;
            this.message = message;
        }

        // Getters/setters nếu cần
    }
}