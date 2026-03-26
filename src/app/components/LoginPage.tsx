import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Logo } from './Logo';
import { Shield, Eye, EyeOff, User, Mail, Lock, Upload, X, Phone, Check, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: { email: string; name: string; profileImage?: string }) => void;
}

interface UserAccount {
  email: string;
  password: string;
  fullName: string;
  mobileNumber: string;
  profileImage?: string;
  createdAt: string;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Sign up specific fields
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  // Login OTP verification states
  const [loginStep, setLoginStep] = useState<'credentials' | 'otp'>('credentials');
  const [loginUserData, setLoginUserData] = useState<UserAccount | null>(null);

  // Get all registered users from localStorage
  const getRegisteredUsers = (): UserAccount[] => {
    const usersData = localStorage.getItem('threadxai_users');
    return usersData ? JSON.parse(usersData) : [];
  };

  // Save new user to localStorage
  const saveUser = (user: UserAccount) => {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('threadxai_users', JSON.stringify(users));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      // Check demo credentials first
      if (email === 'guest@threadxai.com' && password === 'guest123') {
        setIsLoading(false);
        localStorage.setItem('threadxai_current_user', JSON.stringify({ email, name: 'Guest' }));
        onLogin({ email, name: 'Guest' });
        return;
      }

      // Check registered users
      const users = getRegisteredUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Move to OTP verification step
        setLoginUserData(user);
        setMobileNumber(user.mobileNumber);
        setLoginStep('otp');
        setIsLoading(false);
        
        // Automatically send OTP
        setTimeout(() => {
          handleSendOtp();
        }, 500);
      } else {
        setIsLoading(false);
        alert('Invalid credentials. Please check your email and password or use the demo account:\nEmail: guest@threadxai.com\nPassword: guest123');
      }
    }, 1000);
  };

  const handleLoginOtpVerification = () => {
    if (enteredOtp === generatedOtp && loginUserData) {
      setIsLoading(true);
      setTimeout(() => {
        const userData = { email: loginUserData.email, name: loginUserData.fullName, profileImage: loginUserData.profileImage };
        localStorage.setItem('threadxai_current_user', JSON.stringify(userData));
        setIsLoading(false);
        onLogin(userData);
      }, 500);
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleBackToLogin = () => {
    setLoginStep('credentials');
    setLoginUserData(null);
    setOtpSent(false);
    setGeneratedOtp('');
    setEnteredOtp('');
    setOtpTimer(0);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if OTP is verified
    if (!otpVerified) {
      alert('Please verify your mobile number with OTP before creating account!');
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Check if password is strong enough (at least 6 characters)
    if (password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      // Check if email already exists
      const users = getRegisteredUsers();
      const emailExists = users.some(u => u.email === email);
      
      if (emailExists) {
        setIsLoading(false);
        alert('An account with this email already exists. Please login instead.');
        return;
      }

      // Create new user
      const newUser: UserAccount = {
        email,
        password,
        fullName,
        mobileNumber,
        profileImage,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      saveUser(newUser);
      
      // Auto-login after signup
      const userData = { email: newUser.email, name: newUser.fullName, profileImage: newUser.profileImage };
      localStorage.setItem('threadxai_current_user', JSON.stringify(userData));
      setIsLoading(false);
      onLogin(userData);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ email: 'google@threadxai.com', name: 'Google User' });
    }, 800);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImage(null);
  };

  // Generate 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP
  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      alert('Please enter a valid mobile number!');
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setOtpTimer(30);

    // Display the OTP in an alert (in production, this would be sent via SMS)
    alert(`Your OTP is: ${otp}\n\n(In production, this would be sent to your mobile)`);

    // Start countdown timer
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Verify OTP (for sign up)
  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setOtpVerified(true);
      alert('Mobile number verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    handleSendOtp();
    setEnteredOtp('');
  };

  // Reset form when switching between login and signup
  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setMobileNumber('');
    setProfileImage(null);
    setOtpSent(false);
    setGeneratedOtp('');
    setEnteredOtp('');
    setOtpVerified(false);
    setOtpTimer(0);
    setLoginStep('credentials');
    setLoginUserData(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md p-8">
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Logo size="lg" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {!isSignUp && loginStep === 'otp' ? 'Verify OTP' : isSignUp ? 'Create Account' : 'Welcome back!'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {!isSignUp && loginStep === 'otp' 
                ? `Enter the OTP sent to ${mobileNumber}`
                : isSignUp 
                ? 'Start your security journey' 
                : 'Please enter your details'}
            </p>
          </div>

          {/* Login OTP Verification Screen */}
          {!isSignUp && loginStep === 'otp' && (
            <div className="space-y-5">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              {/* Mobile Number Display */}
              <div>
                <label className="block text-sm font-medium mb-2">Mobile Number</label>
                <div className="relative">
                  <Input
                    type="tel"
                    value={mobileNumber}
                    disabled
                    className="w-full pl-10 bg-slate-50 dark:bg-slate-900"
                  />
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Enter OTP</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="flex-1"
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    onClick={handleLoginOtpVerification}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    disabled={enteredOtp.length !== 6 || isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </div>

              {/* Resend OTP */}
              <div className="flex justify-between items-center text-xs">
                {otpTimer > 0 ? (
                  <span className="text-gray-500 dark:text-gray-400">
                    Resend OTP in {otpTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-cyan-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Login/Sign Up Form */}
          {(isSignUp || loginStep === 'credentials') && (
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
              {/* Full Name Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10"
                      required
                    />
                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="anna@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${isSignUp ? 'pl-10' : ''}`}
                    required
                  />
                  {isSignUp && <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                </div>
              </div>

              {/* Mobile Number Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number</label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="+1234567890"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full pl-10 pr-24"
                        required
                        disabled={otpVerified}
                      />
                      <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      {otpVerified && (
                        <Check className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                      )}
                    </div>
                    
                    {!otpSent && !otpVerified && (
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        variant="outline"
                        className="w-full text-sm py-2"
                      >
                        Send OTP
                      </Button>
                    )}

                    {otpSent && !otpVerified && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            className="flex-1"
                            maxLength={6}
                          />
                          <Button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            disabled={enteredOtp.length !== 6}
                          >
                            Verify
                          </Button>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          {otpTimer > 0 ? (
                            <span className="text-gray-500 dark:text-gray-400">
                              Resend OTP in {otpTimer}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="text-cyan-600 hover:underline"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {otpVerified && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                        <Check className="w-4 h-4" />
                        <span>Mobile number verified</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pr-10 ${isSignUp ? 'pl-10' : ''}`}
                    required
                  />
                  {isSignUp && <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10"
                      required
                    />
                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Image Upload (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Image</label>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="w-full pl-10"
                    />
                    <Upload className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {profileImage && (
                    <div className="mt-2 flex items-center">
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveProfileImage}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Remember Me & Forgot Password (Login Only) */}
              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                    >
                      Remember for 30 days
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms Agreement (Sign Up Only) */}
              {isSignUp && (
                <div className="flex items-start gap-2">
                  <Checkbox id="terms" required />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    I agree to the{' '}
                    <button type="button" className="text-cyan-600 hover:underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-cyan-600 hover:underline">
                      Privacy Policy
                    </button>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white py-6 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (isSignUp ? 'Creating account...' : 'Logging in...') : (isSignUp ? 'Create Account' : 'Log in')}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-900 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full py-6 rounded-xl"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isSignUp ? 'Sign up with Google' : 'Log in with Google'}
              </Button>
            </form>
          )}

          {/* Toggle between Login and Sign Up */}
          {loginStep === 'credentials' && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button 
                  type="button"
                  onClick={handleToggleMode}
                  className="text-gray-900 dark:text-gray-100 font-medium hover:underline"
                >
                  {isSignUp ? 'Log in' : 'Sign Up'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
