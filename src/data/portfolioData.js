export const EXPERIENCES_DATA = [
  {
    id: 'vpower',
    company: 'VPOWER LOGISTICS',
    badgeClass: 'bg-emerald-300 text-zinc-900',
    role: 'Mobile Application Developer',
    period: 'September 2026 – Present',
    isCurrent: true,
    projects: [
      {
        title: '1. VPower Logistics – Driver & Trucking App',
        description:
          'Working on the Driver and Trucking mobile application where customers and fleet owners can track their loads, assigned drivers, live routes, and end-to-end journey status in real time.'
      }
    ]
  },
  {
    id: 'trapigo',
    company: 'TRAPIGO',
    badgeClass: 'bg-yellow-300 text-zinc-900',
    role: 'Mobile Engineer',
    period: 'Apr 2025 – Mar 2026',
    isCurrent: false,
    projects: [
      {
        title: '1. Dhaba 29 – Franchisee Management App',
        description:
          'Built franchise inventory, billing, orders, stock tracking, and staff attendance modules. Implemented role-based access control (RBAC) for owners, managers, and staff, Dio REST APIs with offline caching, and Firebase FCM stock alerts.'
      },
      {
        title: '2. Uthix – E-Learning & E-Commerce App',
        description:
          'Engineered live classes, e-commerce store, real-time chat, and subscription management. Integrated Razorpay checkout/refunds, Twilio & Fast2SMS WhatsApp-style OTP login, and Zego Cloud live streaming & screen sharing.'
      }
    ]
  }
];

export const PROJECTS_DATA = [
  {
    id: 'dhaba29',
    dateLabel: 'APR 2025 – MAR 2026',
    title: 'Dhaba 29 – Franchisee Management App',
    subtitle: 'Making multi-outlet franchise inventory, billing & RBAC feel effortless.',
    category: 'production',
    badge: 'FLUTTER • BLOC • DIO • FCM',
    cardGradient: 'from-amber-500 via-orange-500 to-rose-600',
    screenPreviewTitle: 'Outlet Inventory & RBAC',
    screenPreviewStat: '₹1,48,200 • 84 Orders',
    summary:
      'End-to-end franchise operations platform handling real-time inventory, multi-outlet billing, order workflows, stock tracking, and staff attendance with role-based access control.',
    architecture:
      '[Flutter UI] ⇄ [BLoC / Cubit State] ⇄ [Dio Interceptor + Offline Cache] ⇄ [REST APIs + Firebase FCM]',
    bullets: [
      'Developed a franchise management application for inventory, billing, orders, stock tracking, and staff attendance.',
      'Implemented role-based access control (RBAC) for franchise owners, store managers, and floor staff.',
      'Integrated REST APIs using Dio with token authentication, centralized error handling, and offline caching.',
      'Added real-time low-stock alerts and instant push notifications using Firebase Cloud Messaging (FCM).'
    ],
    tech: ['Flutter', 'Dart', 'BLoC', 'REST APIs', 'Dio', 'Firebase', 'FCM', 'Offline Caching']
  },
  {
    id: 'uthix',
    dateLabel: 'APR 2025 – MAR 2026',
    title: 'Uthix – E-Learning & E-Commerce App',
    subtitle: 'Combining live video classes, e-commerce checkout & real-time chat in one app.',
    category: 'production',
    badge: 'FLUTTER • ZEGO CLOUD • RAZORPAY',
    cardGradient: 'from-indigo-600 via-blue-600 to-sky-500',
    screenPreviewTitle: 'Zego Cloud Live + Razorpay',
    screenPreviewStat: '248 Live • Instant OTP',
    summary:
      'Unified mobile platform combining interactive live video classes, screen sharing, educational e-commerce store, real-time classroom chat, and recurring subscription management.',
    architecture:
      '[Flutter Multi-Module UI] ⇄ [GetX Controllers] ⇄ [Zego Cloud RTC + Razorpay SDK + Twilio/Fast2SMS OTP]',
    bullets: [
      'Developed an application combining live classes, e-commerce, real-time chat, and subscription management.',
      'Integrated Razorpay for secure payments, cart checkout, order management, and automated refunds.',
      'Built WhatsApp-style mobile number authentication with SMS OTP verification using Twilio and Fast2SMS.',
      'Implemented live video streaming, interactive chat, and instructor screen sharing using Zego Cloud.'
    ],
    tech: ['Flutter', 'GetX', 'Razorpay', 'Zego Cloud', 'REST APIs', 'Firebase', 'Twilio', 'Fast2SMS']
  },
  {
    id: 'delivery',
    dateLabel: 'FREELANCE CASE STUDY',
    title: 'E-Commerce App – Live Delivery Tracking',
    subtitle: 'Real-time rider geolocation, route rendering & live ETA calculation.',
    category: 'fullstack',
    badge: 'GOOGLE MAPS SDK • GEOLOCATION',
    cardGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    screenPreviewTitle: 'Live Rider GPS Stream',
    screenPreviewStat: '4 mins ETA • 1.1 km',
    summary:
      'Real-time order fulfillment and delivery tracking mobile application enabling customers to watch their delivery partner move live on the map with dynamic distance and ETA updates.',
    architecture:
      '[Flutter Map View] ⇄ [Geolocation Stream + Permission Handler] ⇄ [Google Maps SDK + REST APIs]',
    bullets: [
      'Built an e-commerce application as a freelance project, allowing users to view their delivery partner’s live location in real time.',
      'Integrated Google Maps SDK and geolocation APIs to display live route tracking and real-time distance to the user.',
      'Handled fine/coarse location permissions, background location updates, and smooth custom marker rendering within a clean Flutter architecture.'
    ],
    tech: ['Flutter', 'Google Maps SDK', 'Geolocation API', 'Live Location Tracking', 'Distance/ETA Calculation', 'REST APIs']
  },
  {
    id: 'chat',
    dateLabel: 'FULL-STACK MOBILE + BACKEND',
    title: 'Chat Application – Real-Time Messaging & Calling',
    subtitle: 'WhatsApp-style OTP auth, 1-to-1 WebSocket chat & audio/video calls on Python & FastAPI.',
    category: 'fullstack',
    badge: 'FLUTTER • FASTAPI • WEBSOCKET',
    cardGradient: 'from-pink-600 via-rose-600 to-purple-700',
    screenPreviewTitle: 'FastAPI WebSocket Chat',
    screenPreviewStat: 'Audio/Video Call Ready',
    summary:
      'Full-stack real-time communicator featuring WhatsApp-style SMS OTP onboarding, username search, friend requests, instant WebSocket messaging, and integrated audio/video calling.',
    architecture:
      '[Flutter + BLoC/Cubit] ⇄ [WebSocket + REST Client] ⇄ [Custom FastAPI (Python) Backend + Twilio/Fast2SMS]',
    bullets: [
      'Developed a real-time chat application with WhatsApp-style mobile number registration and login, secured with SMS OTP verification via Twilio and Fast2SMS.',
      'Implemented username-based user search and bilateral friend request management.',
      'Built one-to-one real-time messaging between connected users, backed by a custom Python & FastAPI backend.',
      'Integrated real-time audio and video calling and managed call states across Flutter and FastAPI services.'
    ],
    tech: ['Flutter', 'BLoC/Cubit', 'FastAPI', 'Python', 'WebSocket', 'Twilio', 'Fast2SMS', 'Audio/Video Calling']
  }
];

export const SKILLS_DATA = [
  {
    title: 'Mobile Development & UI',
    group: 'mobile',
    tapeColor: 'bg-yellow-200',
    items: ['Flutter', 'Dart', 'Android', 'iOS', 'Cross-Platform Development', 'Responsive UI']
  },
  {
    title: 'State Management & Architecture',
    group: 'mobile',
    tapeColor: 'bg-emerald-200',
    items: ['Clean Architecture', 'MVVM', 'MVC', 'BLoC / Cubit', 'Riverpod', 'Provider', 'GetX']
  },
  {
    title: 'Backend & API Engineering',
    group: 'backend',
    tapeColor: 'bg-pink-200',
    items: ['FastAPI', 'Python', 'REST API Development', 'REST APIs', 'Dio', 'WebSockets', 'Socket.io', 'JWT Sessions']
  },
  {
    title: 'Location, Maps & Real-Time Media',
    group: 'integrations',
    tapeColor: 'bg-sky-200',
    items: ['Google Maps SDK', 'Geolocation API', 'Live Location Tracking', 'Distance/ETA Calculation', 'Zego Cloud', 'Live Streaming', 'Real-Time Chat']
  },
  {
    title: 'Firebase, Auth & Payments',
    group: 'integrations',
    tapeColor: 'bg-amber-200',
    items: ['Razorpay', 'Payment Gateway Integration', 'Firebase Authentication', 'Firestore', 'FCM (Push Notifications)', 'Cloud Storage', 'Twilio', 'Fast2SMS', 'OTP/SMS Verification']
  },
  {
    title: 'Local Storage, CI/CD & Languages',
    group: 'devops',
    tapeColor: 'bg-purple-200',
    items: ['Hive', 'SQLite', 'SharedPreferences', 'Secure Storage', 'Git & GitHub', 'GitHub Actions (CI/CD)', 'Postman', 'Unit Testing', 'Play Store Deployment', 'APK/AAB Signing', 'Kotlin', 'C++', 'Python']
  }
];

