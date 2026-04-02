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
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, "image/jpeg");
  });
};

const ProfilePage = () => {
  const [user, setUser] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      name: savedUser.name || "User",
      email: savedUser.email || "user@example.com",
      role: savedUser.role || "Professional",
      joinDate: "January 2024",
      avatar: savedUser.profilePhoto || null,
      twoFactorEnabled: savedUser.twoFactorEnabled || false,
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  // Cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropSubmit = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setUser((prev) => ({ ...prev, avatar: croppedImage }));
      setImageSrc(null); // close cropper
      toast.success("Profile photo updated! Save changes to apply.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await updateProfile({
        name: user.name,
        email: user.email,
        profilePhoto: user.avatar,
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser((prev) => ({
        ...prev,
        ...data.user,
        avatar: data.user.profilePhoto
      }));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
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
      console.error("2FA Toggle Error:", err);
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(errorMsg);
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal information and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <Card className="text-center p-6 border-none shadow-sm">
              <div className="relative inline-block group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div className="h-32 w-32 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-lg mx-auto">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group-hover:scale-110"
                >
                  <Camera
                    size={18}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.role}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Tasks Completed</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    48
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={16} className="text-blue-500" />
                    <span>Hours Tracked</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    164h
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Award size={16} className="text-yellow-500" />
                    <span>Efficiency</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    94%
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Account Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${user.twoFactorEnabled ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'}`}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Two-Factor Auth
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.twoFactorEnabled ? 'Currently enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={handleToggle2FA}
                isLoading={securityLoading}
              >
                {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </Button>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and how others see you on the
                    platform.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={user.name}
                        onChange={(e) =>
                          setUser({ ...user, name: e.target.value })
                        }
                        placeholder="Lokesh waran"
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                        placeholder="rynixsoft@gmail.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Role / Position"
                        value={user.role}
                        onChange={(e) =>
                          setUser({ ...user, role: e.target.value })
                        }
                        placeholder="Senior Developer"
                      />
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Joined Date
                        </label>
                        <div className="h-10 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm flex items-center">
                          {user.joinDate}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Change Password
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="New Password"
                          type="password"
                          placeholder="••••••••"
                        />
                        <Input
                          label="Confirm New Password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end gap-3 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 py-4">
                    <Button variant="secondary" type="button">
                      Discard Changes
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg border-none shadow-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 pb-4">
              <CardTitle>Crop Profile Photo</CardTitle>
            </CardHeader>
            <div className="relative h-64 sm:h-80 w-full bg-gray-50 dark:bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Zoom
                </span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setImageSrc(null)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button onClick={handleCropSubmit} type="button">
                  Apply Photo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProfilePage;
