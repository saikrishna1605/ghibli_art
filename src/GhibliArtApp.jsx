import { useState } from "react";
import { Button } from "./components/ui/button"; // Updated path
import { Card, CardContent } from "./components/ui/card"; // Updated path
import { Upload } from "lucide-react";

export default function GhibliArtApp() {
  console.log("GhibliArtApp is rendering"); // Debugging log
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState(""); // New state for prompt
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const generateGhibliArt = async () => {
    if (!image || !prompt) {
      alert("Please upload an image and enter a prompt");
      return;
    }

    // Check file size
    if (image.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("prompt", prompt);

    try {
      console.log("Sending request to backend...");
      const response = await fetch("http://localhost:5000/ghibli-art", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }

      const result = await response.json();
      console.log("Backend response:", result);

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.imageUrl) {
        setOutput(result.imageUrl);
      } else {
        throw new Error("No image URL in response");
      }
    } catch (error) {
      console.error("Error details:", error);
      alert(`Failed to generate art: ${error.message}. Please try again with a different image or prompt.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardContent className="flex flex-col space-y-6">
          {/* File Upload */}
          <div className="flex flex-col items-center space-y-2">
            <label className="cursor-pointer flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-500" />
              <input type="file" className="hidden" onChange={handleUpload} />
              <span className="text-sm text-gray-600">Choose File</span>
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                className="w-full rounded-xl mt-4"
              />
            )}
          </div>

          {/* Prompt Input */}
          <div className="flex flex-col items-center space-y-2">
            <input
              type="text"
              placeholder="Enter a prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Generate Button */}
          <div className="flex flex-col items-center space-y-2">
            <Button onClick={generateGhibliArt} disabled={loading}>
              {loading ? "Processing..." : "Generate Ghibli Art"}
            </Button>
          </div>

          {/* Output Image */}
          {output ? (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={output}
                alt="Ghibli Art"
                className="w-full rounded-xl mt-4"
              />
            </div>
          ) : (
            <p className="text-gray-500">
              No output generated yet. Please upload an image and enter a
              prompt.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}