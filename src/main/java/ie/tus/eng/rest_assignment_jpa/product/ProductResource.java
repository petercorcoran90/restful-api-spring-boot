package ie.tus.eng.rest_assignment_jpa.product;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


@RestController
public class ProductResource {
	
	private ProductRepository repository;
	
	@Autowired
	public ProductResource(ProductRepository repository) {
		this.repository = repository;
	}
		// GET
		@GetMapping("/products")
		public List<Product> retrieveAllProducts() {
			return repository.findAll();
		}

		// GET one Product
		@GetMapping("/products/{id}")
		public ResponseEntity<Product> retrieveProduct(@PathVariable int id) {
			Optional<Product> Product = repository.findById(id);

			if (Product.isEmpty()) {
				System.out.println("Product not found in the database");
				return ResponseEntity.notFound().build();
			} else {
				return ResponseEntity.ok(Product.get());
			}
		}

		// DELETE
		@DeleteMapping("/products/{id}")
		public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
			Optional<Product> Product = repository.findById(id);

			if (Product.isEmpty()) {
				System.out.println("Product not found in the database");
				return ResponseEntity.notFound().build();
			} else {
				repository.deleteById(id);
				return ResponseEntity.noContent().build();
			}
		}

		// DELETE ALL
		@DeleteMapping("/products")
		public ResponseEntity<Void> deleteAllProducts() {
			repository.deleteAll();
			return ResponseEntity.noContent().build();
		}

		// POST
		@PostMapping("/products")
		public ResponseEntity<Product> createProduct(@RequestBody Product Product) {
			Product savedProduct = repository.save(Product);

			// Get the URI of the created Product
			URI location = ServletUriComponentsBuilder.fromCurrentRequest() // gets the '/Products' part of the URI
					.path("/{id}") 											// appends '/{id}' to the path
					.buildAndExpand(savedProduct.getId()) 					// replaces {id} with the actual Product ID
					.toUri(); 												// converts to URI object

			// Return response status 201 (Created) with the location header
			return ResponseEntity.created(location).build();
		}
		
		// PUT
	    @PutMapping("/products/{id}")
	    public ResponseEntity<Product> editProduct(@PathVariable int id, @RequestBody Product productDetails) {
			Optional<Product> existingProduct = repository.findById(id);

	        if (existingProduct.isEmpty()) {
	            // If the Product does not exist, return 404 Not Found
	            return ResponseEntity.notFound().build();
	        } else {
	            // If the Product exists, update the details
	            Product product = existingProduct.get();
	            product.setName(productDetails.getName());
	            product.setDescription(productDetails.getDescription());
	            product.setPrice(productDetails.getPrice());
	            product.setQuantity(productDetails.getQuantity());

	            // Save the updated Product
	            Product updatedProduct = repository.save(product);
	            return ResponseEntity.ok(updatedProduct);
	        }
	    }


	
}
