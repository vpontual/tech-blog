const router = require('express').Router();
const { Post } = require('../../models');
const auth = require('../../utils/auth');

// CREATE a new post
router.post('/', auth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update a post
// router.put('/:id/update', auth, async (req, res) => {
//   try {
//     const { title, body } = req.body;
//     const postData = await Post.update(
//       { title, body },
//       {
//         where: {
//           id: req.params.id,
//           user_id: req.session.user_id,
//         },
//       },
//     );

//     if (postData) {
//       res.redirect('/dashboard');
//     } else {
//       res.status(404).send('Post not found');
//     }
//   } catch (error) {
//     console.error('Failed to update post:', error);
//     res.status(500).send('Error updating post.');
//   }
// });

router.put('/:id/update', auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    const [updatedRows] = await Post.update(
      { title, body },
      {
        where: { id: req.params.id, user_id: req.session.user_id },
        returning: true, // For Postgres, to get the updated row
      },
    );

    if (updatedRows) {
      // Send a success response with the updated post data
      res.status(200).json(updatedRows[0]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Failed to update post:', error);
    res.status(500).json({ error: 'Error updating post.' });
  }
});

// Delete a post
router.post('/:id/delete', auth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (postData) {
      res.redirect('/dashboard');
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error('Failed to delete post:', error);
    res.status(500).send('Error deleting post.');
  }
});

module.exports = router;
