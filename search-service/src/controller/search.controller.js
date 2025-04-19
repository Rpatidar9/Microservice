const Search = require('../models/search.model');
const logger = require('../utills/logger');
const searchPost = async (req, res) => {
    try {
        const { content } = req.body;
        const searchResults = await Search.find({ $text: { $search: content } },{score: { $meta: 'textScore' }}).sort({ score: { $meta: 'textScore' } }.limit(10));
        if (searchResults.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }
        res.status(200).json(searchResults);
    } catch (error) {
        logger.error('Error searching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}