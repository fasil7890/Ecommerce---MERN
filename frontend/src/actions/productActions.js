import axios from 'axios';
import {
  adminProductsFail,
  adminProductsRequest,
  adminProductsSuccess,
  productsFail,
  productsRequest,
  productsSuccess,
} from '../slices/productsSlice';
import {
  createReviewFail,
  createReviewRequest,
  createReviewSuccess,
  deleteProductFail,
  deleteProductRequest,
  deleteProductSuccess,
  deleteReviewFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  newProductFail,
  newProductRequest,
  newProductSuccess,
  productFail,
  productRequest,
  productSuccess,
  reviewFail,
  reviewRequest,
  reviewSuccess,
  updateProductFail,
  updateProductRequest,
  updateProductSuccess,
} from '../slices/productSlice';

export const getProducts =
  (keyword, price, category, currentPage, rating) => async (dispatch) => {
    try {
      dispatch(productsRequest());
      let link = `/api/v1/products?page=${currentPage}`;

      if (keyword) {
        link += `&keyword=${keyword}`;
      }

      if (price) {
        link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      }

      if (category) {
        link += `&category=${category}`;
      }

      // if(rating){
      //     link += `&ratings=${rating}`
      // }

      const { data } = await axios.get(link);
      dispatch(productsSuccess(data));
    } catch (error) {
      // handle Error
      dispatch(productsFail(error.response.data.message));
    }
  };

export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());
    const { data } = await axios.get(`/api/v1/product/${id}`);
    dispatch(productSuccess(data));
  } catch (error) {
    // handle Error
    dispatch(productFail(error.response.data.message));
  }
};

export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch(createReviewRequest());
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.put(`/api/v1/review`, reviewData, config);
    dispatch(createReviewSuccess(data));
  } catch (error) {
    // handle Error
    dispatch(createReviewFail(error.response.data.message));
  }
};

export const getAdminProducts = (dispatch) => {
  dispatch(adminProductsRequest());

  axios
    .get(`/api/v1/admin/products`)
    .then((response) => {
      dispatch(adminProductsSuccess(response.data));
    })
    .catch((error) => {
      dispatch(adminProductsFail());
    });
};

export const createNewProduct = (productData) => async (dispatch) => {
  try {
    dispatch(newProductRequest());
    const { data } = await axios.post(`/api/v1/admin/product/new`, productData);
    dispatch(newProductSuccess(data));
  } catch (error) {
    // handle Error
    dispatch(newProductFail(error.response.data.message));
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());
    await axios.delete(`/api/v1/admin/product/${id}`);
    dispatch(deleteProductSuccess());
  } catch (error) {
    // handle Error
    dispatch(deleteProductFail(error.response.data.message));
  }
};

export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());
    const { data } = await axios.put(
      `/api/v1/admin/product/${id}`,
      productData
    );
    dispatch(updateProductSuccess(data));
  } catch (error) {
    // handle Error
    dispatch(updateProductFail(error.response.data.message));
  }
};

export const getReviews = (id) => async (dispatch) => {
  try {
    dispatch(reviewRequest());

    const { data } = await axios.get(`/api/v1/admin/reviews`, {
      params: { id },
    });
    dispatch(reviewSuccess(data));
  } catch (error) {
    // handle Error
    dispatch(reviewFail(error.response.data.message));
  }
};

export const deleteReview = (productId, id) => async (dispatch) => {
  try {
    dispatch(deleteReviewRequest());

    await axios.delete(`/api/v1/admin/review`, { params: { productId, id } });
    dispatch(deleteReviewSuccess());
  } catch (error) {
    // handle Error
    dispatch(deleteReviewFail(error.response.data.message));
  }
};
