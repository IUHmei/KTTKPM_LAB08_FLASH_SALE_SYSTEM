package service;

import model.Cart;
import model.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.RedisCartRepository;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private RedisCartRepository repository;

    public Cart addToCart(String userId, String productId, int quantity) {

        Cart cart = repository.getCart(userId);

        if (cart == null) {
            cart = new Cart();
            cart.setUserId(userId);
        }

        Optional<CartItem> existing = cart.getItems()
                .stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setProductId(productId);
            item.setQuantity(quantity);
            cart.getItems().add(item);
        }

        repository.saveCart(cart);

        return cart;
    }

    public Cart getCart(String userId) {
        Cart cart = repository.getCart(userId);
        return cart != null ? cart : new Cart();
    }
}
