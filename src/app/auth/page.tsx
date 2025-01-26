"use client";

import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const registerValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const flipVariants = {
  enter: {
    rotateX: 90,
    opacity: 0,
  },
  center: {
    rotateX: 0,
    opacity: 1,
  },
  exit: {
    rotateX: -90,
    opacity: 0,
  },
};

const Register = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
  const router = useRouter();

  const handleSubmit = async (
    values: { email: string; password: string; confirmPassword: string },
    {
      setSubmitting,
      setFieldError,
    }: FormikHelpers<{
      email: string;
      password: string;
      confirmPassword: string;
    }>
  ) => {
    const supabase = await createClient();
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Registration error:", error.message);
        setFieldError("email", error.message);
        return;
      }
      router.replace("/home");

      //   if () {
      //     supabase.auth.setSession({
      //       access_token: data.session?.access_token,
      //       refresh_token: data.session?.refresh_token,
      //     });
      //   } else {
      //     // Email confirmation required
      //     // or automatically switch to login
      //     onSwitchToLogin();
      //   }
    } catch (error) {
      console.error("Registration error:", error);
      setFieldError("email", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="enter"
      animate="center"
      exit="exit"
      variants={flipVariants}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={registerValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="flex flex-col gap-4 w-full sm:w-96">
            <div className="block">
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-semibold"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="block w-full p-2 pl-5 text-sm text-black bg-white border border-black/[.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-black/[.08]"
                placeholder="hello@example.com"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div className="block">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-semibold"
              >
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="block w-full p-2 pl-5 text-sm text-black bg-white border border-black/[.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-black/[.08]"
                placeholder="••••••••"
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="block">
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-sm font-semibold"
              >
                Confirm Password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                className="block w-full p-2 pl-5 text-sm text-black bg-white border border-black/[.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-black/[.08]"
                placeholder="••••••••"
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-2 text-sm text-white bg-black rounded-lg hover:bg-black/90 disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-sm text-gray-600 hover:text-black hover:underline"
              >
                Existing user? Login
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

const Login = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
  const router = useRouter();

  const handleSubmit = async (
    values: { email: string; password: string },
    {
      setSubmitting,
      setFieldError,
    }: FormikHelpers<{ email: string; password: string }>
  ) => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      console.log(data);
      if (data?.user?.aud === "authenticated" && data.session) {
        // supabase.auth.setSession({
        //     access_token: data.session?.access_token,
        //     refresh_token: data.session?.refresh_token,
        //   }).then((data)=> {
        //     console.log("d for ",data);

        //   }).catch((error) => {
        //     console.error('Error setting session:', error);
        //   });
        console.log("authenticated");
        router.replace("/home");
      }

      if (error) {
        console.error("Login error:", error);
        setFieldError("email", error.message);
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      setFieldError("email", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="enter"
      animate="center"
      exit="exit"
      variants={flipVariants}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="flex flex-col gap-4 w-full sm:w-96">
            <div className="block">
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-semibold"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="block w-full p-2 pl-10 text-sm text-black bg-white border border-black/[.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-black/[.08]"
                placeholder="hello@example.com"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div className="block">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-semibold"
              >
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="block w-full p-2 pl-10 text-sm text-black bg-white border border-black/[.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-black/[.08]"
                placeholder="••••••••"
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-2 text-sm text-white bg-black rounded-lg hover:bg-black/90 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-sm text-gray-600 hover:text-black hover:underline"
              >
                New user? Register
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default function Auth() {
  const [isLoginView, setIsLoginView] = useState(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white text-gray-900">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start perspective-1000">
        <AnimatePresence mode="wait">
          {isLoginView ? (
            <Login
              key="login"
              onSwitchToRegister={() => setIsLoginView(false)}
            />
          ) : (
            <Register
              key="register"
              onSwitchToLogin={() => setIsLoginView(true)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
