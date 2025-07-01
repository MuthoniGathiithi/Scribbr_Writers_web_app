const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
  res.render('index', {
    title: 'TypeScribr - Writing Platform',
    user: req.user
  });
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us',
    user: req.user
  });
});

// Contact page route
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    user: req.user
  });
});

// Privacy Policy route
router.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', {
    title: 'Privacy Policy',
    user: req.user
  });
});

// Service routes
router.get('/services/blog-writing', (req, res) => {
  res.render('services/blog-writing', {
    title: 'Blog Writing Services',
    user: req.user
  });
});

router.get('/services/content-creation', (req, res) => {
  res.render('services/content-creation', {
    title: 'Content Creation Services',
    user: req.user
  });
});

router.get('/services/product-descriptions', (req, res) => {
  res.render('services/product-descriptions', {
    title: 'Product Description Services',
    user: req.user
  });
});

router.get('/services/email-newsletters', (req, res) => {
  res.render('services/email-newsletters', {
    title: 'Email Newsletter Services',
    user: req.user
  });
});

// Assignments page route
router.get('/assignments', (req, res) => {
  // Mock data for assignments
  const assignments = [
    {
      id: 1,
      title: 'Blog Post on Digital Marketing',
      description: 'Write a 1000-word blog post about the latest digital marketing trends for 2025.',
      deadline: new Date('2025-06-15'),
      payment: 25,
      language: 'English'
    },
    {
      id: 2,
      title: 'Product Description for Tech Gadget',
      description: 'Create compelling product descriptions for a new line of smart home devices.',
      deadline: new Date('2025-06-10'),
      payment: 20,
      language: 'English'
    },
    {
      id: 3,
      title: 'Email Newsletter for Fashion Brand',
      description: 'Design and write content for a monthly newsletter for a premium fashion brand.',
      deadline: new Date('2025-06-20'),
      payment: 30,
      language: 'English'
    }
  ];
  
  res.render('assignments', {
    title: 'Available Assignments',
    user: req.user,
    assignments: assignments
  });
});

module.exports = router;
