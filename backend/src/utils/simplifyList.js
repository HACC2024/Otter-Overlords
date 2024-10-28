export const simplifyList = (data) => {
    return data.map(item => ({
        ...item, // Spread all properties of the item
        description: extractMeaningfulDescription(item.description), // Override description field
        notes: extractMeaningfulDescription(item.notes) // Apply same transformation to notes
    }));
};

// Function to extract meaningful description from HTML or plain text
const extractMeaningfulDescription = (text) => {
    if (!text) return 'No description available';

    // Check if "Description:" exists in the HTML/text and extract content after it
    const descriptionMatch = text.match(/Description:\s*([\s\S]*?)(<\/div>|$)/i);
    let extractedText = descriptionMatch ? descriptionMatch[1] : text;

    // Remove \n tags
    extractedText = extractedText.replace(/\n/g, "");

    // Strip out HTML tags
    extractedText = extractedText.replace(/<\/?[^>]+(>|$)/g, "");

    // Remove any "Metadata" word (case-insensitive)
    extractedText = extractedText.replace(/Metadata/gi, " ");

    // Remove empty brackets, i.e., [] or [ ]
    extractedText = extractedText.replace(/[\[\]']+/g, "");

    return extractedText.trim() || 'No description available';
};
