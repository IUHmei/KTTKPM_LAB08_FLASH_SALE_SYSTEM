package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

	@Autowired
	private StringRedisTemplate redisTemplate;

	@Override
	public void run(String... args) throws Exception {
		// Tạo dummy data cho 2 sản phẩm mẫu
		// Key: stock:{id}, Value: số lượng
		redisTemplate.opsForValue().setIfAbsent("stock:1", "100"); // Sản phẩm 1 có 100 món
		redisTemplate.opsForValue().setIfAbsent("stock:2", "50"); // Sản phẩm 2 có 50 món
		redisTemplate.opsForValue().setIfAbsent("stock:iphone", "69");

		System.out.println(">>> Đã khởi tạo kho hàng ảo trên Redis!");
	}
}