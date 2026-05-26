const { pool } = require('../config/db');

const categories = [
  'Half Fried Special',
  'Pasta',
  'Fries',
  'Momos',
  'Noodles & Fried Rice',
  'Combos'
];

const menuItems = [
  // Half Fried Special
  { name: 'Paneer Peri Peri Strips', price: 220.00, categoryName: 'Half Fried Special', desc: 'Spicy peri peri marinated paneer strips' },
  { name: 'Kurkure Chaap', price: 220.00, categoryName: 'Half Fried Special', desc: 'Crispy and crunchy soya chaap' },
  { name: 'Chicken Peri Peri Strips', price: 230.00, categoryName: 'Half Fried Special', desc: 'Spicy peri peri marinated chicken strips' },
  { name: 'Chicken Lollipop', price: 290.00, categoryName: 'Half Fried Special', desc: 'Classic juicy chicken lollipops' },
  { name: 'KFC Chicken Lollipop', price: 360.00, categoryName: 'Half Fried Special', desc: 'Extra crispy KFC style chicken lollipops' },
  { name: 'Drums of Heaven', price: 370.00, categoryName: 'Half Fried Special', desc: 'Sweet and spicy glazed chicken drums' },

  // Pasta
  { name: 'Creamy White Sauce Pasta', price: 300.00, categoryName: 'Pasta', desc: 'Rich and creamy white sauce pasta' },
  { name: 'Makhani Sauce Pasta', price: 290.00, categoryName: 'Pasta', desc: 'Fusion pasta in rich makhani gravy' },
  { name: 'Veg Pasta in Butter Gravy', price: 240.00, categoryName: 'Pasta', desc: 'Vegetable pasta tossed in buttery tomato gravy' },
  { name: 'Butter Chicken Pasta', price: 280.00, categoryName: 'Pasta', desc: 'The ultimate fusion of butter chicken and pasta' },
  { name: 'Creamy Chicken White Sauce Pasta', price: 340.00, categoryName: 'Pasta', desc: 'Chicken pasta in rich creamy sauce' },
  { name: 'Makhani Chicken Sauce Pasta', price: 330.00, categoryName: 'Pasta', desc: 'Chicken pasta in authentic makhani sauce' },

  // Fries
  { name: 'Salted Fries', price: 110.00, categoryName: 'Fries', desc: 'Classic salted french fries' },
  { name: 'Peri Peri Fries', price: 120.00, categoryName: 'Fries', desc: 'Spicy peri peri tossed fries' },
  { name: 'Special Indian Masala Fries', price: 120.00, categoryName: 'Fries', desc: 'Fries tossed in special Indian spices' },
  { name: 'Fries in Tandoori Salsa Sauce', price: 130.00, categoryName: 'Fries', desc: 'Loaded fries with tandoori salsa' },
  { name: 'Cheesy Peri Peri Chatpata Fries', price: 130.00, categoryName: 'Fries', desc: 'Loaded cheesy and spicy fries' },
  { name: 'Paneer Makhani Fries', price: 220.00, categoryName: 'Fries', desc: 'Fries loaded with rich paneer makhani' },
  { name: 'Chicken Makhani Fries', price: 220.00, categoryName: 'Fries', desc: 'Fries loaded with rich butter chicken gravy' },

  // Momos (Using Full Price)
  { name: 'Veg Steam Momos (Full)', price: 120.00, categoryName: 'Momos', desc: 'Classic steamed vegetable momos' },
  { name: 'Paneer Steam Momos (Full)', price: 130.00, categoryName: 'Momos', desc: 'Steamed momos loaded with fresh paneer' },
  { name: 'Chicken Steam Momos (Full)', price: 130.00, categoryName: 'Momos', desc: 'Steamed momos stuffed with juicy minced chicken' },
  { name: 'Veg Fried Momos (Full)', price: 150.00, categoryName: 'Momos', desc: 'Crispy fried veg momos' },
  { name: 'Chicken Fried Momos (Full)', price: 160.00, categoryName: 'Momos', desc: 'Crispy fried chicken momos' },
  { name: 'Veg Kurkure Momos (Full)', price: 240.00, categoryName: 'Momos', desc: 'Extra crispy kurkure coated veg momos' },
  { name: 'Chicken Kurkure Momos (Full)', price: 260.00, categoryName: 'Momos', desc: 'Extra crispy kurkure coated chicken momos' },
  
  // Noodles & Fried Rice
  { name: 'Veg Hakka Noodles (Full)', price: 220.00, categoryName: 'Noodles & Fried Rice', desc: 'Wok tossed veg hakka noodles' },
  { name: 'Chicken Hakka Noodles (Full)', price: 270.00, categoryName: 'Noodles & Fried Rice', desc: 'Wok tossed chicken hakka noodles' },
  { name: 'Veg Fried Rice', price: 200.00, categoryName: 'Noodles & Fried Rice', desc: 'Classic wok-tossed veg fried rice' },
  { name: 'Chicken Fried Rice', price: 260.00, categoryName: 'Noodles & Fried Rice', desc: 'Wok-tossed chicken fried rice' },
  { name: 'Chicken Chilli Garlic Noodles (Full)', price: 290.00, categoryName: 'Noodles & Fried Rice', desc: 'Spicy garlic tossed chicken noodles' },

  // Combos
  { name: 'Veg Combo (Noodles/Rice + Gravy)', price: 250.00, categoryName: 'Combos', desc: 'Choice of veg noodles or rice coupled with Chilli Paneer or Manchurian' },
  { name: 'Non-Veg Combo (Noodles/Rice + Gravy)', price: 280.00, categoryName: 'Combos', desc: 'Choice of chicken noodles/rice coupled with Chilli Chicken or Hot Garlic Chicken' }
];

const seedDB = async () => {
  try {
    console.log('Clearing existing product data...');
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE table products');
    await pool.query('TRUNCATE table categories');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Inserting categories...');
    const catMap = {};
    for (let catName of categories) {
      const [res] = await pool.query('INSERT INTO categories (name) VALUES (?)', [catName]);
      catMap[catName] = res.insertId;
    }

    console.log('Inserting menu items...');
    for (let item of menuItems) {
      const catId = catMap[item.categoryName];
      await pool.query(
        'INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)',
        [item.name, item.desc, item.price, 100, catId]
      );
    }
    
    console.log('Database successfully seeded with Half Fried menu!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB', err);
    process.exit(1);
  }
};

seedDB();
