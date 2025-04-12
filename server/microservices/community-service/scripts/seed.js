/*import User from '../models/User.js';
import CommunityPost from '../models/CommunityPost.js';
import { getSummary } from '../graphql/geminiResolver.js';

const catTypes = ['news', 'discussion'];

const staticPostsData = [
    // 3 posts for Outdoor / Safety category
    {
        title: "Staying Safe During Outdoor Adventures",
        content: "Before you head out into the wild, know how to stay safe. This post covers tips on emergency preparedness, proper hydration, and how to identify safe trails for hiking or camping.",
    },
    {
        title: "How to Prepare for Outdoor Emergencies",
        content: "Learn how to create a basic outdoor emergency kit, read weather signs, and deal with minor injuries while hiking or exploring. Safety is key to a successful outdoor experience.",
    },
    {
        title: "Wildlife Awareness and Trail Etiquette",
        content: "Respect nature while staying safe. This post teaches how to avoid wildlife encounters, keep a safe distance, and follow leave-no-trace principles while exploring the outdoors.",
    },

    // 3 posts for Food / Clothes Donation category
    {
        title: "How to Start a Local Food Drive",
        content: "Want to give back? Learn the steps to organize a food drive in your community, from partnering with shelters to setting up drop-off locations and promoting your campaign effectively.",
    },
    {
        title: "Why Clothes Donations Matter",
        content: "Your old clothes can change lives. Discover the impact of clothing donations and how to sort, clean, and donate items to local shelters or donation centers responsibly.",
    },
    {
        title: "Best Places to Donate in Your City",
        content: "Not sure where to donate? Here's a helpful guide to reputable local food banks, shelters, and clothing drives that are actively supporting people in need in your community.",
    },

    // 3 posts for Clean Up / Parks / Community category
    {
        title: "Organizing a Park Clean-Up Event",
        content: "Make a difference in your community by planning a clean-up day! This post explains how to gather volunteers, gather supplies, and coordinate with local officials for a successful event.",
    },
    {
        title: "The Importance of Keeping Parks Clean",
        content: "Parks are our shared spaces. Learn how pollution affects local wildlife and the community, and how small actions like picking up trash and spreading awareness can help keep them beautiful.",
    },
    {
        title: "Community Involvement: Small Acts, Big Impact",
        content: "Being part of your community means taking initiative. Discover how joining clean-up efforts, planting trees, or starting recycling projects can lead to lasting improvements in your neighborhood.",
    }
];


// Create a new user with role 'community_organizer'
const createUser = async () => {
    try {
        if (await User.findOne({ username: 'communityorg@domain.com'})!=null){
            console.log("Demo items already exists")
            return;
        } 
        const newUser = new User({
            username: 'communityorg',
            email: 'communityorg@email.com',
            password: 'password123', 
            role: 'community_organizer'
        });
//
        await newUser.save();
        console.log('User created successfully');

        // Fetch user by username to get its ID
        const user = await User.findOne({ username: 'communityorg' });

        if (!user) {
            console.log('User not found!');
            return;
        }

        console.log('User ID:', user.id);

        // Map through the static posts data and create discussions
        const posts = [];
        for (const postData of staticPostsData) {
            const { title, content } = postData;
            const random = Math.floor(Math.random() * catTypes.length);
            
            // Get the AI summary for each post using getSummary from geminiResolver
            const aiSummary = await getSummary(content);

            // Create a new post with the user ID
            const newPost = new CommunityPost({
                author: user.id,
                title,
                content,
                category: catTypes[random], 
                aiSummary
            });

            posts.push(newPost);
        }

        // Save all the posts to the database in one go
        await CommunityPost.insertMany(posts);
        console.log('9 community posts created and saved successfully');
    } catch (error) {
        console.error('Error during user or post creation:', error);
    }
};

export default createUser;
*/import User from '../models/User.js';
import CommunityPost from '../models/CommunityPost.js';
import BusinessProfile from '../models/BusinessProfile.js';
import { getSummary } from '../graphql/geminiResolver.js';

const catTypes = ['news', 'discussion'];

const staticPostsData = [
    {
        title: "Staying Safe During Outdoor Adventures",
        content: "Heading outdoors? Ensure you're prepared. This post shares advice on packing essentials like maps, hydration supplies, and basic first aid kits. It also covers how to recognize hazardous trail conditions and stay safe during unexpected weather or wildlife encounters."
    },
    {
        title: "How to Prepare for Outdoor Emergencies",
        content: "Emergencies in nature can arise without warning. Learn how to build a practical emergency kit, understand basic wilderness first aid, and assess potential dangers like dehydration, heatstroke, or getting lost on a trail. Being ready could save a life—maybe even yours."
    },
    {
        title: "Wildlife Awareness and Trail Etiquette",
        content: "While enjoying nature, it’s crucial to respect the environment and its creatures. This post teaches how to recognize animal habitats, avoid attracting wildlife, and follow responsible trail behavior such as yielding, staying on marked paths, and minimizing environmental impact."
    },
    {
        title: "How to Start a Local Food Drive",
        content: "Food insecurity affects more people than you think. Organize a local food drive by identifying community needs, collaborating with local organizations, setting clear goals, and promoting through social media and local networks. Small steps can lead to a big community impact."
    },
    {
        title: "Why Clothes Donations Matter",
        content: "Your gently-used clothing can bring warmth and dignity to others. Learn how to sort donations thoughtfully, choose the right centers, and understand the year-round impact these donations can make on homeless shelters, disaster relief centers, and struggling families in your city."
    },
    {
        title: "Best Places to Donate in Your City",
        content: "Not all donation centers are the same. This post highlights trusted local spots where your clothes, food, and other items will go directly to people in need. We provide guidance on hours, accepted items, and organizations with proven community outreach records and transparency."
    },
    {
        title: "Organizing a Park Clean-Up Event",
        content: "Want to beautify your neighborhood? A park clean-up is a great start. Learn how to gather volunteers, coordinate with your local council, and ensure safety during the event. From planning supplies to promotion, this guide walks you through creating a cleaner, greener space."
    },
    {
        title: "The Importance of Keeping Parks Clean",
        content: "Parks aren’t just pretty places—they’re vital for community health and local ecosystems. Learn how litter harms wildlife and soil quality, and how regular community action like clean-ups and awareness campaigns help preserve these spaces for future generations to enjoy."
    },
    {
        title: "Community Involvement: Small Acts, Big Impact",
        content: "Getting involved doesn’t always mean grand gestures. Volunteering at events, planting trees, helping seniors with recycling, or simply showing up to town hall meetings can create ripple effects. Community thrives when everyone contributes, even in small, meaningful ways."
    }
];

const createCommunityUserAndPosts = async () => {
    const [existingOrg, existingRes] = await Promise.all([
        User.findOne({ username: 'communityorg' }),
        User.findOne({ username: 'resident' })
    ]);

    let communityUser = existingOrg;
    if (!communityUser) {
        communityUser = new User({
            username: 'communityorg',
            email: 'communityorg@email.com',
            password: 'password123',
            role: 'community_organizer'
        });
        await communityUser.save();
        console.log('Community organizer user created');
    } else {
        console.log('Community organizer already exists');
    }

    let residentUser = existingRes;
    if (!residentUser) {
        residentUser = new User({
            username: 'resident',
            email: 'resident@email.com',
            password: 'password123',
            role: 'resident'
        });
        await residentUser.save();
        console.log('Resident user created');
    } else {
        console.log('Resident user already exists');
    }

    const authors = [communityUser._id, residentUser._id];
    const posts = [];

    for (const { title, content } of staticPostsData) {
        const category = catTypes[Math.floor(Math.random() * catTypes.length)];
        const aiSummary = await getSummary(content);
        const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

        posts.push(new CommunityPost({
            author: randomAuthor,
            title,
            content,
            category,
            aiSummary
        }));
    }

    await CommunityPost.insertMany(posts);
    console.log(`${posts.length} community posts seeded`);
};

const createBusinessOwnerAndProfiles = async () => {
    const existing = await User.findOne({ username: 'businessowner' });
    if (existing) {
        console.log('Business owner already exists');
        return;
    }

    const owner = new User({
        username: 'businessowner',
        email: 'businessowner@email.com',
        password: 'password123',
        role: 'business_owner'
    });

    await owner.save();
    console.log('Business owner user created');

    const profiles = [
        {
            name: 'Sunrise Cafe',
            description: 'A cozy neighborhood cafe offering fresh coffee, pastries, and vegan snacks.',
            category: 'Cafe / Food',
            address: '123 Brew St, CoffeeTown'
        },
        {
            name: 'Bright Minds Learning Centre',
            description: 'An after-school learning hub for kids aged 6-14, focused on STEM and creativity.',
            category: 'Education',
            address: '456 Learn Ave, EduCity'
        }
    ];

    for (const profile of profiles) {
        const newProfile = new BusinessProfile({
            author: owner._id,
            ...profile
        });
        await newProfile.save();
    }

    console.log('2 business profiles seeded');
};

const runSeeder = async () => {
    await createCommunityUserAndPosts();
    await createBusinessOwnerAndProfiles();
};

export default runSeeder;
