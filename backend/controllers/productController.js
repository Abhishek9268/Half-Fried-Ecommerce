const { pool } = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    let params = [];
    
    if (category) {
      params.push(category);
      query += ` AND c.name = ?`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND p.name LIKE ?`;
    }

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [id]
    );
    
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;
    const [insertResult] = await pool.query(
      'INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, image_url, category_id]
    );
    
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [insertResult.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image_url, category_id } = req.body;
    
    const [updateResult] = await pool.query(
      `UPDATE products 
       SET name = COALESCE(?, name), 
           description = COALESCE(?, description), 
           price = COALESCE(?, price), 
           stock = COALESCE(?, stock), 
           image_url = COALESCE(?, image_url), 
           category_id = COALESCE(?, category_id) 
       WHERE id = ?`,
      [name, description, price, stock, image_url, category_id, id]
    );

    if (updateResult.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
