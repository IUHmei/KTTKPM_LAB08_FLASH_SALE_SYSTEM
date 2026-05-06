package repository;

import model.Cart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RedisCartRepository {
    private static final String PREFIX = "cart:";

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public Cart getCart(String userId) {
        return (Cart) redisTemplate.opsForValue().get(PREFIX + userId);
    }

    public void saveCart(Cart cart) {
        redisTemplate.opsForValue().set(PREFIX + cart.getUserId(), cart);
    }
}
