import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Phone, Instagram, Youtube, Facebook, MessageSquare, Send, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/bluewarriors-logo.png';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const {
    toast
  } = useToast();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate form submission
    toast({
      title: "¡Mensaje enviado!",
      description: "Gracias por contactarnos. Te responderemos pronto."
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  const contactInfo = [{
    icon: Mail,
    title: "Email",
    value: "bluewarriors.fll@gmail.com",
    description: "Respuesta en 24-48 horas"
  }, {
    icon: MapPin,
    title: "Ubicación",
    value: "Santo Domingo, República Dominicana",
    description: "Entrenamientos presenciales"
  }, {
    icon: Phone,
    title: "WhatsApp",
    value: "+1 (809) 123-4567",
    description: "Contacto directo"
  }];
  const socialMedia = [{
    name: "Instagram",
    icon: Instagram,
    handle: "@bluewarriors_fll",
    url: "#",
    color: "hover:text-pink-500"
  }, {
    name: "YouTube",
    icon: Youtube,
    handle: "BlueWarriors FLL",
    url: "#",
    color: "hover:text-red-500"
  }, {
    name: "Facebook",
    icon: Facebook,
    handle: "BlueWarriors FIRST",
    url: "#",
    color: "hover:text-blue-600"
  }];
  return <section id="contacto" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            

            {/* Social Media */}
            

            {/* Call to Action */}
            
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <img src={logo} alt="BlueWarriors Logo" className="h-10 mx-auto sm:mx-0" />
              <p className="text-sm text-muted-foreground mt-2">
                FIRST LEGO League - República Dominicana
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 BlueWarriors. Inspirados por FIRST, construidos con pasión.
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;