package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*") // Quan trọng: Để Frontend hoặc Service khác gọi được trong LAN
public class InventoryController {

	@Autowired
	private InventoryService inventoryService;

	// API kiểm tra tồn kho còn bao nhiêu
	@GetMapping("/stock/{productId}")
	public String getStock(@PathVariable String productId) {
		String stock = inventoryService.getStock(productId);
		return stock != null ? stock : "0";
	}

	// API thực hiện trừ kho
	// Người 4 (Order PU) sẽ gọi POST sang đây
	@PostMapping("/reduce/{productId}")
	public String reduceStock(@PathVariable String productId, @RequestParam int quantity) {
		Long remain = inventoryService.decreaseStock(productId, quantity);

		if (remain >= 0) {
			return "SUCCESS. Còn lại: " + remain;
		} else {
			// Nếu trừ xong mà < 0 nghĩa là hết hàng, cần bù lại (rollback)
			inventoryService.decreaseStock(productId, -quantity);
			return "FAILED. Không đủ hàng!";
		}
	}
}