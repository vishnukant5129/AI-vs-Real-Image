import React, { useState } from "react";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import ResultCard from "./components/ResultCard";
import Footer from "./components/Footer";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <UploadSection onResult={setResult} />
        {result && <ResultCard result={result} />}
      </main>
      <Footer />
    </div>
  );
}
