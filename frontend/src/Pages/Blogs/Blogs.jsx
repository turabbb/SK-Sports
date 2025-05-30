import React, { useState, useEffect } from 'react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);

  // Sports news sources that provide RSS/API access
  const sportsSources = [
    {
      name: 'ESPN',
      baseUrl: 'https://www.espn.com/espn/rss/news',
      category: 'sports'
    },
    {
      name: 'BBC Sport',
      baseUrl: 'http://feeds.bbci.co.uk/sport/rss.xml',
      category: 'sports'
    },
    {
      name: 'Sky Sports',
      baseUrl: 'https://www.skysports.com/rss/12040',
      category: 'football'
    }
  ];

  // Mock sports blog data with realistic content that cycles weekly
  const mockSportsBlogs = [
    // Week 1 - Football Focus
    [
      {
        id: 1,
        title: "Champions League Quarter-Finals: Dark Horses to Watch",
        subtitle: "Football Analysis",
        excerpt: "Breaking down the unexpected teams that could shake up Europe's elite competition this season.",
        imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=250&fit=crop",
        date: "2025-05-28",
        source: "ESPN FC",
        url: "https://www.espn.com/soccer/",
        category: "Football"
      },
      {
        id: 2,
        title: "NBA Playoffs: Statistical Breakdown of MVP Candidates",
        subtitle: "Basketball Analytics",
        excerpt: "Deep dive into advanced metrics revealing the true impact players in this year's playoffs.",
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop",
        date: "2025-05-27",
        source: "The Athletic",
        url: "https://theathletic.com/nba/",
        category: "Basketball"
      },
      {
        id: 3,
        title: "Tennis Grand Slam Preview: Clay Court Specialists Rise",
        subtitle: "Tennis Insights",
        excerpt: "Analyzing the unique challenges and opportunities of the clay court season ahead.",
        imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=250&fit=crop",
        date: "2025-05-26",
        source: "Tennis.com",
        url: "https://www.tennis.com/",
        category: "Tennis"
      },
      {
        id: 4,
        title: "Formula 1: Aerodynamic Innovations Changing the Game",
        subtitle: "Motorsport Technology",
        excerpt: "How new regulations are pushing teams to revolutionary design solutions.",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8676c2feab?w=400&h=250&fit=crop",
        date: "2025-05-25",
        source: "F1.com",
        url: "https://www.formula1.com/",
        category: "Formula 1"
      }
    ],
    // Week 2 - Olympic Sports Focus
    [
      {
        id: 5,
        title: "Swimming World Records: The Science Behind Speed",
        subtitle: "Olympic Sports",
        excerpt: "Exploring the biomechanics and training methods driving record-breaking performances.",
        imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=250&fit=crop",
        date: "2025-05-24",
        source: "Swimming World",
        url: "https://www.swimmingworldmagazine.com/",
        category: "Swimming"
      },
      {
        id: 6,
        title: "Track and Field: Rising Stars to Watch This Season",
        subtitle: "Athletics Preview",
        excerpt: "Highlighting emerging talent set to make waves in upcoming competitions.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
        date: "2025-05-23",
        source: "World Athletics",
        url: "https://worldathletics.org/",
        category: "Athletics"
      },
      {
        id: 7,
        title: "Cycling Tour Predictions: Mountain Stages Analysis",
        subtitle: "Cycling Strategy",
        excerpt: "Breaking down the key climbs that will determine this year's grand tour winners.",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8676c2feab?w=400&h=250&fit=crop",
        date: "2025-05-22",
        source: "Cycling News",
        url: "https://www.cyclingnews.com/",
        category: "Cycling"
      },
      {
        id: 8,
        title: "Golf Major Championships: Course Management Secrets",
        subtitle: "Golf Strategy",
        excerpt: "Pro insights on how course design influences major championship outcomes.",
        imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=250&fit=crop",
        date: "2025-05-21",
        source: "Golf Digest",
        url: "https://www.golfdigest.com/",
        category: "Golf"
      }
    ],
    // Week 3 - Team Sports Focus
    [
      {
        id: 9,
        title: "Baseball Analytics: The Evolution of Pitching Strategy",
        subtitle: "Baseball Analysis",
        excerpt: "How data-driven approaches are revolutionizing pitching rotations and bullpen usage.",
        imageUrl: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=250&fit=crop",
        date: "2025-05-20",
        source: "MLB.com",
        url: "https://www.mlb.com/",
        category: "Baseball"
      },
      {
        id: 10,
        title: "Hockey Playoffs: Goaltending Masterclass Analysis",
        subtitle: "Hockey Insights",
        excerpt: "Examining the crucial role of elite goaltending in championship runs.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
        date: "2025-05-19",
        source: "NHL.com",
        url: "https://www.nhl.com/",
        category: "Hockey"
      },
      {
        id: 11,
        title: "Rugby World Cup Preview: Defensive Strategies Decoded",
        subtitle: "Rugby Tactics",
        excerpt: "Breaking down the defensive systems that could determine tournament success.",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop",
        date: "2025-05-18",
        source: "World Rugby",
        url: "https://www.world.rugby/",
        category: "Rugby"
      },
      {
        id: 12,
        title: "Volleyball Championships: Serve and Attack Combinations",
        subtitle: "Volleyball Strategy",
        excerpt: "Tactical analysis of how top teams coordinate their offensive systems.",
        imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop",
        date: "2025-05-17",
        source: "FIVB",
        url: "https://www.fivb.com/",
        category: "Volleyball"
      }
    ],
    // Week 4 - Extreme Sports Focus
    [
      {
        id: 13,
        title: "Extreme Sports: The Psychology of Risk-Taking Athletes",
        subtitle: "Sports Psychology",
        excerpt: "Understanding the mental framework behind extreme sports performance.",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop",
        date: "2025-05-16",
        source: "Outside Magazine",
        url: "https://www.outsideonline.com/",
        category: "Extreme Sports"
      },
      {
        id: 14,
        title: "Surfing Big Waves: Equipment Innovation and Safety",
        subtitle: "Water Sports",
        excerpt: "How cutting-edge gear is pushing the boundaries of big wave surfing.",
        imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop",
        date: "2025-05-15",
        source: "Surfer Magazine",
        url: "https://www.surfer.com/",
        category: "Surfing"
      },
      {
        id: 15,
        title: "Mountain Climbing: High-Altitude Training Techniques",
        subtitle: "Adventure Sports",
        excerpt: "Scientific approaches to acclimatization and performance at extreme altitudes.",
        imageUrl: "https://images.unsplash.com/photo-1464822759844-d150065c142c?w=400&h=250&fit=crop",
        date: "2025-05-14",
        source: "Climbing Magazine",
        url: "https://www.climbing.com/",
        category: "Climbing"
      },
      {
        id: 16,
        title: "Skateboarding Olympics: Street vs Park Competition Styles",
        subtitle: "Action Sports",
        excerpt: "Comparing the technical demands and judging criteria of different skateboarding disciplines.",
        imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop",
        date: "2025-05-13",
        source: "Thrasher Magazine",
        url: "https://www.thrashermagazine.com/",
        category: "Skateboarding"
      }
    ]
  ];

  // Calculate which week we're in (cycles every 4 weeks)
  const calculateCurrentWeek = () => {
    const startDate = new Date('2025-05-01'); // Start date for cycling
    const currentDate = new Date();
    const weeksDiff = Math.floor((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000));
    return weeksDiff % 4; // Cycle through 4 weeks of content
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        
        // Calculate current week
        const week = calculateCurrentWeek();
        setCurrentWeek(week);
        
        // In a real implementation, you would fetch from actual sports APIs
        // For now, we'll use our mock data that cycles weekly
        setTimeout(() => {
          setBlogs(mockSportsBlogs[week]);
          setLoading(false);
        }, 1000); // Simulate API call delay
        
      } catch (err) {
        setError('Failed to fetch sports blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogClick = (blog) => {
    // Open the original article in a new tab
    window.open(blog.url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className='blog__container section__container'>
        <h2 className='section__header'>Inside the Game</h2>
        <p className='section__subheader mb-12'>Your Ultimate Destination for Expert Tips, Gear Reviews, and the Latest Sports Trends</p>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12'>
          {[...Array(4)].map((_, index) => (
            <div key={index} className='blog__card animate-pulse'>
              <div className='bg-gray-300 h-48 w-full rounded-t-lg'></div>
              <div className='blog__card__content p-4'>
                <div className='h-4 bg-gray-300 rounded mb-2'></div>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-4 bg-gray-300 rounded w-1/2'></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='blog__container section__container'>
        <h2 className='section__header'>Inside the Game</h2>
        <p className='section__subheader mb-12'>Your Ultimate Destination for Expert Tips, Gear Reviews, and the Latest Sports Trends</p>
        <div className='text-center py-12'>
          <p className='text-red-500 mb-4'>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className='blog__container section__container'>
      <h2 className='section__header'>Inside the Game</h2>
      <p className='section__subheader mb-12'>Your Ultimate Destination for Expert Tips, Gear Reviews, and the Latest Sports Trends</p>
      

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12'>
        {blogs.map((blog) => (
          <article 
            key={blog.id} 
            className='blog__card cursor-pointer hover:scale-105 transition-all duration-300 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl'
            onClick={() => handleBlogClick(blog)}
          >
            <div className='relative overflow-hidden'>
              <img 
                src={blog.imageUrl} 
                alt={blog.title}
                className='w-full h-48 object-cover transition-transform duration-300 hover:scale-110'
                loading="lazy"
              />
            </div>

            <div className='blog__card__content p-5'>
              <h6 className='text-blue-600 font-semibold text-sm mb-2 uppercase tracking-wide'>
                {blog.subtitle}
              </h6>
              <h4 className='font-bold text-lg mb-3 leading-tight hover:text-blue-600 transition-colors line-clamp-2'>
                {blog.title}
              </h4>
              <p className='text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3'>
                {blog.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Blogs;