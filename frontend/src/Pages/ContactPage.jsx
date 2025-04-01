import React from "react";

const ContactPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen mt-[75px] ">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-2 text-lg">We'd love to hear from you! Reach out with any questions or feedback.</p>
      </div>

      {/* Contact Info Section */}
      <div className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="font-semibold text-lg">📍 Our Location</h3>
            <p className="mt-2">123 Food Street, Flavor Town, USA</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="font-semibold text-lg">📞 Phone</h3>
            <p className="mt-2">+1 234 567 890</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="font-semibold text-lg">📧 Email</h3>
            <p className="mt-2">support@recipeapp.com</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Send Us a Message</h2>
          <form className="bg-gray-200 p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea placeholder="Write your message..." rows="4" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-700 transition">Send Message</button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Find Us</h2>
        <div className="w-full max-w-3xl mx-auto h-64 bg-gray-300 rounded-lg flex items-center justify-center">
          <p className="text-gray-600">📍 Map Placeholder (Embed Google Maps here)</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
