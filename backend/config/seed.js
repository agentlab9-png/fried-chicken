require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Branch = require('../models/Branch');

const menuItemsData = [
  // ─── Crispy ─────────────────────────────────────────────
  {
    name: { ar: 'قطعة دجاج كريسبي', en: 'Crispy Chicken Piece', ku: 'پارچەیەک مریشکی کریسپی' },
    description: { ar: 'قطعة دجاج مقرمشة وطازجة', en: 'Fresh crispy chicken piece', ku: 'پارچەیەک مریشکی کریسپی تازە' },
    category: 'crispy', price: 2500, icon: '🍗', badge: 'popular', sortOrder: 1,
  },
  {
    name: { ar: 'وجبة 2 قطعة كريسبي', en: '2-Piece Crispy Meal', ku: 'خواردنی 2 پارچە کریسپی' },
    description: { ar: '2 قطعة دجاج كريسبي مع بطاطا وبيبسي', en: '2 crispy pieces with fries and Pepsi', ku: '2 پارچە کریسپی لەگەڵ پەتاتە و پێپسی' },
    category: 'crispy', price: 7000, icon: '🍗', sortOrder: 2,
  },
  {
    name: { ar: 'وجبة 3 قطع كريسبي', en: '3-Piece Crispy Meal', ku: 'خواردنی 3 پارچە کریسپی' },
    description: { ar: '3 قطع دجاج كريسبي مع بطاطا وبيبسي وكول سلو', en: '3 crispy pieces with fries, Pepsi and coleslaw', ku: '3 پارچە کریسپی لەگەڵ پەتاتە و پێپسی و کۆڵسلاو' },
    category: 'crispy', price: 10000, icon: '🍗', badge: 'popular', sortOrder: 3,
  },
  {
    name: { ar: 'ساندويتش كريسبي', en: 'Crispy Sandwich', ku: 'ساندویچی کریسپی' },
    description: { ar: 'ساندويتش دجاج كريسبي مع خس وصلصة خاصة', en: 'Crispy chicken sandwich with lettuce and special sauce', ku: 'ساندویچی مریشکی کریسپی لەگەڵ کاهوو و سۆسی تایبەت' },
    category: 'crispy', price: 5000, icon: '🥪', badge: 'new', sortOrder: 4,
  },
  {
    name: { ar: 'سبايسي ريزو', en: 'Spicy Rizo', ku: 'سپایسی ریزۆ' },
    description: { ar: 'رز مع دجاج حار وصلصة سبايسي - للشجعان فقط!', en: 'Rice with spicy chicken and spicy sauce - for the brave!', ku: 'برنج لەگەڵ مریشکی تووند و سۆسی سپایسی - تەنها بۆ ئازادارەکان!' },
    category: 'crispy', price: 6500, icon: '🌶️', badge: 'spicy', sortOrder: 5,
  },
  {
    name: { ar: 'وجبة أجنحة (6 قطع)', en: 'Wings Meal (6 pcs)', ku: 'خواردنی باڵ (6 پارچە)' },
    description: { ar: '6 قطع أجنحة مقرمشة مع صلصة', en: '6 crispy wings with sauce', ku: '6 پارچە باڵی کریسپی لەگەڵ سۆس' },
    category: 'crispy', price: 7500, icon: '🍗', sortOrder: 6,
  },
  {
    name: { ar: 'وجبة ستربس (5 قطع)', en: 'Strips Meal (5 pcs)', ku: 'خواردنی ستریپس (5 پارچە)' },
    description: { ar: '5 قطع ستربس مع بطاطا وصلصة', en: '5 strips with fries and sauce', ku: '5 پارچە ستریپس لەگەڵ پەتاتە و سۆس' },
    category: 'crispy', price: 8000, icon: '🍗', sortOrder: 7,
  },

  // ─── Family ─────────────────────────────────────────────
  {
    name: { ar: 'باكت عائلي 8 قطع', en: 'Family Bucket 8 pcs', ku: 'باکتی خێزانی 8 پارچە' },
    description: { ar: '8 قطع دجاج كريسبي - مثالي للعائلة الصغيرة', en: '8 crispy chicken pieces - perfect for a small family', ku: '8 پارچە مریشکی کریسپی - گونجاو بۆ خێزانی بچووک' },
    category: 'family', price: 18000, icon: '🪣', badge: 'popular', sortOrder: 10,
  },
  {
    name: { ar: 'باكت عائلي 12 قطعة', en: 'Family Bucket 12 pcs', ku: 'باکتی خێزانی 12 پارچە' },
    description: { ar: '12 قطعة دجاج كريسبي مع بطاطا عائلي وكول سلو', en: '12 crispy pieces with family fries and coleslaw', ku: '12 پارچە مریشکی کریسپی لەگەڵ پەتاتەی خێزانی و کۆڵسلاو' },
    category: 'family', price: 25000, icon: '🪣', sortOrder: 11,
  },
  {
    name: { ar: 'باكت عائلي 16 قطعة', en: 'Family Bucket 16 pcs', ku: 'باکتی خێزانی 16 پارچە' },
    description: { ar: '16 قطعة دجاج كريسبي مع 2 بطاطا عائلي و2 كول سلو و4 بيبسي', en: '16 crispy pieces with 2 family fries, 2 coleslaw and 4 Pepsi', ku: '16 پارچە کریسپی لەگەڵ 2 پەتاتەی خێزانی و 2 کۆڵسلاو و 4 پێپسی' },
    category: 'family', price: 35000, icon: '🪣', badge: 'popular', sortOrder: 12,
  },
  {
    name: { ar: 'وجبة تجمع العائلة', en: 'Family Gathering Meal', ku: 'خواردنی کۆبوونەوەی خێزانی' },
    description: { ar: '20 قطعة كريسبي + 3 بطاطا عائلي + 3 كول سلو + 6 بيبسي', en: '20 crispy pieces + 3 family fries + 3 coleslaw + 6 Pepsi', ku: '20 پارچە کریسپی + 3 پەتاتەی خێزانی + 3 کۆڵسلاو + 6 پێپسی' },
    category: 'family', price: 45000, icon: '🎉', badge: 'new', sortOrder: 13,
  },

  // ─── Sides ──────────────────────────────────────────────
  {
    name: { ar: 'بطاطا مقلية', en: 'French Fries', ku: 'پەتاتەی سوورکراو' },
    description: { ar: 'بطاطا مقلية مقرمشة', en: 'Crispy french fries', ku: 'پەتاتەی سوورکراوی کریسپی' },
    category: 'sides', price: 2000, icon: '🍟', sortOrder: 20,
  },
  {
    name: { ar: 'بطاطا عائلي', en: 'Family Fries', ku: 'پەتاتەی خێزانی' },
    description: { ar: 'حصة بطاطا كبيرة للعائلة', en: 'Large family-size fries', ku: 'پەتاتەی قەبارەی خێزانی گەورە' },
    category: 'sides', price: 4000, icon: '🍟', sortOrder: 21,
  },
  {
    name: { ar: 'كول سلو', en: 'Coleslaw', ku: 'کۆڵسلاو' },
    description: { ar: 'سلطة كول سلو طازجة', en: 'Fresh coleslaw salad', ku: 'سەڵاتەی کۆڵسلاوی تازە' },
    category: 'sides', price: 1500, icon: '🥗', sortOrder: 22,
  },
  {
    name: { ar: 'ذرة', en: 'Corn', ku: 'گەنمەشامی' },
    description: { ar: 'ذرة حلوة', en: 'Sweet corn', ku: 'گەنمەشامی شیرین' },
    category: 'sides', price: 1500, icon: '🌽', sortOrder: 23,
  },
  {
    name: { ar: 'بيبسي', en: 'Pepsi', ku: 'پێپسی' },
    description: { ar: 'مشروب غازي بارد', en: 'Cold soft drink', ku: 'نووشینەوەی سارد' },
    category: 'sides', price: 1000, icon: '🥤', sortOrder: 24,
  },
  {
    name: { ar: 'صلصة إضافية', en: 'Extra Sauce', ku: 'سۆسی زیادە' },
    description: { ar: 'صلصة حسب اختيارك (كاتشب، ثوم، حار)', en: 'Sauce of your choice (ketchup, garlic, hot)', ku: 'سۆسی هەڵبژاردنی خۆت (کاتشپ، سیر، تووند)' },
    category: 'sides', price: 500, icon: '🫙', sortOrder: 25,
  },
];

const branchesData = [
  {
    name: { ar: 'فرع زيونة', en: 'Zayouna Branch', ku: 'لقی زەیتوون' },
    area: { ar: 'زيونة - بغداد', en: 'Zayouna - Baghdad', ku: 'زەیتوون - بەغدا' },
    phone: '0773 336 6656', address: 'زيونة، بغداد، العراق',
    location: { lat: 33.3388, lng: 44.4310 },
    workingHours: { open: '11:00', close: '23:00' }, isOpen: true, sortOrder: 1,
  },
  {
    name: { ar: 'فرع شارع فلسطين', en: 'Palestine St. Branch', ku: 'لقی شەقامی فەلەستین' },
    area: { ar: 'شارع فلسطين - بغداد', en: 'Palestine Street - Baghdad', ku: 'شەقامی فەلەستین - بەغدا' },
    phone: '0773 336 6656', address: 'شارع فلسطين، بغداد، العراق',
    location: { lat: 33.3350, lng: 44.4200 },
    workingHours: { open: '11:00', close: '23:00' }, isOpen: true, sortOrder: 2,
  },
  {
    name: { ar: 'فرع كرادة خارج', en: 'Karrada Kharij Branch', ku: 'لقی کەرادەی دەرەوە' },
    area: { ar: 'كرادة خارج - بغداد', en: 'Karrada Kharij - Baghdad', ku: 'کەرادەی دەرەوە - بەغدا' },
    phone: '0773 336 6656', address: 'كرادة خارج، بغداد، العراق',
    location: { lat: 33.3030, lng: 44.4060 },
    workingHours: { open: '11:00', close: '23:00' }, isOpen: true, sortOrder: 3,
  },
  {
    name: { ar: 'فرع السيدية', en: 'Saydiya Branch', ku: 'لقی سەیدیە' },
    area: { ar: 'السيدية - بغداد', en: 'Saydiya - Baghdad', ku: 'سەیدیە - بەغدا' },
    phone: '0773 336 6656', address: 'السيدية، بغداد، العراق',
    location: { lat: 33.2800, lng: 44.3600 },
    workingHours: { open: '11:00', close: '23:00' }, isOpen: true, sortOrder: 4,
  },
  {
    name: { ar: 'فرع الجادرية', en: 'Jadriya Branch', ku: 'لقی جادریە' },
    area: { ar: 'الجادرية - بغداد', en: 'Jadriya - Baghdad', ku: 'جادریە - بەغدا' },
    phone: '0773 336 6656', address: 'الجادرية، بغداد، العراق',
    location: { lat: 33.2750, lng: 44.3900 },
    workingHours: { open: '11:00', close: '23:00' }, isOpen: true, sortOrder: 5,
  },
  {
    name: { ar: 'فرع المنصور', en: 'Mansour Branch', ku: 'لقی مەنسوور' },
    area: { ar: 'المنصور - بغداد', en: 'Mansour - Baghdad', ku: 'مەنسوور - بەغدا' },
    phone: '0773 336 6656', address: 'المنصور، بغداد، العراق',
    location: { lat: 33.3150, lng: 44.3500 },
    workingHours: { open: '11:00', close: '23:00' }, isOpen: true, sortOrder: 6,
  },
  {
    name: { ar: 'فرع الاعظمية', en: 'Adhamiya Branch', ku: 'لقی ئەعزەمیە' },
    area: { ar: 'الاعظمية - بغداد', en: 'Adhamiya - Baghdad', ku: 'ئەعزەمیە - بەغدا' },
    phone: '0773 336 6656', address: 'الاعظمية، بغداد، العراق',
    location: { lat: 33.3600, lng: 44.3800 },
    workingHours: { open: '11:00', close: '23:00' }, isOpen: true, sortOrder: 7,
  },
  {
    name: { ar: 'فرع شارع الربيع', en: 'Al-Rabie St. Branch', ku: 'لقی شەقامی ڕەبیع' },
    area: { ar: 'شارع الربيع - بغداد', en: 'Al-Rabie Street - Baghdad', ku: 'شەقامی ڕەبیع - بەغدا' },
    phone: '0773 336 6656', address: 'شارع الربيع، بغداد، العراق',
    location: { lat: 33.3100, lng: 44.3700 },
    workingHours: { open: '11:00', close: '23:00' }, isOpen: true, sortOrder: 8,
  },
  {
    name: { ar: 'فرع شارع 62', en: 'Street 62 Branch', ku: 'لقی شەقامی 62' },
    area: { ar: 'شارع 62 - بغداد', en: 'Street 62 - Baghdad', ku: 'شەقامی 62 - بەغدا' },
    phone: '0773 336 6656', address: 'شارع 62، بغداد، العراق',
    location: { lat: 33.3200, lng: 44.3600 },
    workingHours: { open: '11:00', close: '23:00' }, isOpen: true, sortOrder: 9,
  },
  {
    name: { ar: 'فرع بغداد مول', en: 'Baghdad Mall Branch', ku: 'لقی بەغدا مۆڵ' },
    area: { ar: 'بغداد مول - بغداد', en: 'Baghdad Mall - Baghdad', ku: 'بەغدا مۆڵ - بەغدا' },
    phone: '0773 336 6656', address: 'بغداد مول، بغداد، العراق',
    location: { lat: 33.3000, lng: 44.3400 },
    workingHours: { open: '10:00', close: '22:00' }, isOpen: true, sortOrder: 10,
  },
  {
    name: { ar: 'فرع المنصور مول', en: 'Mansour Mall Branch', ku: 'لقی مەنسوور مۆڵ' },
    area: { ar: 'المنصور مول - بغداد', en: 'Mansour Mall - Baghdad', ku: 'مەنسوور مۆڵ - بەغدا' },
    phone: '0773 336 6656', address: 'المنصور مول، بغداد، العراق',
    location: { lat: 33.3180, lng: 44.3450 },
    workingHours: { open: '10:00', close: '22:00' }, isOpen: true, sortOrder: 11,
  },
  {
    name: { ar: 'فرع زيونة مول', en: 'Zayouna Mall Branch', ku: 'لقی زەیتوون مۆڵ' },
    area: { ar: 'زيونة مول - بغداد', en: 'Zayouna Mall - Baghdad', ku: 'زەیتوون مۆڵ - بەغدا' },
    phone: '0773 336 6656', address: 'زيونة مول، بغداد، العراق',
    location: { lat: 33.3400, lng: 44.4350 },
    workingHours: { open: '10:00', close: '22:00' }, isOpen: true, sortOrder: 12,
  },
];

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set. Create a .env file in the backend directory.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed Admin
    const existingAdmin = await User.findOne({ username: 'Agentlab9@gmail.com' });
    if (!existingAdmin) {
      await User.create({
        username: 'Agentlab9@gmail.com',
        password: 'AliAhmed87879596',
        name: 'Admin',
        role: 'admin',
        isActive: true,
      });
      console.log('Admin account created.');
    } else {
      console.log('Admin account already exists.');
    }

    // Seed Menu Items
    const existingMenu = await MenuItem.countDocuments();
    if (existingMenu === 0) {
      await MenuItem.insertMany(menuItemsData);
      console.log(`${menuItemsData.length} menu items created.`);
    } else {
      console.log(`Menu items already exist (${existingMenu} items). Skipping.`);
    }

    // Seed Branches
    const existingBranches = await Branch.countDocuments();
    if (existingBranches === 0) {
      await Branch.insertMany(branchesData);
      console.log(`${branchesData.length} branches created.`);
    } else {
      console.log(`Branches already exist (${existingBranches} branches). Skipping.`);
    }

    console.log('\nSeed completed successfully!');
    console.log('Admin: Agentlab9@gmail.com');
    console.log(`Menu Items: ${await MenuItem.countDocuments()}`);
    console.log(`Branches: ${await Branch.countDocuments()}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
