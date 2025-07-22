import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  Truck,
  Shield,
  Headphones,
  ArrowRight,
  Play,
} from "lucide-react";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      title: "Wireless Noise-Canceling Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.8,
      badge: "Best Seller",
    },
    {
      id: 2,
      title: "Smart Fitness Watch",
      price: 199.99,
      originalPrice: 249.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.9,
      badge: "New",
    },
    {
      id: 3,
      title: "Professional Camera Lens",
      price: 599.99,
      originalPrice: 799.99,
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
      rating: 4.7,
      badge: "25% OFF",
    },
    {
      id: 4,
      title: "Gaming Mechanical Keyboard",
      price: 129.99,
      originalPrice: 179.99,
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
      rating: 4.6,
      badge: "Hot",
    },
  ];

  const categories = [
    {
      name: "Electronics",
      count: "2,547 items",
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Fashion",
      count: "1,834 items",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      name: "Home & Garden",
      count: "956 items",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Sports",
      count: "743 items",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  🎉 New Collection Available Now
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Discover Amazing
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Products
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Shop the latest trends and discover premium quality products
                  at unbeatable prices. Your perfect purchase is just a click
                  away.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/product"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Now
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">15K+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop"
                  alt="Hero Product"
                  width={600}
                  height={600}
                  className="rounded-3xl shadow-2xl"
                  unoptimized
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl rotate-12 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-float delay-1000"></div>
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl rotate-45 animate-float delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Free shipping on orders over $50. Fast and reliable delivery
                worldwide.
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600">
                100% secure payment with SSL encryption and fraud protection.
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200">
                <Headphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Round-the-clock customer support to help you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're
              looking for
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/category/${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70`}
                  ></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked products that our customers love most
              </p>
            </div>
            <Link
              href="/product"
              className="hidden sm:inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                      {product.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      ({product.rating})
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/product"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay Updated with Latest Offers
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to our newsletter and never miss out on exclusive deals
            and new arrivals
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none"
            />
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
