import { create } from "zustand";
// import { toast } from "sonner"
import axsInstance from "@/axios";
import { type NavigateFunction } from "react-router";
import { toast } from "sonner"

interface AuthState {
  loading: boolean;
  user: User | null;
  email: string;
  password: string;
  firstname: string;
  googleOAuth: () => Promise<void>;
  getUser: () => Promise<User | null | undefined>;
  logoutUser: () => Promise<void>;
  registerUser: (
    firstname: string,
    email: string,
    password: string,
    mobileNumber: string,
    navigate: NavigateFunction,
    lastname?: string,
  ) => Promise<void>;
  loginUser: (
    email: string,
    password: string,
    navigate: NavigateFunction,
  ) => Promise<void>;
  verifyOTP: (otp: string, navigate: NavigateFunction) => Promise<void>;
  sendWelcomeMail: () => Promise<void>;
  resendOTP: () => Promise<void>;
}

const googleOAuth = async () => {
  try {
    const response = await axsInstance.request({
      url: "/oauth/google/url",
    });

    console.log(response.data);

    window.location.href = response.data.url;
    // navigate(response.data.url)
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message)
  }
};

export const loginUser = async (
  email: string,
  password: string,
  navigate: NavigateFunction,
  set: (
    partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>),
  ) => void,
) => {
  try {
    const response = await axsInstance.request({
      url: "/auth/login",
      method: "POST",
      data: {
        email,
        password,
      },
    });

    const userData = response.data.user;

    if (!userData.isVerified) {
      // window.location.href = '/verify-token'
      navigate("/verify-token");
    }

    set({
      user: {
        email: userData.email,
        firstname: userData.firstname,
        id: userData.id,
        role: userData.role,
        isVerified: userData.isVerified ?? false,
        lastname: userData.lastname ?? "",
        mobileNumber: userData.mobileNumber ?? "",
        profilePic: userData.profilePicture ?? "",
      },
    });

    // window.location.href = "/"
    toast.success(`${userData.loginCount <= 1 ? "🎉 Welcome to" : "🎉 Welcome back"}, ${userData.firstname}!`)
    navigate("/");
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message)
  }
};

export const registerUser = async (
  firstname: string,
  email: string,
  password: string,
  mobileNumber: string,
  navigate: NavigateFunction,
  set: (
    partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>),
  ) => void,
  lastname?: string,
) => {
  set({
    email: email,
    password: password,
    firstname,
  });

  sessionStorage.setItem("user-email", email);
  sessionStorage.setItem("firstname", firstname);

  try {
    await axsInstance.request({
      url: "/auth/register",
      method: "POST",
      data: {
        firstname,
        lastname,
        email,
        password,
        role: "EATERY",
      },
    });

    // window.location.href = "/verify-email"
    toast.info("📧 Check your inbox for the code!")
    navigate("/verify-email");
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message)
  }
};

export const verifyOTP = async (
  otp: string,
  email: string,
  password: string,
  navigate: NavigateFunction,
  set: (
    partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>),
  ) => void,
) => {
  // console.log("Email: ", email);

  const userEmail = sessionStorage.getItem("user-email");
  const userFirstName = sessionStorage.getItem("firstname");
  console.log("email", userEmail);

  try {
    const response = await axsInstance.request({
      url: "/auth/verify-otp",
      method: "POST",
      data: {
        email: userEmail,
        otp,
      },
    });

    const isVerified = response.data.success;

    if (isVerified) {
      toast.success("🎉 You’re verified!")
      if (userEmail && userFirstName) {
        await sendWelcomeEmail(userEmail, userFirstName);
      }

      if (userEmail && password) {
        await loginUser(userEmail, password, navigate, set);
      } else {
        navigate("/login");
      }
    }
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
  }
};

const sendWelcomeEmail = async (
  email: string | undefined,
  firstname: string | undefined,
) => {
  try {
    if (!email) {
      throw new Error("No email found");
    }
    await axsInstance.request({
      url: "/auth/send-welcome-mail",
      method: "POST",
      data: {
        email,
        firstname: firstname ?? "user",
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const resendOTP = async (firstname: string, email: string) => {
  try {
    const userFirstName = sessionStorage.getItem("firstname");
    const userEmail = sessionStorage.getItem("user-email");

    // if (!email) {
    //     throw new Error("No email found")
    // }
    await axsInstance.request({
      url: "/auth/resend-otp",
      method: "POST",
      data: {
        email: userEmail,
        firstname: userFirstName ?? "user",
      },
    });
    toast.info("📧 Check your inbox for the code!")
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message)
  }
};

const logoutUser = async (
  set: (
    partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>),
  ) => void,
) => {
  try {
    set({
      loading: true,
    });

    await axsInstance.request({
      url: "/auth/logout",
      method: "POST",
    });

    set({
      user: null,
    });

    window.location.href = "http://localhost:5173/login";
  } catch (error) {
    console.error(error);
  } finally {
    set({
      loading: false,
    });
    toast("✨ Logged out—come back anytime!")
  }
};

const getUser = async (
  set: (
    partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>),
  ) => void,
  get: () => AuthState,
) => {
  try {
    const response = await axsInstance.request({
      url: "/user/get",
    });

    const fetchedUser = response.data.user;

    if (fetchedUser.role === 'CUSTOMER') {
      toast.warning("You must login with business account")
      return get().user
    }

    set({
      user: {
        email: fetchedUser.email,
        firstname: fetchedUser.firstname,
        id: fetchedUser.id,
        role: fetchedUser.role,
        lastname: fetchedUser.lastname ?? "",
        mobileNumber: fetchedUser.mobileNumber ?? "",
        profilePic: fetchedUser.profilePicture ?? "",
        isVerified: fetchedUser.isVerified,
      },
    });

    const u = get().user;
    console.log(u);

    set({
      loading: false,
    });

    return get().user;
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Setting loading to false");

    set({
      loading: false,
    });

    console.log(get().loading);
  }
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  loading: true,
  email: "",
  password: "",
  firstname: "",
  googleOAuth: googleOAuth,
  getUser: () => getUser(set, get),
  logoutUser: () => logoutUser(set),
  registerUser: (
    firstname: string,
    email: string,
    password: string,
    mobileNumber: string,
    navigate: NavigateFunction,
    lastname?: string,
  ) =>
    registerUser(
      firstname,
      email,
      password,
      mobileNumber,
      navigate,
      set,
      lastname,
    ),
  loginUser: (email: string, password: string, navigate: NavigateFunction) =>
    loginUser(email, password, navigate, set),
  verifyOTP: (otp: string, navigate: NavigateFunction) => {
    const email = get().email;
    const password = get().password;
    return verifyOTP(otp, email, password, navigate, set);
  },
  sendWelcomeMail: () =>
    sendWelcomeEmail(get().user?.email, get().user?.firstname),
  resendOTP: () => resendOTP(get().email, get().firstname),
}));
