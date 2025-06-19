import { db } from './db';
import { courses, products, announcements, timetable } from '../shared/schema';

export async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Insert sample courses
    const sampleCourses = [
      {
        id: crypto.randomUUID(),
        title: 'Digital Art Fundamentals',
        description: 'Learn the basics of digital art creation using industry-standard tools',
        price: 4999,
        duration: '6 weeks',
        level: 'beginner',
        instructor: 'Sarah Chen',
        featured: true,
        enrolledStudents: 45,
      },
      {
        id: crypto.randomUUID(),
        title: 'Advanced Oil Painting',
        description: 'Master advanced oil painting techniques with classical and contemporary approaches',
        price: 7999,
        duration: '12 weeks',
        level: 'advanced',
        instructor: 'Marco Rossini',
        featured: true,
        enrolledStudents: 23,
      },
      {
        id: crypto.randomUUID(),
        title: 'Watercolor Landscapes',
        description: 'Create stunning landscape paintings using watercolor techniques',
        price: 3999,
        duration: '8 weeks',
        level: 'intermediate',
        instructor: 'Emma Thompson',
        featured: false,
        enrolledStudents: 67,
      },
    ];

    await db.insert(courses).values(sampleCourses);

    // Insert sample products
    const sampleProducts = [
      {
        id: crypto.randomUUID(),
        title: 'Professional Watercolor Paint Set',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop',
        price: 2499,
        originalPrice: 3999,
        inStock: true,
        category: 'Art Supplies',
        description: 'High-quality watercolor paints for professional artists',
      },
      {
        id: crypto.randomUUID(),
        title: 'Premium Canvas Set - Various Sizes',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop',
        price: 1899,
        originalPrice: 2999,
        inStock: true,
        category: 'Canvas & Paper',
        description: 'Professional canvas set in multiple sizes',
      },
      {
        id: crypto.randomUUID(),
        title: 'Acrylic Paint Brushes Collection',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop',
        price: 1299,
        originalPrice: 1899,
        inStock: false,
        category: 'Brushes',
        description: 'Complete set of acrylic paint brushes',
      },
    ];

    await db.insert(products).values(sampleProducts);

    // Insert sample announcements
    const sampleAnnouncements = [
      {
        id: crypto.randomUUID(),
        title: 'New Course Alert: Digital Art Mastery',
        content: 'We are excited to announce our new digital art course starting next month. Early bird discount available!',
        type: 'info',
        targetAudience: 'all',
        isActive: true,
        isPinned: true,
      },
      {
        id: crypto.randomUUID(),
        title: 'Art Supply Sale - 30% Off',
        content: 'Limited time offer on all art supplies. Perfect time to stock up on your favorite materials!',
        type: 'important',
        targetAudience: 'all',
        isActive: true,
        isPinned: false,
      },
    ];

    await db.insert(announcements).values(sampleAnnouncements);

    // Insert sample timetable
    const sampleTimetable = [
      {
        id: crypto.randomUUID(),
        dayOfWeek: 'Monday',
        timeSlot: '09:00 AM',
        subject: 'Digital Art',
        className: 'Beginner Class',
        teacher: 'Sarah Chen',
      },
      {
        id: crypto.randomUUID(),
        dayOfWeek: 'Monday',
        timeSlot: '02:00 PM',
        subject: 'Oil Painting',
        className: 'Advanced Class',
        teacher: 'Marco Rossini',
      },
      {
        id: crypto.randomUUID(),
        dayOfWeek: 'Wednesday',
        timeSlot: '10:00 AM',
        subject: 'Watercolor',
        className: 'Intermediate Class',
        teacher: 'Emma Thompson',
      },
    ];

    await db.insert(timetable).values(sampleTimetable);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    console.log('Seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}