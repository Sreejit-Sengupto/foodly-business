"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth-store";

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const { verifyOTP, sendWelcomeMail, resendOTP, user } = useAuthStore();

  const navigate = useNavigate();

  // if (user?.isVerified) {
  //     navigate('/')
  // }

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join("");
    if (code.length !== 6) return;

    setIsLoading(true);

    try {
      await verifyOTP(code, navigate);
    } catch (error) {
      console.error(error);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendOTP();
    } catch (error) {
      console.error(error);
    } finally {
      setIsResending(false);
      setTimeLeft(60);
      setCanResend(false);
    }
  };

  if (user?.isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Email Verified!
              </h1>
              <p className="text-gray-600 mb-8">
                Your email has been successfully verified. You can now start
                using QuickBite.
              </p>
              <Link to="/">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer">
                  Continue to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">QuickBite</span>
          </Link>
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Check your email
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to{" "}
            <span className="font-medium text-gray-900">john@example.com</span>
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">
              Enter Verification Code
            </CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code we sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-center block">Verification Code</Label>
                <div className="flex justify-center space-x-2">
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      required
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                disabled={isLoading || verificationCode.join("").length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>

              {canResend ? (
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-orange-500 border-orange-200 hover:bg-orange-50 bg-transparent cursor-pointer"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Code"
                  )}
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend code in {timeLeft} seconds
                </p>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Wrong email address?{" "}
                  <Link
                    to="/signup"
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Go back and change it
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
