"use client";

import React, { useReducer, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import { register } from "./action";
import Authimg from "@/components/Authimg";

interface FormState {
  success: boolean;
  message: null | string;
}

const initialState: FormState = {
  success: false,
  message: null,
};

function formReducer(state: FormState, action: Partial<FormState>): FormState {
  return { ...state, ...action };
}

export default function Signup() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isPasswordFocused, setPasswordFocused] = useState<boolean>(false);

  // เก็บสถานะของแต่ละเงื่อนไขรหัสผ่าน
  const [conditions, setConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // ตรวจสอบเงื่อนไขรหัสผ่าน
  const validatePassword = (password: string) => {
    setConditions({
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    if (confirm && confirm !== newPassword) {
      setError("Passwords do not match");
    } else {
      setError(null);
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
    if (password !== e.target.value) {
      setError("Passwords do not match");
    } else {
      setError(null);
    }
  };

  function toggleVisibility() {
    setOpen(!open);
  }

  // จัดการโฟกัส input
  const passwordInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        passwordInputRef.current &&
        !passwordInputRef.current.contains(event.target as Node)
      ) {
        setPasswordFocused(false); // ซ่อนเงื่อนไขเมื่อคลิกข้างนอก input
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  // ตรวจสอบว่าเงื่อนไขรหัสผ่านทั้งหมดเป็นจริง
  const isPasswordValid = Object.values(conditions).every(
    (condition) => condition
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError("Please meet all password conditions before submitting");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const result = await register(state, formData);
    dispatch(result);
  };

  return (
    <div className="w-full">
      <div className="flex justify-center w-5/6 grow bg-white backdrop-blur-sm rounded-3xl py-16 px-10 shadow-lg mx-auto">
        <Authimg />
        {/* Sign-Up Form Container */}
        <div className="flex flex-col items-center w-full">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-sec">สมัครสมาชิก</h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-third w-full"
          >
            {/* Email */}
            <label className="block w-full">
              <span className="text-gray-700">อีเมล</span>
              <div className="mt-1 flex items-center border border-light text-third rounded-md overflow-hidden focus-within:border-pri focus-within:text-pri focus-within:shadow-sm focus-within:shadow-pri">
                <i className="fa-solid fa-envelope px-3"></i>
                <input
                  type="email"
                  name="email"
                  className="w-full py-2 px-4 outline-none placeholder:text-light"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </label>

            {/* Username */}
            <label className="block w-full">
              <span className="text-gray-700">ชื่อที่แสดงในระบบ</span>
              <div className="mt-1 flex items-center text-third border border-light rounded-md overflow-hidden focus-within:border-primary focus-within:text-primary focus-within:shadow-sm focus-within:shadow-primary">
                <i className="fa-solid fa-user px-3"></i>
                <input
                  type="text"
                  name="username"
                  className="w-full py-2 px-4 outline-none placeholder:text-light"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </label>

            {/* Password */}
            <label className="block w-full">
              <span className="text-gray-700">รหัสผ่าน</span>
              <div className="mt-1 flex items-center border text-third border-light rounded-md overflow-hidden focus-within:border-primary focus-within:text-primary focus-within:shadow-sm focus-within:shadow-primary">
                <i className="fa-solid fa-lock px-3"></i>
                <input
                  type={open ? "text" : "password"}
                  name="password"
                  className="w-full py-2 px-4 outline-none placeholder:text-light"
                  placeholder="Enter your password"
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordFocus}
                  required
                />
                <button
                  type="button"
                  className="px-3"
                  onClick={toggleVisibility}
                >
                  <i
                    className={`fa-solid ${open ? "fa-eye" : "fa-eye-slash"}`}
                  ></i>
                </button>
              </div>
            </label>

            {/* Password Conditions */}
            {isPasswordFocused && (
              <ul className="text-left mt-2">
                <li
                  className={`flex items-center ${
                    conditions.length ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  <i
                    className={`fa-solid fa-check-circle mr-2 ${
                      conditions.length ? "text-green-600" : "text-gray-600"
                    }`}
                  ></i>
                  มีความยาวอย่างน้อย 12 ตัว
                </li>
                <li
                  className={`flex items-center ${
                    conditions.uppercase ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  <i
                    className={`fa-solid fa-check-circle mr-2 ${
                      conditions.uppercase ? "text-green-600" : "text-gray-600"
                    }`}
                  ></i>
                  มีตัวอักษรภาษาอังกฤษพิมพ์ใหญ่
                </li>
                <li
                  className={`flex items-center ${
                    conditions.lowercase ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  <i
                    className={`fa-solid fa-check-circle mr-2 ${
                      conditions.lowercase ? "text-green-600" : "text-gray-600"
                    }`}
                  ></i>
                  มีตัวอักษรภาษาอังกฤษพิมพ์เล็ก
                </li>
                <li
                  className={`flex items-center ${
                    conditions.number ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  <i
                    className={`fa-solid fa-check-circle mr-2 ${
                      conditions.number ? "text-green-600" : "text-gray-600"
                    }`}
                  ></i>
                  มีตัวเลข 0-9 อย่างน้อย 1 ตัว
                </li>
                <li
                  className={`flex items-center ${
                    conditions.specialChar ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  <i
                    className={`fa-solid fa-check-circle mr-2 ${
                      conditions.specialChar
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  ></i>
                  มีสัญลักษณ์ !@#$%^&*-_+= อย่างน้อย 1 ตัว
                </li>
              </ul>
            )}

            {/* Confirm Password */}
            <label className="block w-full">
              <span className="text-gray-700">ยืนยันรหัสผ่าน</span>
              <div className="mt-1 flex items-center border text-third border-light rounded-md overflow-hidden focus-within:border-primary focus-within:text-primary focus-within:shadow-sm focus-within:shadow-primary">
                <i className="fa-solid fa-key px-3"></i>
                <input
                  type={open ? "text" : "password"}
                  className="w-full py-2 px-4 outline-none placeholder:text-light"
                  placeholder="Confirm your password"
                  onChange={handleConfirmChange}
                  required
                />
                <button
                  type="button"
                  className="px-3"
                  onClick={toggleVisibility}
                >
                  <i
                    className={`fa-solid ${open ? "fa-eye" : "fa-eye-slash"}`}
                  ></i>
                </button>
              </div>
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {state.message && (
              <p className="text-red-500 text-sm">Error: {state.message}</p>
            )}

            <SubmitButton
              isDisabled={!isPasswordValid || !!error}
              pendingText="สมัครสมาชิก..."
            >
              สมัครสมาชิก
            </SubmitButton>
          </form>

          <Link
            href="/sign-in"
            className="hover:underline text-sm text-secondary"
          >
            <i className="fas fa-arrow-left mr-1"></i> เข้าสู่ระบบ
          </Link>
        </div>
      </div>
      {state.success && (
        <dialog open className="modal bg-black/30">
          <div className="modal-box bg-white p-6 rounded-lg flex flex-col items-center gap-5">
            <button
              onClick={() => dispatch({ success: false })}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            <h3 className="text-primary text-2xl font-bold mb-2">
              Register Successful!
            </h3>
            <i className="fa-solid fa-envelope text-9xl text-primary"></i>
            <p className="text-secondary text-center">
              ยืนยันอีเมลเพื่อเข้าใช้งาน
            </p>
            <a
              href="https://mail.google.com"
              className="btn hover:btn-primary hover:text-white border-primary text-primary"
            >
              ยืนยันอีเมล
            </a>
          </div>
        </dialog>
      )}
    </div>
  );
}
