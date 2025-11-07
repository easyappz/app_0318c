import React from 'react';
import Calculator from '../components/Calculator/Calculator';
import '../styles/calculator.css';

const Home = () => {
  return (
    <main data-easytag="id1-src/pages/Home.js" className="min-h-screen w-full flex items-center justify-center p-4">
      <section data-easytag="id2-src/pages/Home.js" aria-label="Калькулятор" className="w-full max-w-sm sm:max-w-md">
        <h1 data-easytag="id3-src/pages/Home.js" className="mb-4 text-center text-xl sm:text-2xl font-semibold">Это калькулятор</h1>
        <Calculator />
      </section>
    </main>
  );
};

export default Home;
