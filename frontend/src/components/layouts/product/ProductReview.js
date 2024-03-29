import React from 'react';

const ProductReview = ({ reviews }) => {
  return (
    <div>
      <div class="reviews w-75">
        <h3>Other's Reviews:</h3>
        <hr />
        {reviews &&
          reviews.map((review, idx) => (
            <div key={idx} class="review-card my-3">
              <div class="rating-outer">
                <div
                  class="rating-inner"
                  style={{ width: `${(review.rating / 5) * 100}` }}
                ></div>
              </div>
              <p class="review_user">by {review.user.name}</p>
              <p class="review_comment">{review.comment}</p>

              <hr />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductReview;
