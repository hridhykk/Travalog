export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p>Email: info@avltravells.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400">Facebook</a>
              <a href="#" className="hover:text-primary-400">Instagram</a>
              <a href="#" className="hover:text-primary-400">Twitter</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p>&copy; 2024 AVL Travells. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};