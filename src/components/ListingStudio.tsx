import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Upload, 
  Wand2, 
  RefreshCw, 
  Download, 
  Camera, 
  Tag, 
  FileEdit,
  ArrowRight
} from 'lucide-react';

export const ListingStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'writer' | 'photo-generator'>('writer');

  // Listing Writer State
  const [itemTitle, setItemTitle] = useState('Hand-carved Black Walnut Cutting Board');
  const [itemDetails, setItemDetails] = useState('Sustainably sourced walnut, organic beeswax and mineral oil finish, juice groove, brass hanging loop. Dimensions 16x11 inches.');
  const [targetAudience, setTargetAudience] = useState('Home cooks, wedding gift buyers, culinary enthusiasts');
  const [platform, setPlatform] = useState('Etsy');
  const [productImageBase64, setProductImageBase64] = useState<string | null>(null);
  const [isGeneratingListing, setIsGeneratingListing] = useState(false);
  const [generatedListing, setGeneratedListing] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Photo Studio State
  const [photoPrompt, setPhotoPrompt] = useState('Product photography of a luxury handcrafted dark walnut cutting board with organic artisanal sourdough loaf, knife, and rosemary sprigs on white marble countertop, warm golden hour sunlight, commercial studio quality.');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [referencePhotoBase64, setReferencePhotoBase64] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [activeImageModel, setActiveImageModel] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const loadPreset = (preset: 'cuttingboard' | 'candle' | 'wallet' | 'ceramics') => {
    if (preset === 'cuttingboard') {
      setItemTitle('Hand-carved Black Walnut Cutting Board');
      setItemDetails('Sustainably harvested walnut, organic beeswax and mineral oil finish, deep juice groove, brass hanging eyelet. 16x11 inches.');
      setTargetAudience('Home chefs, hostesses, wedding registry, modern rustic home decor');
      setPlatform('Etsy');
    } else if (preset === 'candle') {
      setItemTitle('Amber Glass Coconut Soy Wax Candle - Smoked Vanilla & Cedar');
      setItemDetails('100% natural soy-coconut wax blend, cracked wooden wick with campfire crackle, 50-hour burn time, phthalate-free essential oils in amber apothecary jar.');
      setTargetAudience('Cozy home aesthetics, holiday stocking stuffer, aromatherapy lovers');
      setPlatform('Etsy');
    } else if (preset === 'wallet') {
      setItemTitle('Minimalist Full-Grain Leather Cardholder Wallet');
      setItemDetails('Italian vegetable-tanned Badalassi Carlo leather, hand-stitched with waxed linen thread, burnished edges, holds 6-8 cards plus folded cash.');
      setTargetAudience('Everyday carry (EDC) enthusiasts, menswear aficionados, durable goods seekers');
      setPlatform('eBay');
    } else {
      setItemTitle('Handmade Ceramic Speckled Matcha Bowl (Chawan)');
      setItemDetails('Wheel-thrown stoneware clay, food-safe satin matte oatmeal glaze with rustic iron speckles, comfortable curved ergonomic grip, 14oz capacity.');
      setTargetAudience('Tea ceremony lovers, slow living enthusiasts, unique ceramics collectors');
      setPlatform('Shopify');
    }
  };

  const handleListingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setReferencePhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateListing = async () => {
    if (!itemTitle.trim()) return;
    setIsGeneratingListing(true);
    setGeneratedListing(null);

    try {
      const res = await fetch('/api/gemini/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: itemTitle,
          details: itemDetails,
          platform,
          audience: targetAudience,
          imageBase64: productImageBase64,
        }),
      });
      const data = await res.json();
      if (data.listing) {
        setGeneratedListing(data.listing);
      } else {
        setGeneratedListing('Unable to generate listing. Please try again.');
      }
    } catch (err: any) {
      setGeneratedListing('Error: ' + err.message);
    } finally {
      setIsGeneratingListing(false);
    }
  };

  const generateProductPhoto = async () => {
    if (!photoPrompt.trim()) return;
    setIsGeneratingImage(true);
    setPhotoError(null);
    setGeneratedImageUrl(null);

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: photoPrompt,
          aspectRatio,
          referenceImageBase64: referencePhotoBase64,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setActiveImageModel(data.model || 'Studio Engine');
      } else {
        setPhotoError(data.error || 'Could not generate product image.');
      }
    } catch (err: any) {
      setPhotoError('Image generation failed: ' + err.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopy = () => {
    if (!generatedListing) return;
    navigator.clipboard.writeText(generatedListing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md border border-stone-200/90 p-2 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('writer')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition cursor-pointer ${
              activeSubTab === 'writer'
                ? 'bg-stone-900 text-stone-50 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Listing Writer</span>
          </button>
          <button
            onClick={() => setActiveSubTab('photo-generator')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition cursor-pointer ${
              activeSubTab === 'photo-generator'
                ? 'bg-stone-900 text-stone-50 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Product Photo Studio</span>
          </button>
        </div>

        <span className="text-xs text-stone-500 flex items-center gap-1.5 px-3">
          <Sparkles className="w-3.5 h-3.5 text-[#d97346]" />
          Turn raw craft into high-converting sales assets
        </span>
      </div>

      {activeSubTab === 'writer' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
            <div>
              <h3 className="font-semibold text-stone-900 text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#d97346]" />
                Product Listing Architect
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Outputs search-optimized titles, algorithm tags, and high-converting descriptions for Etsy, eBay, or Shopify.
              </p>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-medium text-stone-500 block mb-1.5">Load Idea Template:</span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => loadPreset('cuttingboard')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200/80 hover:border-stone-400 text-stone-700 text-left truncate transition cursor-pointer"
                >
                  🪵 Walnut Board
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('candle')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200/80 hover:border-stone-400 text-stone-700 text-left truncate transition cursor-pointer"
                >
                  🕯️ Soy Candle
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('wallet')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200/80 hover:border-stone-400 text-stone-700 text-left truncate transition cursor-pointer"
                >
                  💼 Leather Wallet
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('ceramics')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200/80 hover:border-stone-400 text-stone-700 text-left truncate transition cursor-pointer"
                >
                  🍵 Matcha Bowl
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-medium block mb-1">Product Title or Concept</label>
                <input
                  type="text"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-700 transition"
                  placeholder="e.g. Handmade Ceramic Mug"
                />
              </div>

              <div>
                <label className="text-stone-700 font-medium block mb-1">Materials, Dimensions & Unique Selling Points</label>
                <textarea
                  value={itemDetails}
                  onChange={(e) => setItemDetails(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl p-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-700 transition"
                  placeholder="e.g. Dimensions, organic beeswax, heirloom quality, brass rivets..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-medium block mb-1">Target Marketplace</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-700 cursor-pointer"
                  >
                    <option value="Etsy">Etsy (Handmade & Vintage)</option>
                    <option value="eBay">eBay (Collectors & Direct)</option>
                    <option value="Shopify">Shopify / Direct Brand Store</option>
                    <option value="TikTok Shop">TikTok Shop / Social</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 font-medium block mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 placeholder:text-stone-400"
                    placeholder="e.g. Gift givers, home cooks"
                  />
                </div>
              </div>

              {/* Optional Photo Attachment */}
              <div>
                <label className="text-stone-700 font-medium block mb-1">
                  Optional Product Snapshot (Vision Analysis)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-2 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-xl flex items-center gap-2 text-stone-700 transition">
                    <Upload className="w-3.5 h-3.5 text-[#d97346]" />
                    <span>{productImageBase64 ? 'Change Photo' : 'Upload Item Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleListingImageUpload}
                      className="hidden"
                    />
                  </label>
                  {productImageBase64 && (
                    <div className="flex items-center gap-2">
                      <img
                        src={productImageBase64}
                        alt="Thumbnail"
                        className="w-9 h-9 rounded-lg object-cover border border-stone-300"
                      />
                      <button
                        type="button"
                        onClick={() => setProductImageBase64(null)}
                        className="text-stone-500 hover:text-rose-600 text-[11px] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={generateListing}
              disabled={isGeneratingListing || !itemTitle.trim()}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-50 font-semibold text-xs sm:text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGeneratingListing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Listing Copy...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Listing Copy & SEO Tags
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#d97346]" />
                  <h3 className="font-semibold text-stone-900 text-sm">
                    Generated Marketplace Package
                  </h3>
                </div>

                {generatedListing && (
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                )}
              </div>

              {isGeneratingListing ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-stone-700">
                    Crafting search-optimized titles, algorithm tags, and buyer story...
                  </p>
                </div>
              ) : generatedListing ? (
                <div className="text-stone-800 whitespace-pre-wrap leading-relaxed font-sans overflow-y-auto max-h-[500px] pr-2 text-xs sm:text-sm">
                  {generatedListing}
                </div>
              ) : (
                <div className="py-20 text-center text-stone-500 space-y-2">
                  <ShoppingBag className="w-9 h-9 mx-auto text-stone-300" />
                  <p className="text-sm font-medium text-stone-600">
                    Ready to generate your listing
                  </p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Select a preset or enter your product details on the left, then click Generate.
                  </p>
                </div>
              )}
            </div>

            {generatedListing && (
              <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
                <span>Optimized for buyer discovery & conversions</span>
                <button
                  onClick={() => setActiveSubTab('photo-generator')}
                  className="text-[#d97346] hover:text-[#b85b2e] flex items-center gap-1 font-medium cursor-pointer"
                >
                  Next: Product Photo Studio <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Part 2: AI Photo Studio */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Photo Generation Form */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
            <div>
              <h3 className="font-semibold text-stone-900 text-base">Product Photo & Mockup Studio</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Create commercial-grade hero shots, flat-lays, and social lifestyle scenes, or edit existing photos.
              </p>
            </div>

            {/* Prompt */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-medium block mb-1">
                  Scene Description / Product Prompt
                </label>
                <textarea
                  value={photoPrompt}
                  onChange={(e) => setPhotoPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-700 transition font-sans text-xs"
                  placeholder="Describe the product, lighting, surfaces, background props, and aesthetic..."
                />
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="text-stone-700 font-medium block mb-1.5">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1:1', '4:3', '3:4', '16:9'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 rounded-lg border text-xs font-mono font-medium transition cursor-pointer ${
                        aspectRatio === ratio
                          ? 'bg-stone-900 border-stone-900 text-white'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Edit Mode Attachment */}
              <div className="pt-2 border-t border-stone-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-stone-700 font-medium">Edit Existing Photo (Optional)</label>
                  {referencePhotoBase64 && (
                    <button
                      type="button"
                      onClick={() => setReferencePhotoBase64(null)}
                      className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-2 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-xl flex items-center gap-2 text-stone-700 transition text-xs">
                    <Upload className="w-3.5 h-3.5 text-[#d97346]" />
                    <span>{referencePhotoBase64 ? 'Replace Reference Photo' : 'Upload Photo to Edit'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReferenceImageUpload}
                      className="hidden"
                    />
                  </label>
                  {referencePhotoBase64 && (
                    <img
                      src={referencePhotoBase64}
                      alt="Ref"
                      className="w-10 h-10 rounded-lg object-cover border border-stone-300"
                    />
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Upload an unedited smartphone photo, then prompt to adjust lighting, replace background, or stage in a home.
                </p>
              </div>

              {/* Sample Photo Prompts */}
              <div>
                <span className="text-[11px] font-medium text-stone-500 block mb-1">Quick Prompts:</span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoPrompt(
                        'Warm minimalist flat lay of a handmade leather wallet with brass keyhook, cup of hot espresso, on reclaimed dark oak table, soft morning window light.'
                      )
                    }
                    className="w-full text-left p-2 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] text-stone-700 hover:border-stone-400 truncate transition cursor-pointer"
                  >
                    ☕ Leather Wallet Coffee Shop Flat Lay
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoPrompt(
                        'Amber apothecary jar candle lit in a cozy cabin living room with soft woolen knit blanket, fireplace glow in background, rustic holiday aesthetic.'
                      )
                    }
                    className="w-full text-left p-2 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] text-stone-700 hover:border-stone-400 truncate transition cursor-pointer"
                  >
                    🕯️ Amber Candle Fireplace Lifestyle
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoPrompt(
                        'Studio commercial shot of artisan handcrafted ceramic matcha bowl with whisk and vibrant green ceremonial matcha foam, pristine white studio backdrop, soft diffused shadows.'
                      )
                    }
                    className="w-full text-left p-2 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] text-stone-700 hover:border-stone-400 truncate transition cursor-pointer"
                  >
                    🍵 Clean Studio Ceramic Matcha Bowl
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={generateProductPhoto}
              disabled={isGeneratingImage || !photoPrompt.trim()}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-50 font-semibold text-xs sm:text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGeneratingImage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Commercial Image...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Render Product Photo ({referencePhotoBase64 ? 'Edit Mode' : 'New Scene'})
                </>
              )}
            </button>
          </div>

          {/* Photo Preview Panel */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#d97346]" />
                  <h3 className="font-semibold text-stone-900 text-sm">Product Photography Canvas</h3>
                </div>

                {generatedImageUrl && (
                  <a
                    href={generatedImageUrl}
                    download="product_photo.png"
                    className="px-2.5 py-1 rounded-lg bg-[#d97346] hover:bg-[#c26538] text-white text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Image</span>
                  </a>
                )}
              </div>

              {photoError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {photoError}
                </div>
              )}

              {isGeneratingImage ? (
                <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-semibold text-stone-800">Rendering product photo...</p>
                  <p className="text-xs text-stone-500 max-w-sm">
                    Synthesizing realistic lighting, texture, and commercial studio perspective.
                  </p>
                </div>
              ) : generatedImageUrl ? (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center max-h-[480px]">
                    <img
                      src={generatedImageUrl}
                      alt="Generated product shot"
                      className="max-h-[480px] w-auto object-contain rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                    <span>Aspect Ratio: {aspectRatio}</span>
                    <span className="text-emerald-700 font-medium">Ready for marketplace hero banner</span>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center text-stone-400 space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto text-stone-300" />
                  <p className="text-sm font-medium text-stone-600">No Image Rendered Yet</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Type a prompt or choose a quick preset on the left to generate realistic product lifestyle photography.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200/80 text-xs text-stone-400 flex items-center justify-between">
              <span>High-resolution product export</span>
              <span>Commercial License</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
