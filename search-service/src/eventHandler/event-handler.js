const e = require('express');
const Search = require('../models/search.model');
async function handlePostCreated(event) {
    try {
        const { postId, userId, title, content } = event;
        const searchQuery = new Search({
            post_id:event.postId,
            user_id:event.userId,    
            content:event.content,
      
        });
        await searchQuery.save();

        console.log(`Post Created: ${postId}, ${userId}, ${title}, ${content}`);
        // Here you can add logic to handle the post creation event, like saving it to a database
    } catch (error) {
        console.error('Error handling post created event:', error);
    }
    
}
async function handlePostDeleted(event) {
    try {
        const { postId } = event;
const deletedSearchQuery = await Search.findOneAndDelete({post_id:event.postId});
        if (!deletedSearchQuery) {
            console.log(`Post with ID ${postId} not found for deletion.`);
            return;
        }
        console.log(`Post deleted: ${postId}`);
        // Here you can add logic to handle the post creation event, like saving it to a database
    } catch (error) {
        console.error('Error handling post created event:', error);
    }
    
}
module.exports = {handlePostCreated,handlePostDeleted};