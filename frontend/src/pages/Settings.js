import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  User,
  Mail,
  Lock,
  Camera,
  CheckCircle,
  Clock,
  Award,
  Save,
  Shield,
  Bell,
  Eye,
  EyeOff
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { updateProfile, toggle2FA } from "../services/api";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const photo = savedUser.profilePhoto;
    const backendUrl = "http://localhost:5000"; // Can be replaced with environment variable
    const avatarUrl = photo ? (photo.startsWith("http") ? photo : `${backendUrl}${photo}`) : null;
    return {
      name: savedUser.name || "User",
      email: savedUser.email || "user@example.com",
      position: savedUser.position || "Professional",
      role: savedUser.role || "user",
      joinDate: "January 2024",
      avatar: avatarUrl,
      twoFactorEnabled: savedUser.twoFactorEnabled || false,
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropSubmit = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      setAvatarFile(croppedFile);
      setUser((prev) => ({ ...prev, avatar: URL.createObjectURL(croppedBlob) }));
      setImageSrc(null);
      toast.success("Profile photo updated! Save changes to apply.");
    } catch (e) {
      toast.error("Failed to crop image.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("position", user.position);
      if (avatarFile) {
        formData.append("profilePhoto", avatarFile);
      }
      
      const { data } = await updateProfile(formData);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      const photo = data.user.profilePhoto;
      const avatarUrl = photo ? (photo.startsWith("http") ? photo : `http://localhost:5000${photo}`) : null;
      
      setUser((prev) => ({ ...prev, ...data.user, avatar: avatarUrl }));
      window.dispatchEvent(new Event("profileUpdate")); 
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setSecurityLoading(true);
    try {
      const { data } = await toggle2FA();
      setUser(prev => ({ ...prev, twoFactorEnabled: data.twoFactorEnabled }));
      const currentLocalUser = JSON.parse(localStorage.getItem("user") || "{}");
      currentLocalUser.twoFactorEnabled = data.twoFactorEnabled;
      localStorage.setItem("user", JSON.stringify(currentLocalUser));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "2FA error");
    } finally {
      setSecurityLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === "profile" && (
            <>
              <div className="space-y-6">
                <Card className="text-center p-6 border-none shadow-sm">
                  <div className="relative inline-block group">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    <div className="h-32 w-32 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold border-4 border-white dark:border-gray-800 shadow-lg mx-auto">
                      {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                      <Camera size={18} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Full Name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                        <Input 
                          label="Email Address" 
                          type="email" 
                          value={user.email} 
                          disabled={true} 
                          className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-75"
                        />
                      </div>
                      <div className="relative">
                        <Input 
                          label="Role / Position" 
                          value={user.position} 
                          onChange={(e) => setUser({ ...user, position: e.target.value })} 
                        />
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">Security Access Level:</span>
                            <Badge variant={user.role === 'admin' ? 'success' : user.role === 'superadmin' ? 'default' : 'secondary'}>
                                {user.role?.toUpperCase() || 'USER'} (LOCKED)
                            </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end gap-3 border-t bg-gray-50/50 dark:bg-gray-800/20 py-4">
                      <Button type="submit" isLoading={isLoading} className="gap-2"><Save size={18} />Save Changes</Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <div className="lg:col-span-3 space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Protect your account with extra security layers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${user.twoFactorEnabled ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}><Shield size={24} /></div>
                      <div>
                        <h4 className="font-semibold">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <Button variant={user.twoFactorEnabled ? "outline" : "default"} onClick={handleToggle2FA} isLoading={securityLoading}>
                      {user.twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="lg:col-span-3">
              <Card className="border-none shadow-sm h-64 flex items-center justify-center text-gray-400">
                 Notification preferences coming soon.
              </Card>
            </div>
          )}
        </div>
      </div>

      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg border-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-white dark:bg-gray-900 pb-4 border-b">
              <CardTitle>Crop Profile Photo</CardTitle>
            </CardHeader>
            <div className="relative h-80 w-full bg-black">
              <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 border-t flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setImageSrc(null)}>Cancel</Button>
              <Button onClick={handleCropSubmit}>Apply</Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
