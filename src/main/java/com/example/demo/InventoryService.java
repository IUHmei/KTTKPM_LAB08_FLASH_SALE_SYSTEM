package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {
	@Autowired
	private StringRedisTemplate redisTemplate;

	public Long decreaseStock(String productId, int quantity) {
		String key = "stock:" + productId;
		// Lệnh DECRBY của Redis là Atomic (nguyên tử), cực kỳ an toàn cho Flash Sale
		return redisTemplate.opsForValue().decrement(key, quantity);
	}

	public String getStock(String productId) {
		return redisTemplate.opsForValue().get("stock:" + productId);
	}
}