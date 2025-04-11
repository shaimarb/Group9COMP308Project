import User from '../models/User.js';
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