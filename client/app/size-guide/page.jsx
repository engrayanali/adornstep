'use client';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Ruler, Info } from 'lucide-react';

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-taupe-100 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Ruler className="w-16 h-16 mx-auto mb-6 text-terracotta-500" />
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-charcoal-800 mb-6">
            Size Guide
          </h1>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            Find your perfect fit with our comprehensive sizing guide
          </p>
        </div>
      </section>

      {/* How to Measure */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-product mb-12">
            <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-8">How to Measure Your Feet</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-charcoal-800 mb-4">Step-by-Step Instructions</h3>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-terracotta-500 text-white rounded-full flex items-center justify-center font-semibold">1</span>
                    <div>
                      <p className="text-charcoal-600">
                        Place a piece of paper on a flat surface against a wall.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-terracotta-500 text-white rounded-full flex items-center justify-center font-semibold">2</span>
                    <div>
                      <p className="text-charcoal-600">
                        Stand on the paper with your heel against the wall.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-terracotta-500 text-white rounded-full flex items-center justify-center font-semibold">3</span>
                    <div>
                      <p className="text-charcoal-600">
                        Mark the longest part of your foot (from heel to toe).
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-terracotta-500 text-white rounded-full flex items-center justify-center font-semibold">4</span>
                    <div>
                      <p className="text-charcoal-600">
                        Measure the distance from the wall to the mark.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-terracotta-500 text-white rounded-full flex items-center justify-center font-semibold">5</span>
                    <div>
                      <p className="text-charcoal-600">
                        Use the measurement to find your size in our chart below.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-br from-blush-50 to-taupe-50 rounded-xl p-6">
                <Info className="w-12 h-12 text-terracotta-500 mb-4" />
                <h3 className="text-xl font-semibold text-charcoal-800 mb-4">Pro Tips</h3>
                <ul className="space-y-3 text-charcoal-600">
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">•</span>
                    <span>Measure your feet at the end of the day when they're at their largest</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">•</span>
                    <span>Measure both feet and use the larger measurement</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">•</span>
                    <span>Wear the type of socks you plan to wear with the shoes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">•</span>
                    <span>If you're between sizes, we recommend sizing up</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Size Chart - US Sizes */}
          <div className="mb-12">
            <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-6">US Women's Size Chart</h2>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-card">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-taupe-100 to-cream-100">
                    <th className="px-6 py-4 text-left text-charcoal-800 font-semibold">US Size</th>
                    <th className="px-6 py-4 text-left text-charcoal-800 font-semibold">EU Size</th>
                    <th className="px-6 py-4 text-left text-charcoal-800 font-semibold">UK Size</th>
                    <th className="px-6 py-4 text-left text-charcoal-800 font-semibold">Inches</th>
                    <th className="px-6 py-4 text-left text-charcoal-800 font-semibold">Centimeters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">5</td>
                    <td className="px-6 py-4 text-charcoal-600">35-36</td>
                    <td className="px-6 py-4 text-charcoal-600">3</td>
                    <td className="px-6 py-4 text-charcoal-600">8.5"</td>
                    <td className="px-6 py-4 text-charcoal-600">21.6 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">5.5</td>
                    <td className="px-6 py-4 text-charcoal-600">36</td>
                    <td className="px-6 py-4 text-charcoal-600">3.5</td>
                    <td className="px-6 py-4 text-charcoal-600">8.75"</td>
                    <td className="px-6 py-4 text-charcoal-600">22.2 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">6</td>
                    <td className="px-6 py-4 text-charcoal-600">36-37</td>
                    <td className="px-6 py-4 text-charcoal-600">4</td>
                    <td className="px-6 py-4 text-charcoal-600">9"</td>
                    <td className="px-6 py-4 text-charcoal-600">22.9 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">6.5</td>
                    <td className="px-6 py-4 text-charcoal-600">37</td>
                    <td className="px-6 py-4 text-charcoal-600">4.5</td>
                    <td className="px-6 py-4 text-charcoal-600">9.25"</td>
                    <td className="px-6 py-4 text-charcoal-600">23.5 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">7</td>
                    <td className="px-6 py-4 text-charcoal-600">37-38</td>
                    <td className="px-6 py-4 text-charcoal-600">5</td>
                    <td className="px-6 py-4 text-charcoal-600">9.5"</td>
                    <td className="px-6 py-4 text-charcoal-600">24.1 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">7.5</td>
                    <td className="px-6 py-4 text-charcoal-600">38</td>
                    <td className="px-6 py-4 text-charcoal-600">5.5</td>
                    <td className="px-6 py-4 text-charcoal-600">9.75"</td>
                    <td className="px-6 py-4 text-charcoal-600">24.8 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">8</td>
                    <td className="px-6 py-4 text-charcoal-600">38-39</td>
                    <td className="px-6 py-4 text-charcoal-600">6</td>
                    <td className="px-6 py-4 text-charcoal-600">10"</td>
                    <td className="px-6 py-4 text-charcoal-600">25.4 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">8.5</td>
                    <td className="px-6 py-4 text-charcoal-600">39</td>
                    <td className="px-6 py-4 text-charcoal-600">6.5</td>
                    <td className="px-6 py-4 text-charcoal-600">10.25"</td>
                    <td className="px-6 py-4 text-charcoal-600">26 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">9</td>
                    <td className="px-6 py-4 text-charcoal-600">39-40</td>
                    <td className="px-6 py-4 text-charcoal-600">7</td>
                    <td className="px-6 py-4 text-charcoal-600">10.5"</td>
                    <td className="px-6 py-4 text-charcoal-600">26.7 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">9.5</td>
                    <td className="px-6 py-4 text-charcoal-600">40</td>
                    <td className="px-6 py-4 text-charcoal-600">7.5</td>
                    <td className="px-6 py-4 text-charcoal-600">10.75"</td>
                    <td className="px-6 py-4 text-charcoal-600">27.3 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">10</td>
                    <td className="px-6 py-4 text-charcoal-600">40-41</td>
                    <td className="px-6 py-4 text-charcoal-600">8</td>
                    <td className="px-6 py-4 text-charcoal-600">11"</td>
                    <td className="px-6 py-4 text-charcoal-600">27.9 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">10.5</td>
                    <td className="px-6 py-4 text-charcoal-600">41</td>
                    <td className="px-6 py-4 text-charcoal-600">8.5</td>
                    <td className="px-6 py-4 text-charcoal-600">11.25"</td>
                    <td className="px-6 py-4 text-charcoal-600">28.6 cm</td>
                  </tr>
                  <tr className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal-700">11</td>
                    <td className="px-6 py-4 text-charcoal-600">41-42</td>
                    <td className="px-6 py-4 text-charcoal-600">9</td>
                    <td className="px-6 py-4 text-charcoal-600">11.5"</td>
                    <td className="px-6 py-4 text-charcoal-600">29.2 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Width Guide */}
          <div className="bg-white rounded-2xl p-8 shadow-card mb-12">
            <h2 className="text-2xl font-display font-semibold text-charcoal-800 mb-6">Width Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-cream-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Narrow (B)</h3>
                <p className="text-charcoal-600">
                  For feet that are slimmer than average. Shoes feel loose in standard widths.
                </p>
              </div>
              <div className="bg-cream-50 rounded-xl p-6 border-2 border-terracotta-500">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-charcoal-800">Medium (D)</h3>
                  <span className="text-xs bg-terracotta-500 text-white px-2 py-1 rounded-full">Most Common</span>
                </div>
                <p className="text-charcoal-600">
                  Standard width for most women. This is our default width.
                </p>
              </div>
              <div className="bg-cream-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Wide (E/EE)</h3>
                <p className="text-charcoal-600">
                  For feet that are wider than average. Standard widths feel tight.
                </p>
              </div>
            </div>
          </div>

          {/* Fit Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-taupe-50 to-cream-100 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-charcoal-800 mb-6">Perfect Fit Checklist</h3>
              <ul className="space-y-3 text-charcoal-600">
                <li className="flex items-start gap-3">
                  <span className="text-terracotta-500 text-xl">✓</span>
                  <span>There should be about 1/2 inch of space between your longest toe and the end of the shoe</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta-500 text-xl">✓</span>
                  <span>Your heel should not slip when walking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta-500 text-xl">✓</span>
                  <span>The widest part of your foot should align with the widest part of the shoe</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta-500 text-xl">✓</span>
                  <span>You should be able to wiggle your toes comfortably</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blush-50 to-taupe-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-charcoal-800 mb-6">Still Unsure?</h3>
              <p className="text-charcoal-600 mb-6 leading-relaxed">
                If you're between sizes or unsure about your fit, our customer service team is here to help! 
                We can provide personalized sizing recommendations based on your measurements and the specific 
                style you're interested in.
              </p>
              <a 
                href="/contact"
                className="inline-block px-6 py-3 bg-charcoal-800 text-white font-semibold rounded-full hover:bg-charcoal-700 transition-all duration-300"
              >
                Contact Us for Help
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
