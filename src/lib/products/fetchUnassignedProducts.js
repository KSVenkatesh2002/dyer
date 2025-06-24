// /lib/products/fetchUnassignedProducts.js

import Product from '@/models/product.model';

export async function fetchUnassignedProducts({ userId, field, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const filter = {
        createdBy: userId,
        [field]: false,
    };

    const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('productId createdAt nailsCount kolukkulu varasalu repeat numberOfSarees windingAssigned markingAssigned');

    const totalCount = await Product.countDocuments(filter);

    return {
        products,
        total: totalCount,
        hasMore: skip + products.length < totalCount,
    };
}
