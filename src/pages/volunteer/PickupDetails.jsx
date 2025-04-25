import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


export default function PickupDetails() {
  const FOOD_CATEGORIES = [
    {id:1,name:"Chapati"},
    {id:2,name:"Dry Vegetable"},
    {id:3,name:"Wet Vegetable"},
    {id:4,name:"Rice"},
    {id:5,name:"Snacks"},
  ]
  const { user } = useAuth();
  const { toast } = useToast(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    messName: "",
    foodType: "veg",
    category: "",
    useBefore: "",
    additionalInfo: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.messName || !formData.category || !formData.useBefore) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Load existing donations
      const donations = JSON.parse(localStorage.getItem("donations") || "[]");

      // Create new donation
      const newDonation = {
        id: `donation-${Date.now()}`,
        volunteerId: user?.id,
        volunteerName: user?.fullName,
        messName: formData.messName,
        foodType: formData.foodType,
        category: formData.category,
        useBefore: formData.useBefore,
        additionalInfo: formData.additionalInfo || null,
        photoUrl: photoPreview, // Store base64 image (in a real app, we'd upload to a server)
        date: new Date().toISOString(),
        status: "pending",
      };

      // Save to localStorage
      donations.push(newDonation);
      localStorage.setItem("donations", JSON.stringify(donations));

      toast({
        title: "Donation Submitted",
        description: "Your food donation has been submitted successfully",
      });

      // Reset form
      setFormData({
        messName: "",
        foodType: "veg",
        category: "",
        useBefore: "",
        additionalInfo: "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Pickup Details</h1>
        <div className="mt-6 max-w-xl ">
          <form className="space-y-4 " onSubmit={handleSubmit}>
            <div>
              <label htmlFor="mess-name" className="block text-sm font-medium text-gray-700">
                Mess Name
              </label>
              <Input
                id="mess-name"
                name="messName"
                value={formData.messName}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="food-type" className="block text-sm font-medium text-gray-700">
                Food Type
              </label>
              <Select
                name="foodType"
                value={formData.foodType}
                onValueChange={(value) => handleSelectChange("foodType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select food type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-gray-500">Veg / Non Veg</p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {FOOD_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="use-before" className="block text-sm font-medium text-gray-700">
                Suggested Use Before
              </label>
              <Input
                id="use-before"
                name="useBefore"
                type="date"
                value={formData.useBefore}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="additional-info" className="block text-sm font-medium text-gray-700">
                Additional Info
              </label>
              <Textarea
                id="additional-info"
                name="additionalInfo"
                rows={3}
                value={formData.additionalInfo}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Button
                type="button"
                onClick={() => document.getElementById('file-upload').click()}
                className="w-full bg-primary hover:bg-green-600"
              >
                Upload Photo
              </Button>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept="image/*"
                multiple={false}
                className="hidden"
                onChange={handlePhotoChange}
              />
              {photoPreview && (
                <div className="mt-4">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-green-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "SUBMIT"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
