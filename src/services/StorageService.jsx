const STORAGE_KEYS = {
    ATTRACTIONS: 'savedAttractions',
    POSTS: 'savedPosts'
};

// Save an attraction to localStorage
export const saveAttraction = (attraction) => {
    try {
        const savedAttractions = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTRACTIONS) || '[]');
        
        // Check if attraction already exists
        if (!savedAttractions.some(item => item.attractionId === attraction.attractionId)) {
            savedAttractions.push({
                ...attraction,
                createdAt: new Date().toISOString() // Add timestamp for sorting
            });
            localStorage.setItem(STORAGE_KEYS.ATTRACTIONS, JSON.stringify(savedAttractions));
        }
        
        return savedAttractions.length;
    } catch (error) {
        console.error('Error saving attraction:', error);
        throw error;
    }
};

// Save a post to localStorage
export const savePost = (post) => {
    try {
        const savedPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
        
        // Check if post already exists
        if (!savedPosts.some(item => item.postId === post.postId)) {
            savedPosts.push({
                ...post,
                createdAt: new Date().toISOString() // Add timestamp for sorting
            });
            localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(savedPosts));
        }
        
        return savedPosts.length;
    } catch (error) {
        console.error('Error saving post:', error);
        throw error;
    }
};

// Get saved items by type
export const getSavedItems = (type) => {
    try {
        const key = type === 'attraction' ? STORAGE_KEYS.ATTRACTIONS : STORAGE_KEYS.POSTS;
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
        console.error('Error getting saved items:', error);
        throw error;
    }
};

// Remove item from storage
export const removeFromStorage = (type, id) => {
    try {
        const key = type === 'attraction' ? STORAGE_KEYS.ATTRACTIONS : STORAGE_KEYS.POSTS;
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        const idField = type === 'attraction' ? 'attractionId' : 'postId';
        
        const filteredItems = items.filter(item => item[idField] !== id);
        localStorage.setItem(key, JSON.stringify(filteredItems));
        
        return filteredItems.length;
    } catch (error) {
        console.error('Error removing item from storage:', error);
        throw error;
    }
};

// Check if an item is saved
export const isItemSaved = (type, id) => {
    try {
        const items = getSavedItems(type);
        const idField = type === 'attraction' ? 'attractionId' : 'postId';
        return items.some(item => item[idField] === id);
    } catch (error) {
        console.error('Error checking if item is saved:', error);
        throw error;
    }
};