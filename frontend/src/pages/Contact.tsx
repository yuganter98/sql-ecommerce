import { Mail, Phone, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';

const Contact = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 font-heading text-center">Contact Us</h1>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                Have a question or feedback? We'd love to hear from you. Fill out the form below or reach out to us directly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                            <Mail className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                            <p className="text-gray-600">support@luxe.com</p>
                            <p className="text-gray-600">partnerships@luxe.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                            <Phone className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                            <p className="text-gray-600">+1 (555) 123-4567</p>
                            <p className="text-sm text-gray-500">Mon-Fri, 9am-6pm EST</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                            <MapPin className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                            <p className="text-gray-600">123 Fashion Ave, Suite 100</p>
                            <p className="text-gray-600">New York, NY 10001</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <form className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none" placeholder="Your Name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none" placeholder="your@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none" placeholder="How can we help?"></textarea>
                    </div>
                    <Button className="w-full">Send Message</Button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
