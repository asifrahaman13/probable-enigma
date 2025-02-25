"use client";
import React from "react";
import { CurrentPage } from "@/app/constants/enums";
import Otp from "@/app/components/Otp";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import Verification from "@/app/components/Verification";
import UploadKyc from "@/app/components/UploadKyc";
import SelectMode from "@/app/components/SelectMode";
import ChatMode from "@/app/components/ChatMode.";


export default function Page() {
  const pageSelected= useSelector((state: RootState) => state.pageSelection.pageSelected);

  switch (pageSelected) {
    case CurrentPage.OTP:
      return <React.Fragment><Otp/></React.Fragment>;
    case CurrentPage.VERIFICATION:
      return <React.Fragment><Verification/></React.Fragment>;
    case CurrentPage.UPLOAD_KYC:
      return <React.Fragment><UploadKyc/></React.Fragment>;
    case CurrentPage.FETCHING:
      return <React.Fragment>Fetching</React.Fragment>;
    case CurrentPage.SELECT_MODE:
      return <React.Fragment><SelectMode/></React.Fragment>;
    case CurrentPage.CHAT_MODE:
      return <React.Fragment><ChatMode/></React.Fragment>;
    case CurrentPage.FORM_MODE:
      return <React.Fragment>Form Mode</React.Fragment>;
    case CurrentPage.COMPLETE:
      return <React.Fragment>Complete</React.Fragment>;
    default:
      return <React.Fragment>Default Page</React.Fragment>;
  }
}