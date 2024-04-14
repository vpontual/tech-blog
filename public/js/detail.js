document.addEventListener('DOMContentLoaded', function () {
  const updateForm = document.getElementById('updateForm');
  const deleteButton = document.getElementById('deleteButton');

  updateForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch(`/api/posts/${formData.get('postId')}`, {
      method: 'PUT', // Using PUT for update
      body: JSON.stringify({
        title: formData.get('title'),
        body: formData.get('body'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        alert('Failed to update post');
      }
    });
  });

  deleteButton.addEventListener('click', function () {
    const postId = this.dataset.postid;
    fetch(`/posts/${postId}/delete`, {
      method: 'DELETE', // Using DELETE for removal
    }).then((response) => {
      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        alert('Failed to delete post');
      }
    });
  });
});
