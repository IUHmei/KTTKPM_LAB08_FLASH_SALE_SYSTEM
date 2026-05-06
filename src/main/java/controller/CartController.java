package controller;

import model.Cart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService service;

    @PostMapping("/add")
    public Cart addToCart(
            @RequestParam String userId,
            @RequestParam String productId,
            @RequestParam int quantity
    ) {
        return service.addToCart(userId, productId, quantity);
    }

    @GetMapping
    public Cart getCart(@RequestParam String userId) {
        return service.getCart(userId);
    }
}