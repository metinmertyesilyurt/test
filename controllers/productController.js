const db = require('../db'); // Your database configuration and connection setup

// Display all products on the main page
exports.index = async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products ORDER BY id ASC');
    res.render('index', { products: products.rows, message: req.flash('info') });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error');
  }
};

// Display a single product page by ID
exports.show = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
      if (product.rows.length > 0) {
        res.render('product', { product: product.rows[0] });
      } else {
        // Product not found, redirect to the main page or show a 404 not found page
        res.status(404).send('Product not found');
      }
    } catch (error) {
      console.error(`Error fetching product with ID ${req.params.id}:`, error);
      res.status(500).send('Server error');
    }
  };
  

// Handle form submission from the product page
exports.submitForm = async (req, res) => {
  try {
    const { name, email, phone, productId } = req.body;
    // Encrypt the form data here before saving it to the database
    const encryptedName = encrypt(name); // Replace with your encryption logic
    const encryptedEmail = encrypt(email); // Replace with your encryption logic
    const encryptedPhone = encrypt(phone); // Replace with your encryption logic
    await db.query(
      'INSERT INTO form_submissions (name, email, phone, product_id) VALUES ($1, $2, $3, $4)',
      [encryptedName, encryptedEmail, encryptedPhone, productId]
    );
    req.flash('info', 'Your information has been submitted successfully.');
    res.redirect(`/product/${productId}`);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Server error');
  }
};

// Example encryption function, replace with actual encryption logic
function encrypt(data) {
  // Implement encryption logic here (e.g., using the 'crypto' module)
  return `encrypted_${data}`;
}

module.exports = exports;
