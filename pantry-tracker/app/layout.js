import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Restockd",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
