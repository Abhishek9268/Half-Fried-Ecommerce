const { pool } = require('../config/db');

const updateImages = async () => {
  try {
    console.log('Updating images in database...');
    
    // Pasta
    await pool.query('UPDATE products p JOIN categories c ON p.category_id = c.id SET p.image_url = "/images/creamy_pasta.png" WHERE c.name = "Pasta"');
    
    // Fries
    await pool.query('UPDATE products p JOIN categories c ON p.category_id = c.id SET p.image_url = "/images/loaded_fries.png" WHERE c.name = "Fries"');
    
    // Momos
    await pool.query('UPDATE products p JOIN categories c ON p.category_id = c.id SET p.image_url = "/images/steam_momos.png" WHERE c.name = "Momos"');
    
    // Noodles
    await pool.query('UPDATE products SET image_url = "/images/hakka_noodles.png" WHERE name LIKE "%Noodles%"');
    
    // Fried Rice
    await pool.query('UPDATE products SET image_url = "/images/fried_rice.png" WHERE name LIKE "%Fried Rice%"');
    
    // Special Chicken / Lollipop / Strips
    await pool.query('UPDATE products p JOIN categories c ON p.category_id = c.id SET p.image_url = "/images/chicken_lollipop.png" WHERE c.name = "Half Fried Special"');
    
    // Combos
    await pool.query('UPDATE products p JOIN categories c ON p.category_id = c.id SET p.image_url = "/images/fried_rice_combo.png" WHERE c.name = "Combos"');

    console.log('Images updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating images', err);
    process.exit(1);
  }
};

updateImages();
