export const simplifyList = (data) => {
    return data.map(item => ({
        title: item.title,
        description: extractMeaningfulDescription(item.notes), // Extract meaningful description
        id: item.id
    }));
};

// Function to extract meaningful description from HTML or plain text
const extractMeaningfulDescription = (description) => {
    if (!description) return 'No description available';

    // Check if "Description:" exists in the HTML/text and extract content after it
    const descriptionMatch = description.match(/Description:\s*([\s\S]*?)(<\/div>|$)/i);
    let extractedDescription = descriptionMatch ? descriptionMatch[1] : description;

    // Remove any "Metadata" word (case-insensitive)
    extractedDescription = extractedDescription.replace(/Metadata/gi, "");

    // Remove empty brackets, i.e., [] or [ ]
    extractedDescription = extractedDescription.replace(/[\[\]']+/g,'');

    // Remove \n tags
    extractedDescription = extractedDescription.replace(/\n/g, "");

    // Strip out any remaining HTML tags if present
    extractedDescription = extractedDescription.replace(/<\/?[^>]+(>|$)/g, "");

    return extractedDescription.trim() || 'No description available';
};

