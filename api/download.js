const axios = require('axios');

async function aio(url) {
    try {
        if (!url || !url.includes('https://')) throw new Error('URL is required');
        
        const { data } = await axios.post('https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink', {
            url: url
        }, {
            headers: {
                'accept-encoding': 'gzip',
                'cache-control': 'no-cache',
                'content-type': 'application/json; charset=utf-8',
                referer: 'https://auto-download-all-in-one.p.rapidapi.com/',
                'user-agent': 'Xihe/5.0',
                'x-rapidapi-host': process.env.RAPIDAPI_HOST || 'auto-download-all-in-one.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPIDAPI_KEY || '1dda0d29d3mshc5f2aacec619c44p16f219jsn99a62a516f98'
            }
        });
        
        return data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw new Error(`Download service error: ${error.message}`);
    }
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const { url, language } = req.body;
            
            if (!url) {
                return res.status(400).json({ 
                    success: false,
                    error: 'URL is required',
                    message: 'Please provide a valid URL'
                });
            }
            
            console.log(`Processing URL: ${url.substring(0, 50)}...`);
            
            // Call the AIO function
            const result = await aio(url);
            
            // Return the result
            return res.status(200).json({
                success: true,
                data: result.data || result,
                language: language || 'en',
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Server Error:', error.message);
            
            // Return error response
            return res.status(500).json({
                success: false,
                error: error.message,
                message: 'Failed to process the download request. Please check the URL and try again.'
            });
        }
    } else {
        // Method not allowed
        return res.status(405).json({ 
            success: false,
            error: 'Method not allowed',
            message: 'Only POST requests are allowed'
        });
    }
};
