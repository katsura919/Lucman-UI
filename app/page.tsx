'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    artists: '',
    album: '',
    popularity: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    prediction: number;
    confidence_level: number;
  }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          genre: formData.genre,
          artists: formData.artists,
          album: formData.album,
          popularity: Number(formData.popularity),
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert('Prediction failed. Is the API running?');
    }

    setLoading(false);
  };

  return (
    <div className="dark bg-black min-h-screen">
      <BackgroundBeamsWithCollision className='min-h-screen'>
      <main className="min-h-screen bg-gradient-to-br text-white flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md rounded-3xl shadow-2xl">
          <CardContent className="p-8 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-2"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                🎵 Spotify Explicit Predictor
              </h1>
              <p className="text-sm text-zinc-400">
                Predict if a track contains explicit content.
              </p>
            </motion.div>

            <div className="grid gap-6">
              {['name', 'genre', 'artists', 'album', 'popularity'].map((field, i) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="space-y-1"
                >
                  <Label htmlFor={field} className="text-sm text-zinc-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    type={field === 'popularity' ? 'number' : 'text'}
                    placeholder={`Enter ${field}`}
                    className="bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-green-500/70 transition duration-200 rounded-lg px-4 py-2"
                  />
                </motion.div>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full  bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              {loading ? 'Predicting...' : 'Predict'}
            </Button>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-6 bg-zinc-800/70 p-6 rounded-xl border border-zinc-700 space-y-2 text-center"
                >
                  <p className="text-lg font-semibold">
                    This Spotify track{' '}
                    <span
                      className={`${
                        result.prediction === 1 ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {result.prediction === 1 ? 'likely contains explicit content 🔞' : 'does not contain explicit content ✅'}
                    </span>
                  </p>
                  <p className="text-sm text-zinc-400">
                    Confidence Level: {(result.confidence_level * 100).toFixed(2)}%
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </CardContent>
        </Card>
      </main>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
