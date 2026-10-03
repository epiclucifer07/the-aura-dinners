import React, { useState, useEffect } from 'react';
import { X, Phone, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
  onVerified: (verifiedPhone: string) => void;
  title?: string;
  subtitle?: string;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
  isOpen,
  onClose,
  initialPhone = '',
  onVerified,
  title = 'Verify Telephone Number',
  subtitle = 'Required to guarantee your table reservation and bespoke tasting order.',
}) => {
  const { sendPhoneVerificationCode, verifyPhoneCode, phoneVerified, verifiedPhone } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState(initialPhone || verifiedPhone || '');
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [receivedCodePreview, setReceivedCodePreview] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initial phone
  useEffect(() => {
    if (initialPhone) {
      setPhoneNumber(initialPhone);
    } else if (verifiedPhone) {
      setPhoneNumber(verifiedPhone);
    }
  }, [initialPhone, verifiedPhone]);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setErrorMessage('Please enter a valid mobile number with country code (e.g. +91 98200 12345).');
      return;
    }

    setErrorMessage(null);
    setIsSending(true);

    try {
      const res = await sendPhoneVerificationCode(phoneNumber.trim());
      setReceivedCodePreview(res.code);
      setStep('otp');
      setCountdown(30);
      setOtpCode('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch verification code.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setErrorMessage(null);
    setIsVerifying(true);

    try {
      const isValid = await verifyPhoneCode(phoneNumber.trim(), otpCode.trim());
      if (isValid) {
        setStep('success');
        setTimeout(() => {
          onVerified(phoneNumber.trim());
          onClose();
        }, 1200);
      } else {
        setErrorMessage('Invalid or expired verification code. Please check and re-try.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const autoFillOtp = () => {
    if (receivedCodePreview) {
      setOtpCode(receivedCodePreview);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-md rounded-lg shadow-2xl border border-neutral-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-wider text-neutral-900 font-bold">
              AURA
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
              Security Verification
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          
          {step === 'input' && (
            <div className="space-y-5">
              <div>
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl text-neutral-900 leading-snug">
                  <strong className="font-bold">{title}</strong>
                </h3>
                <p className="text-xs text-neutral-500 mt-1 font-light leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-800 rounded text-xs flex items-start gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Mobile / WhatsApp Telephone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="e.g. +91 98200 12345 or +1 212 555 0198"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setErrorMessage(null);
                      }}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-sm text-neutral-900 focus:outline-none focus:border-red-700 font-mono"
                      required
                    />
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Please include your country dial code (e.g. +91, +1, +44, +971, +33).
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {isSending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send 6-Digit SMS Passcode</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-5">
              <div>
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl text-neutral-900 leading-snug">
                  <strong className="font-bold">Enter Verification Passcode</strong>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Sent via simulated SMS dispatch to <strong className="font-bold text-neutral-900 font-mono">{phoneNumber}</strong>.
                </p>
              </div>

              {/* Simulated SMS Alert Banner for Instant Testing */}
              {receivedCodePreview && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-700 block">
                      SMS Gateway Dispatch
                    </span>
                    <span>Your OTP code is <strong className="font-mono text-sm font-extrabold text-emerald-950">{receivedCodePreview}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={autoFillOtp}
                    className="px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 font-semibold text-[11px] rounded transition-colors text-emerald-800"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-800 rounded text-xs flex items-start gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    6-Digit Passcode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, ''));
                      setErrorMessage(null);
                    }}
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono py-2.5 bg-neutral-50 border border-neutral-300 rounded font-bold text-neutral-900 focus:outline-none focus:border-red-700"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-neutral-500 hover:text-neutral-800 underline"
                  >
                    Change phone number
                  </button>

                  {countdown > 0 ? (
                    <span className="font-mono text-[11px] text-neutral-400">
                      Resend in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendCode()}
                      className="text-red-700 font-bold hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpCode.length < 6}
                  className="w-full py-3 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-neutral-900">
                <strong className="font-bold">Phone Verified</strong>
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                {phoneNumber} is authenticated for Aura service.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
