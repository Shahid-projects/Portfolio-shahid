const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');

// Configure multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Segregation tips database
const segregationTips = {
  plastic: { category: 'Dry Waste (Sukha Kachra)', tips: ['Rinse the item...', 'Crush bottles...', 'Remove caps...', 'Check recycling symbol...', 'Keep soft plastics separate.'], impact: 'Recycling one ton of plastic can save 7,500 kWh of electricity.' },
  paper: { category: 'Dry Waste (Sukha Kachra)', tips: ['Ensure paper is clean...', 'Remove wrapping...', 'Staples usually fine...', 'Avoid shredding...', 'Flatten paper.'], impact: 'Recycling one ton of paper saves 17 trees.' },
  cardboard: { category: 'Dry Waste (Sukha Kachra)', tips: ['Flatten boxes...', 'Remove tape...', 'Keep dry...', 'Avoid greasy pizza boxes...', 'Stack neatly.'], impact: 'Recycling cardboard uses 75% less energy.' },
  metal: { category: 'Dry Waste (Sukha Kachra)', tips: ['Rinse cans...', 'Watch sharp edges...', 'Labels can stay...', 'Do not crush aerosol...', 'Foil can be recycled if clean.'], impact: 'One recycled aluminum can saves enough energy to run a TV for 3 hours.' },
  glass: { category: 'Dry Waste (Sukha Kachra)', tips: ['Rinse bottles...', 'Remove lids...', 'Don’t recycle broken glass...', 'No mirrors/bulbs...', 'Separate by color if required.'], impact: 'Recycling glass cuts pollution significantly.' },
  organic: { category: 'Wet Waste (Geela Kachra)', tips: ['Use a bin with lid...', 'Include peels...', 'Avoid too much oil/meat...', 'Line bin with newspaper...', 'Use for composting.'], impact: 'Composting reduces methane emissions.' },
  trash: { category: 'Reject Waste', tips: ['For non-recyclables...', 'Includes chip packets...', 'Styrofoam & tissues...', 'Always check packaging...', 'Reduce non-recyclables.'], impact: 'Segregating trash prevents contamination of recyclables.' }
};

// Helper function to map detailed Roboflow classes to general categories
function mapWasteType(className) {
    const lowerClassName = className.toLowerCase();
    if (lowerClassName.includes('plastic')) return 'plastic';
    if (lowerClassName.includes('paper')) return 'paper';
    if (lowerClassName.includes('cardboard')) return 'cardboard';
    if (lowerClassName.includes('metal')) return 'metal';
    if (lowerClassName.includes('glass')) return 'glass';
    if (lowerClassName.includes('food') || lowerClassName.includes('organic')) return 'organic';
    return 'trash'; // Default fallback for anything else
}


// Route: POST /api/classify/upload
router.post('/upload', upload.single('wasteImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }

  try {
    // Convert image to Base64
    const imageBase64 = req.file.buffer.toString('base64');

    const model = process.env.ROBOFLOW_MODEL_NAME;
    const version = process.env.ROBOFLOW_MODEL_VERSION;
    const apiKey = process.env.ROBOFLOW_API_KEY;

    if (!model || !version || !apiKey) {
      console.error("Roboflow credentials missing. Check .env file.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const roboflowUrl = `https://detect.roboflow.com/${model}/${version}?api_key=${apiKey}`;


    // Send POST request to Roboflow
    const roboflowResponse = await axios({
      method: 'POST',
      url: roboflowUrl,
      data: imageBase64,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    console.log("✅ Roboflow raw response:", roboflowResponse.data);

    // --- UPDATED LOGIC TO HANDLE OBJECT-BASED RESPONSE ---
    const predictions = roboflowResponse.data.predictions;

    if (!predictions || Object.keys(predictions).length === 0) {
      // Use predicted_classes as a fallback if it exists
      const fallbackClass = roboflowResponse.data.predicted_classes?.[0];
      if (fallbackClass) {
          const generalWasteType = mapWasteType(fallbackClass);
          const tipsData = segregationTips[generalWasteType] || segregationTips['trash'];
          return res.status(200).json({
              name: fallbackClass,
              category: tipsData.category,
              confidence: 90, // Assign a default confidence
              info: `This item has been identified as ${fallbackClass}.`,
              tips: tipsData.tips,
              impact: tipsData.impact
          });
      }
      return res.status(400).json({ msg: "No object detected or low confidence." });
    }

    // Find the prediction with the highest confidence from the object
    let topPredictionClass = null;
    let maxConfidence = 0;

    for (const className in predictions) {
        if (predictions[className].confidence > maxConfidence) {
            maxConfidence = predictions[className].confidence;
            topPredictionClass = className;
        }
    }

    if (!topPredictionClass) {
        return res.status(400).json({ msg: "Could not determine the top prediction." });
    }
    
    // Structure the top prediction for the rest of the logic
    const topPrediction = {
        class: topPredictionClass,
        confidence: maxConfidence
    };

    const generalWasteType = mapWasteType(topPrediction.class);
    const tipsData = segregationTips[generalWasteType] || segregationTips['trash'];

    const finalResponse = {
      name: topPrediction.class,
      category: tipsData.category,
      confidence: Math.round(topPrediction.confidence * 100),
      info: `This item has been identified as ${topPrediction.class}.`,
      tips: tipsData.tips,
      impact: tipsData.impact
    };

    res.status(200).json(finalResponse);

  } catch (err) {
    console.error('--- DETAILED ROBOFLOW ERROR ---');
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error Message:", err.message);
    }
    console.error('--- END ERROR ---');
    res.status(500).json({ error: "An error occurred while classifying the image." });
  }
});

module.exports = router;
