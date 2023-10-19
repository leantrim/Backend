export const up = async (db, client) => {
  // TODO write your migration here.
  // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  // Example:
  await db.createCollection("store");
  await db.collection("store").insertOne(initialData);
};

export const down = async (db, client) => {
  // TODO write the statements to rollback your migration (if possible)
  // Example:
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};

export const initialData = {
  name: "My Store",
  url: "www.mystore.com",
  logo: "www.mystore.com/logo.png",
  description: "This is a great store for shopping.",
  contactInfo: {
    email: "info@mystore.com",
    phone: "123-456-7890",
  },
  policies: {
    returnPolicy: "Returns accepted within 30 days.",
    shippingPolicy: "Free shipping on orders over $50.",
    privacyPolicy: "We respect your privacy and keep your data secure.",
  },
  socialLinks: {
    facebook: "www.facebook.com/mystore",
    instagram: "www.instagram.com/mystore",
    twitter: "www.twitter.com/mystore",
  },
  ratings: [
    {
      user: "User1",
      rating: 5,
      review: "Great store!",
      images: ["www.mystore.com/logo.png"],
    },
    {
      user: "User2",
      rating: 4,
      review: "Good products.",
      images: ["www.mystore.com/logo.png"],
    },
  ],
  categories: ["Electronics", "Books", "Clothing"],
  products: ["Product1", "Product2", "Product3"],
  orders: ["Order1", "Order2", "Order3"],
  type: "SINGLE_PRODUCT",
  seoMetaData: {
    title: "Some title",
    description: "Some description",
    keywords: ["Keywords"],
  },
};
