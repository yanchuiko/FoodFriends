/**
 * ROOT REDIRECT
 *
 * This is the root entry point of the app.
 * It immediately redirects the user to the login screen.
 *
 **/

import React from "react";
import { Redirect } from "expo-router";

export default function index() {
  return <Redirect href="/(auth)/login" />;
}
