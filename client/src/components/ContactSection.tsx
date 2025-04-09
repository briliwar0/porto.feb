import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertMessageSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { ContactFormValues } from '@/lib/types';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';
import SectionHeading from './ui/section-heading';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPinIcon, MailIcon, PhoneIcon, GlobeIcon, Stamp } from 'lucide-react';

// Extend the schema with more validation rules
const contactFormSchema = insertMessageSchema.extend({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(20, { message: 'Message must be at least 20 characters' }),
});

const ContactSection = () => {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: ContactFormValues) {
    mutation.mutate(data);
  }

  const socialIcons = {
    GitHub: 'github',
    LinkedIn: 'linkedin-in',
    Twitter: 'twitter',
    Dribbble: 'dribbble',
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-6 min-h-screen flex items-center relative">
      <div className="container mx-auto">
        <SectionHeading 
          title="Get In"
          highlightedText="Touch"
          description="I'm always open to new opportunities, collaborations, or just a friendly chat.
          Feel free to reach out through any of the channels below."
        />
        
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div 
            className="lg:w-2/5"
            variants={fadeIn('right')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="bg-white/5 dark:bg-dark/20 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold font-sans mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <MapPinIcon className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Location</h4>
                    <p className="text-muted-foreground">{PERSONAL_INFO.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <MailIcon className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email</h4>
                    <p className="text-muted-foreground">{PERSONAL_INFO.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <PhoneIcon className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Phone</h4>
                    <p className="text-muted-foreground">{PERSONAL_INFO.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <GlobeIcon className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Social Media</h4>
                    <div className="flex gap-4 mt-2">
                      {SOCIAL_LINKS.map((social) => (
                        <a 
                          key={social.platform} 
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                          aria-label={social.platform}
                        >
                          <i className={`fab fa-${social.icon}`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* LinkedIn Badge */}
                <div className="mt-8">
                  <h4 className="font-bold mb-3">LinkedIn Profile</h4>
                  <div className="linkedin-badge-container">
                    <div 
                      className="badge-base LI-profile-badge" 
                      data-locale="in_ID" 
                      data-size="medium" 
                      data-theme="dark" 
                      data-type="VERTICAL" 
                      data-vanity="muhammadfebriliantisna" 
                      data-version="v1"
                    >
                      <a 
                        className="badge-base__link LI-simple-link" 
                        href="https://id.linkedin.com/in/muhammadfebriliantisna?trk=profile-badge"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Muhammad Febrilian Tisna
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-3/5"
            variants={fadeIn('left')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="bg-white/5 dark:bg-dark/20 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold font-sans mb-6">Send me a message</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="name" 
                              className="bg-white/5 dark:bg-dark/30 border border-gray-300 dark:border-gray-700"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="name@example.com" 
                              type="email"
                              className="bg-white/5 dark:bg-dark/30 border border-gray-300 dark:border-gray-700"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Project Inquiry" 
                            className="bg-white/5 dark:bg-dark/30 border border-gray-300 dark:border-gray-700"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Hello, I'd like to discuss a project..." 
                            rows={5}
                            className="bg-white/5 dark:bg-dark/30 border border-gray-300 dark:border-gray-700"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Sending..." : "Send Message"} 
                    <Stamp className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
