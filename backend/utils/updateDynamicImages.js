const { pool } = require('../config/db');

const updateDynamicImages = async () => {
  try {
    console.log('Fetching all products...');
    const [products] = await pool.query('SELECT id, name FROM products');

    console.log(`Found ${products.length} products. Updating images dynamically...`);

    for (let product of products) {
      // Create a heavily stylized and specific prompt for the AI image generator
      // Emphasizing "Indian" and "Indo-Chinese" as requested.
      const prompt = `Delicious Authentic Indian Indo-Chinese ${product.name}, premium restaurant food photography, highly detailed, dramatic lighting, 4k`;
      const encodedPrompt = encodeURIComponent(prompt);
      
      // We add a random seed based on the product ID so the image doesn't constantly change on every render, but stays unique.
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${product.id * 10}`;

      await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [imageUrl, product.id]);
      console.log(`Updated image for: ${product.name}`);
    }

    console.log('\nAll product images successfully updated to unique Indian food representations!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating images:', err);
    process.exit(1);
  }
};

updateDynamicImages();
