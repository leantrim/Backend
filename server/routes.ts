import { API_ROUTES } from '@mediapartners/shared-types/types/Routes';
import express from 'express';
import user from '../routes/main/user';
import auth from '../routes/main/auth';
import site from '../routes/LandingPages/site';
import forms from '../routes/LandingPages/forms';
import upload from '../routes/Storage/upload';
import products from '../routes/ecommerce/stores/products';
import klarnaV3 from '../routes/ecommerce/Klarna/klarnaV3';
import store from '../routes/ecommerce/stores/stores';
import categories from '../routes/ecommerce/stores/categories';
import review from '../routes/ecommerce/stores/reviews';
import subPages from '../routes/ecommerce/stores/subPages';
import facebook from '../routes/ecommerce/Facebook/fbEvents';

const router = express.Router();

// Panel Routes
router.use(`/${API_ROUTES.PANEL_USERS}`, user);
router.use(`/${API_ROUTES.AUTH}`, auth);
router.use(`/${API_ROUTES.UPLOAD}`, upload);

// Landing Page routes
router.use(`/${API_ROUTES.LANDING_PAGE_SITES}`, site);
router.use(`/${API_ROUTES.LANDING_PAGE_FORMS}`, forms);

// E-Commerce Routes
router.use(`/${API_ROUTES.ECOMMERCE_PRODUCTS}`, products);
router.use(`/${API_ROUTES.KLARNA}`, klarnaV3);
router.use(`/${API_ROUTES.ECOMMERCE_SITES}`, store);
router.use(`/${API_ROUTES.ECOMMERCE_CATEGORIES}`, categories);
router.use(`/${API_ROUTES.ECOMMERCE_REVIEWS}`, review);
router.use(`/${API_ROUTES.ECOMMERCE_SUB_PAGES}`, subPages);
router.use('/api/fbEvents', facebook);

export default router;
