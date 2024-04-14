const router = require('express').Router();
const { Post, User } = require('../models');
const auth = require('../utils/auth');

// GET all posts for homepage
router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
      order: [['date_created', 'DESC']],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in || false,
    });
  } catch (err) {
    res.status(500).send('Error loading the homepage');
  }
});

// Dashboard Route
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userPosts = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
      order: [['date_created', 'DESC']],
    });

    // Serialize data so the template can read it
    const posts = userPosts.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('dashboard', {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    res.status(500).send('Error loading the dashboard.');
  }
});

// Get a single post
router.get('/posts/:id', auth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name'] }],
    });

    if (postData.user_id !== req.session.user_id) {
      res.status(403).send('Unauthorized to access this post');
      return;
    }

    const post = postData.get({ plain: true });

    res.render('detail', { post, logged_in: req.session.logged_in });
  } catch (error) {
    console.error('Failed to retrieve post:', error);
    res.status(500).send('Error loading post details.');
  }
});

// If the user is already logged in, redirect the user to the homepage
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
