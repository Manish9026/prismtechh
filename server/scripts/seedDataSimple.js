const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prismtech');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define schemas inline
const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Web App','CMS','Cybersecurity','Cloud'], required: true },
  image: { type: String },
  images: [{ type: String }],
  link: { type: String },
  clientName: { type: String },
  clientEmail: { type: String },
  timeline: { type: String },
  status: { type: String, enum: ['Draft', 'In Progress', 'Completed', 'Archived'], default: 'Draft' },
  featured: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const PricingTierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  billingPeriod: { type: String, enum: ['monthly', 'yearly', 'one-time', 'custom'], default: 'monthly' },
  features: [{
    text: { type: String, required: true },
    included: { type: Boolean, default: true },
    highlight: { type: Boolean, default: false }
  }],
  popular: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  color: { type: String, default: '#8b5cf6' },
  icon: { type: String },
  buttonText: { type: String, default: 'Get Started' },
  buttonLink: { type: String },
  limitations: [{ type: String }],
  addOns: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
  }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema({
  logo: { type: String },
  favicon: { type: String },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: { type: String }
  },
  social: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String }
  },
  home: {
    headline: { type: String },
    tagline: { type: String },
    ctas: [{ label: String, href: String }],
    background: { type: String }
  },
  about: {
    mission: { type: String },
    vision: { type: String },
    values: [{ title: String, description: String }]
  },
  testimonials: [{
    name: { type: String },
    role: { type: String },
    content: { type: String },
    rating: { type: Number }
  }]
}, { timestamps: true });

// Create models
const Service = mongoose.model('Service', ServiceSchema);
const Project = mongoose.model('Project', ProjectSchema);
const PricingTier = mongoose.model('PricingTier', PricingTierSchema);
const TeamMember = mongoose.model('TeamMember', TeamMemberSchema);
const Settings = mongoose.model('Settings', SettingsSchema);

async function seedServices() {
  console.log('Seeding services...');
  
  const services = [
    {
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies including React, Node.js, and cloud infrastructure.',
      icon: '🚀',
      featured: true,
      order: 1
    },
    {
      title: 'CMS Solutions',
      description: 'Content management systems tailored to your business needs with easy-to-use admin panels.',
      icon: '📝',
      featured: true,
      order: 2
    },
    {
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your digital assets and ensure data integrity.',
      icon: '🛡️',
      featured: true,
      order: 3
    },
    {
      title: 'Cloud & DevOps',
      description: 'Scalable cloud infrastructure and automated deployment pipelines for optimal performance.',
      icon: '☁️',
      featured: false,
      order: 4
    },
    {
      title: 'AI Integration',
      description: 'Artificial intelligence solutions to automate processes and enhance user experiences.',
      icon: '🤖',
      featured: false,
      order: 5
    },
    {
      title: 'Custom Software',
      description: 'Bespoke software solutions designed specifically for your unique business requirements.',
      icon: '⚙️',
      featured: false,
      order: 6
    }
  ];

  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log('✅ Services seeded successfully');
}

async function seedProjects() {
  console.log('Seeding projects...');
  
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with advanced features including inventory management, payment processing, and analytics dashboard.',
      category: 'Web App',
      clientName: 'TechStore Inc.',
      clientEmail: 'contact@techstore.com',
      timeline: '4 months',
      status: 'Completed',
      featured: true,
      link: 'https://github.com/prismtech/ecommerce-platform',
      order: 1
    },
    {
      title: 'Healthcare CMS',
      description: 'Custom content management system for healthcare providers with patient data management and appointment scheduling.',
      category: 'CMS',
      clientName: 'MediCare Solutions',
      clientEmail: 'info@medicare.com',
      timeline: '3 months',
      status: 'Completed',
      featured: true,
      link: 'https://github.com/prismtech/healthcare-cms',
      order: 2
    },
    {
      title: 'Security Audit Tool',
      description: 'Comprehensive security auditing platform with vulnerability scanning and compliance reporting.',
      category: 'Cybersecurity',
      clientName: 'SecureCorp',
      clientEmail: 'security@securecorp.com',
      timeline: '6 months',
      status: 'In Progress',
      featured: true,
      order: 3
    },
    {
      title: 'Cloud Migration',
      description: 'Complete migration of legacy systems to AWS with automated CI/CD pipelines and monitoring.',
      category: 'Cloud',
      clientName: 'Enterprise Corp',
      clientEmail: 'it@enterprise.com',
      timeline: '5 months',
      status: 'Completed',
      featured: false,
      order: 4
    },
    {
      title: 'AI Chatbot',
      description: 'Intelligent customer service chatbot with natural language processing and machine learning capabilities.',
      category: 'Web App',
      clientName: 'ServicePro',
      clientEmail: 'hello@servicepro.com',
      timeline: '2 months',
      status: 'Completed',
      featured: false,
      order: 5
    },
    {
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication and real-time transaction processing.',
      category: 'Web App',
      clientName: 'BankTech',
      clientEmail: 'mobile@banktech.com',
      timeline: '8 months',
      status: 'In Progress',
      featured: false,
      order: 6
    }
  ];

  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log('✅ Projects seeded successfully');
}

async function seedPricing() {
  console.log('Seeding pricing tiers...');
  
  const pricingTiers = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses and startups looking to establish their online presence.',
      price: 999,
      currency: 'USD',
      billingPeriod: 'one-time',
      features: [
        { text: 'Up to 5 pages', included: true, highlight: true },
        { text: 'Responsive design', included: true, highlight: false },
        { text: 'Basic SEO optimization', included: true, highlight: false },
        { text: 'Contact form', included: true, highlight: false },
        { text: '1 revision round', included: true, highlight: false },
        { text: 'Basic analytics', included: true, highlight: false },
        { text: 'Email support', included: true, highlight: false }
      ],
      popular: false,
      featured: true,
      color: '#3b82f6',
      icon: '💼',
      buttonText: 'Get Started',
      buttonLink: '/contact',
      limitations: [
        'No e-commerce functionality',
        'Basic customization only',
        'Standard hosting included'
      ],
      addOns: [
        { name: 'E-commerce Integration', price: 500, description: 'Add online store functionality' },
        { name: 'Advanced SEO', price: 300, description: 'Enhanced SEO optimization' }
      ],
      order: 1
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses that need advanced features and customization options.',
      price: 2999,
      currency: 'USD',
      billingPeriod: 'one-time',
      features: [
        { text: 'Up to 15 pages', included: true, highlight: true },
        { text: 'Custom design', included: true, highlight: true },
        { text: 'Advanced animations', included: true, highlight: true },
        { text: 'E-commerce integration', included: true, highlight: true },
        { text: 'Advanced SEO', included: true, highlight: false },
        { text: 'Analytics dashboard', included: true, highlight: false },
        { text: '3 revision rounds', included: true, highlight: false },
        { text: 'Priority support', included: true, highlight: false },
        { text: 'Content management system', included: true, highlight: false }
      ],
      popular: true,
      featured: true,
      color: '#8b5cf6',
      icon: '🚀',
      buttonText: 'Choose Professional',
      buttonLink: '/contact',
      limitations: [
        'Standard hosting included',
        'Basic maintenance plan'
      ],
      addOns: [
        { name: 'Custom Integrations', price: 800, description: 'Third-party service integrations' },
        { name: 'Advanced Analytics', price: 400, description: 'Enhanced tracking and reporting' },
        { name: 'Mobile App', price: 2000, description: 'Companion mobile application' }
      ],
      order: 2
    },
    {
      name: 'Enterprise',
      description: 'Comprehensive solution for large organizations with complex requirements and high traffic.',
      price: 6999,
      currency: 'USD',
      billingPeriod: 'one-time',
      features: [
        { text: 'Unlimited pages', included: true, highlight: true },
        { text: 'Custom architecture', included: true, highlight: true },
        { text: 'Advanced security', included: true, highlight: true },
        { text: 'Scalable infrastructure', included: true, highlight: true },
        { text: 'API development', included: true, highlight: true },
        { text: 'Advanced integrations', included: true, highlight: false },
        { text: 'Performance optimization', included: true, highlight: false },
        { text: 'Unlimited revisions', included: true, highlight: false },
        { text: 'Dedicated support', included: true, highlight: false },
        { text: 'Training & documentation', included: true, highlight: false }
      ],
      popular: false,
      featured: true,
      color: '#10b981',
      icon: '💎',
      buttonText: 'Contact Sales',
      buttonLink: '/contact',
      limitations: [],
      addOns: [
        { name: 'White-label Solution', price: 3000, description: 'Rebrandable platform' },
        { name: 'Custom Mobile Apps', price: 5000, description: 'iOS and Android applications' },
        { name: 'AI Integration', price: 4000, description: 'Machine learning capabilities' }
      ],
      order: 3
    }
  ];

  await PricingTier.deleteMany({});
  await PricingTier.insertMany(pricingTiers);
  console.log('✅ Pricing tiers seeded successfully');
}

async function seedTeam() {
  console.log('Seeding team members...');
  
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Lead Developer',
      bio: 'Full-stack developer with 10+ years of experience in web technologies and team leadership.',
      order: 1
    },
    {
      name: 'Sarah Chen',
      role: 'UI/UX Designer',
      bio: 'Creative designer specializing in user experience and modern interface design.',
      order: 2
    },
    {
      name: 'Mike Rodriguez',
      role: 'DevOps Engineer',
      bio: 'Cloud infrastructure specialist with expertise in AWS, Docker, and CI/CD pipelines.',
      order: 3
    },
    {
      name: 'Emily Davis',
      role: 'Security Specialist',
      bio: 'Cybersecurity expert focused on application security and compliance.',
      order: 4
    }
  ];

  await TeamMember.deleteMany({});
  await TeamMember.insertMany(teamMembers);
  console.log('✅ Team members seeded successfully');
}

async function seedSettings() {
  console.log('Seeding settings...');
  
  const settings = {
    logo: null,
    favicon: null,
    seo: {
      title: 'Prism Tech - Shaping the Future of Web Development',
      description: 'Professional web development services with cutting-edge technology. Custom solutions for modern businesses.',
      keywords: 'web development, custom software, cybersecurity, cloud solutions, AI integration'
    },
    social: {
      facebook: 'https://facebook.com/prismtech',
      twitter: 'https://twitter.com/prismtech',
      linkedin: 'https://linkedin.com/company/prismtech',
      instagram: 'https://instagram.com/prismtech'
    },
    home: {
      headline: 'Prism Tech – Shaping the Future of Web Development',
      tagline: 'Transform your digital presence with cutting-edge technology and innovative solutions.',
      ctas: [
        { label: 'Explore Services', href: '/services' },
        { label: 'View Our Work', href: '/projects' },
        { label: 'Get Started', href: '/contact' }
      ],
      background: null
    },
    about: {
      mission: 'To deliver exceptional digital solutions that drive business growth and innovation.',
      vision: 'To be the leading technology partner for businesses worldwide, transforming ideas into reality.',
      values: [
        { title: 'Innovation', description: 'Pushing boundaries with cutting-edge technology' },
        { title: 'Security', description: 'Protecting your data with enterprise-grade security' },
        { title: 'Excellence', description: 'Delivering quality solutions that exceed expectations' }
      ]
    },
    testimonials: [
      {
        name: 'John Smith',
        role: 'CEO, TechStart',
        content: 'Prism Tech delivered an exceptional web application that exceeded our expectations. Their attention to detail and technical expertise is unmatched.',
        rating: 5
      },
      {
        name: 'Lisa Wang',
        role: 'CTO, InnovateCorp',
        content: 'The team at Prism Tech transformed our legacy systems into a modern, scalable platform. Highly recommended for enterprise projects.',
        rating: 5
      },
      {
        name: 'David Brown',
        role: 'Founder, StartupXYZ',
        content: 'From concept to launch, Prism Tech guided us through every step. Their CMS solution has been a game-changer for our business.',
        rating: 5
      }
    ]
  };

  await Settings.deleteMany({});
  await Settings.create(settings);
  console.log('✅ Settings seeded successfully');
}

async function seedAll() {
  try {
    await connectDB();
    
    await seedServices();
    await seedProjects();
    await seedPricing();
    await seedTeam();
    await seedSettings();
    
    console.log('\n🎉 All sample data has been seeded successfully!');
    console.log('\nSample data includes:');
    console.log('✅ 6 Services (3 featured)');
    console.log('✅ 6 Projects (3 featured)');
    console.log('✅ 3 Pricing Tiers (all featured)');
    console.log('✅ 4 Team Members');
    console.log('✅ Complete Settings Configuration');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase connection closed.');
  }
}

// Run the seeding
seedAll();
