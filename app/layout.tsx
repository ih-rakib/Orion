import type { Metadata,Viewport } from "next";
import "./globals.css";
import {BackToTop} from "@/components/back-to-top";
import {GlobalSearch} from "@/components/global-search";
export const metadata:Metadata={title:{default:"Orion — A Universe of Discovery",template:"%s | Orion"},description:"Explore the cosmos, Earth, life, deep time and the discoveries that connect everything. An ever-growing atlas for curious minds.",applicationName:"Orion",keywords:["universe","space","astronomy","Earth","science","life","history","discovery"],openGraph:{title:"Orion — A Universe of Discovery",description:"A growing atlas of the universe, life, time, and everything we discover.",type:"website"}};
export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:"#080b16"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}<GlobalSearch/><BackToTop/></body></html>}
